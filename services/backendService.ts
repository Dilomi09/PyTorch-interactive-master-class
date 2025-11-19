import { ExecutionResponse, ModelLayer } from '../types';

// Helper to parse Python output for visualization (Mock Logic Fallback)
const parseMockOutput = (code: string, stdout: string): Partial<ExecutionResponse> => {
  const response: Partial<ExecutionResponse> = {};

  // Mock Loss History detection
  if (code.includes('loss_history')) {
    // Generate a fake descending loss curve if the code looks like training
    const steps = 20;
    const history = Array.from({ length: steps }, (_, i) => Math.exp(-i * 0.2) + Math.random() * 0.05);
    response.loss_history = history;
  }

  // Mock Network Structure detection
  if (code.includes('nn.Module') || code.includes('nn.Sequential')) {
     // Simplified parsing logic for demo purposes
     const structure: ModelLayer[] = [];
     if (code.includes('Conv2d')) structure.push({ type: 'Conv2d', params: 'in=1, out=6' });
     if (code.includes('ReLU')) structure.push({ type: 'ReLU', params: '' });
     if (code.includes('MaxPool2d')) structure.push({ type: 'MaxPool2d', params: 'k=2, s=2' });
     if (code.includes('Linear')) structure.push({ type: 'Linear', params: 'in=120, out=84' });
     
     // Fallback for the specific demo
     if (structure.length === 0) {
        response.model_structure = [
          { type: 'Linear', params: 'in=1, out=10' },
          { type: 'ReLU', params: '' },
          { type: 'Linear', params: 'in=10, out=1' }
        ];
     } else {
         response.model_structure = structure;
     }
  }

  return response;
};

export const executeCode = async (code: string, userData: string = ""): Promise<ExecutionResponse> => {
  try {
    // Try connecting to the real backend first
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const response = await fetch('http://localhost:8000/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, user_data: userData }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.warn("Backend error, status:", response.status);
    }
  } catch (err) {
    console.log("Backend unavailable (using local simulation):", err);
  }

  // --- MOCK FALLBACK IMPLEMENTATION ---
  try {
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulated network delay

    // Basic mock stdout generation
    let mockStdout = ">> Local Simulation Mode (Backend Offline)\n";
    if (userData) {
        mockStdout += `>> Loaded User Data: "${userData.substring(0, 20)}..."\n`;
    }
    
    if (code.includes('print')) {
      const lines = code.split('\n');
      lines.forEach(line => {
        // Very naive print parsing for the mock
        const printMatch = line.match(/print\((.*)\)/);
        if (printMatch) {
           let content = printMatch[1];
           content = content.replace(/["']/g, '');
           if (!content.includes(',')) { // Don't try to parse complex prints in mock
               mockStdout += `> ${content}\n`;
           }
        }
      });
    }
    
    if (code.includes('training complete') || code.includes('loss_history')) {
        mockStdout += "Epoch 0, Loss: 0.8921\nEpoch 10, Loss: 0.4321\nEpoch 20, Loss: 0.1231\nTraining complete.";
    }
    
    // Simulate device print if requested
    if (code.includes('device')) {
        mockStdout += "device(type='cpu')\n"; // Mock is always CPU
    }

    const extraData = parseMockOutput(code, mockStdout);

    return {
      stdout: mockStdout,
      ...extraData
    };
  } catch (error: any) {
    return {
      stdout: '',
      error: error.message || "An unknown error occurred during execution."
    };
  }
};
