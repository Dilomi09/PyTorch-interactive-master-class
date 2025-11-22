export const MODULES = [
  {
    id: 'tensors-101',
    title: 'Tensors 101: Metal & MPS',
    description: 'Learn the fundamentals of PyTorch Tensors and how to accelerate them on Apple Silicon (Mac M4).',
    difficulty: 'Beginner',
    estimatedTime: '15 min',
    tags: ['Basics', 'MPS', 'GPU'],
    initialCode: `import torch

# 1. Check available device (Autoconfigured for Mac M4)
print(f"Using device: {device}")

# 2. Create a tensor on the device
x = torch.tensor([[1., 2., 3.], [4., 5., 6.]], device=device)
print("Tensor x on device:", x)

# 3. Input Data Integration
# If you entered text in the 'Input Data' tab, it appears here
if user_data:
    print(f"Received user data: {user_data}")
    # Example: Convert simple comma-separated numbers to tensor
    try:
        data_list = [float(i) for i in user_data.split(',')]
        y = torch.tensor(data_list, device=device)
        print("Created tensor from input:", y)
    except:
        print("Could not parse user data as numbers")
else:
    print("No user input provided. Try opening the 'Input Data' tab!")
`,
    content: `# Tensors on Apple Silicon

PyTorch Tensors are the building blocks of Deep Learning. On your MacBook Pro M4, we can use **Metal Performance Shaders (MPS)** to accelerate calculations.

## The \`device\` Variable

We have automatically injected a variable called \`device\` into your environment.
*   On Mac M4: \`device = torch.device("mps")\`
*   On NVIDIA: \`device = torch.device("cuda")\`
*   Fallback: \`device = torch.device("cpu")\`

## Custom Data

You can inject data into your script using the **"Input Data"** button above the editor. The text you type there is available as the string variable \`user_data\`.

**Task:**
1. Open "Input Data".
2. Type \`10, 20, 30\`.
3. Run the code to see it converted to a Tensor on the GPU!`
  },
  {
    id: 'neural-nets',
    title: 'Building Neural Networks',
    description: 'Construct your first neural network using torch.nn.Module.',
    difficulty: 'Intermediate',
    estimatedTime: '30 min',
    tags: ['Architecture', 'Layers'],
    initialCode: `import torch
import torch.nn as nn
import torch.nn.functional as F

class SimpleNet(nn.Module):
    def __init__(self):
        super(SimpleNet, self).__init__()
        # 1 input channel, 6 output channels, 5x5 square convolution
        self.conv1 = nn.Conv2d(1, 6, 5)
        self.conv2 = nn.Conv2d(6, 16, 5)
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)

    def forward(self, x):
        x = F.max_pool2d(F.relu(self.conv1(x)), (2, 2))
        x = F.max_pool2d(F.relu(self.conv2(x)), 2)
        x = torch.flatten(x, 1)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return x

# Move model to MPS device
net = SimpleNet().to(device)
print(net)

# Dummy input on device
input = torch.randn(1, 1, 32, 32, device=device)
out = net(input)
print("Output shape:", out.shape)
print("Output device:", out.device)
`,
    content: `# Defining the Network

Neural networks in PyTorch are defined as classes that inherit from \`nn.Module\`.

## Structure

*   **__init__**: Define the layers (convolutions, linear layers, etc.)
*   **forward**: Define how the data moves through the layers.

## Moving to GPU (MPS)

Note how we call \`.to(device)\` on the model and pass \`device=device\` to the input tensor. This ensures operations happen on your Mac's neural engine.

The \`SimpleNet\` in the editor is a classic LeNet-style architecture. Click the **"Network" tab** below to visualize it!`
  },
  {
    id: 'training-loop',
    title: 'The Training Loop',
    description: 'Master the art of backpropagation, loss calculation, and optimization.',
    difficulty: 'Advanced',
    estimatedTime: '45 min',
    tags: ['Optimization', 'Backprop'],
    initialCode: `import torch
import torch.nn as nn
import torch.optim as optim

# 1. Data (On Device)
X = torch.unsqueeze(torch.linspace(-1, 1, 100), dim=1).to(device)
y = X.pow(2) + 0.2*torch.rand(X.size(), device=device)

# 2. Model (On Device)
net = nn.Sequential(
    nn.Linear(1, 10),
    nn.ReLU(),
    nn.Linear(10, 1)
).to(device)

# 3. Loss and Optimizer
criterion = nn.MSELoss()
optimizer = optim.SGD(net.parameters(), lr=0.2)

loss_history = []

# 4. Training Loop
print(f"Training on {device}...")
for epoch in range(100):
    optimizer.zero_grad()   # Clear gradients
    output = net(X)         # Forward pass
    loss = criterion(output, y) # Compute loss
    loss.backward()         # Backpropagation
    optimizer.step()        # Update weights
    
    loss_history.append(loss.item())
    
    if epoch % 10 == 0:
        print(f"Epoch {epoch}, Loss: {loss.item():.4f}")

print("Training complete.")
`,
    content: `# The Training Loop

This is where the magic happens. A typical PyTorch training loop consists of:

1.  **Forward Pass**: Compute prediction.
2.  **Compute Loss**: Compare prediction to ground truth.
3.  **Zero Gradients**: Clear previous gradients.
4.  **Backward Pass**: Calculate gradients (\`loss.backward()\`).
5.  **Step**: Update weights (\`optimizer.step()\`).

## Visualization
We automatically detect the variable \`loss_history\`. Run the code and check the **"Training" tab** to see your model learning in real-time!`
  }
];
