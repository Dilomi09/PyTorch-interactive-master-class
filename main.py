from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn as nn
import sys
import io
import contextlib
import traceback

app = FastAPI()

# Allow CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Model
class ExecutionRequest(BaseModel):
    code: str
    user_data: str = ""

# Device Detection (Apple Silicon Support)
if torch.backends.mps.is_available():
    device = torch.device("mps")
    print(">> Backend: Running on Apple Silicon (MPS)")
elif torch.cuda.is_available():
    device = torch.device("cuda")
    print(">> Backend: Running on NVIDIA GPU (CUDA)")
else:
    device = torch.device("cpu")
    print(">> Backend: Running on CPU")

def sanitize_for_json(obj):
    """
    Recursively convert PyTorch tensors and numpy arrays to standard Python types (lists/floats)
    so they can be serialized to JSON without crashing.
    """
    if isinstance(obj, torch.Tensor):
        if obj.numel() == 1:
            return obj.item()
        return obj.tolist()
    elif isinstance(obj, list):
        return [sanitize_for_json(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: sanitize_for_json(v) for k, v in obj.items()}
    elif hasattr(obj, 'item'):  # numpy scalars
        return obj.item()
    return obj

def extract_model_structure(model: nn.Module):
    """
    Inspects a PyTorch model and returns a list of layer descriptions for visualization.
    """
    layers = []
    for name, module in model.named_children():
        # Create a readable parameter string (e.g., "in=10, out=5")
        params = []
        if hasattr(module, 'in_features'):
            params.append(f"in={module.in_features}")
        if hasattr(module, 'out_features'):
            params.append(f"out={module.out_features}")
        if hasattr(module, 'in_channels'):
            params.append(f"in={module.in_channels}")
        if hasattr(module, 'out_channels'):
            params.append(f"out={module.out_channels}")
        if hasattr(module, 'kernel_size'):
            params.append(f"k={module.kernel_size}")
        
        param_str = ", ".join(params)
        layers.append({
            "type": module.__class__.__name__,
            "params": param_str
        })
    
    # Fallback if no children (sequential or simple)
    if not layers:
        layers.append({"type": "Custom/Complex", "params": str(model)})
        
    return layers

@app.post("/execute")
async def execute_code(request: ExecutionRequest):
    code = request.code
    user_data = request.user_data
    
    # Capture stdout
    old_stdout = sys.stdout
    redirected_output = io.StringIO()
    sys.stdout = redirected_output
    
    # Execution Context
    # We inject 'torch', 'nn', and 'device' so the user doesn't have to import them (though they can)
    # We also inject 'user_data' so the user can access input.
    local_scope = {
        'torch': torch,
        'nn': nn,
        'device': device,
        'user_data': user_data
    }
    
    response = {}
    
    try:
        # Safe execution wrapper
        exec(code, local_scope, local_scope)
        
        # Restore stdout
        sys.stdout = old_stdout
        response['stdout'] = redirected_output.getvalue()
        
        # 1. Introspect for 'loss_history' (Training Curve)
        if 'loss_history' in local_scope:
            history = local_scope['loss_history']
            if isinstance(history, list) and len(history) > 0:
                # Sanitize to ensure JSON compliance
                response['loss_history'] = sanitize_for_json(history)
        
        # 2. Introspect for models (Network Viz)
        # We look for any variable that is an instance of nn.Module
        found_model = None
        # Prioritize variable named 'net' or 'model'
        if 'net' in local_scope and isinstance(local_scope['net'], nn.Module):
            found_model = local_scope['net']
        elif 'model' in local_scope and isinstance(local_scope['model'], nn.Module):
            found_model = local_scope['model']
        else:
            # Search values
            for val in local_scope.values():
                if isinstance(val, nn.Module):
                    found_model = val
                    break
        
        if found_model:
            response['model_structure'] = extract_model_structure(found_model)
            
    except Exception as e:
        sys.stdout = old_stdout
        response['stdout'] = redirected_output.getvalue()
        response['error'] = f"{type(e).__name__}: {str(e)}\n{traceback.format_exc()}"
        
    return response

if __name__ == "__main__":
    import uvicorn
    # Run on localhost:8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
