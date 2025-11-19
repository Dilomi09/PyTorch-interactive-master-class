# PyTorch Master Class

**Master deep learning through interactive visuals and liquid interfaces.**

PyTorch Master Class is a premium, web-based educational platform designed to teach PyTorch concepts—from basic Tensors to complex Training Loops—using a stunning "Liquid Glass" UI (inspired by macOS visionOS).

It features a **split-screen learning environment** where users can read theory, write code, and see real-time visualizations of their neural networks and training metrics.

## 🌟 Key Features

*   **Interactive Playground**: Write and execute PyTorch code directly in the browser.
*   **Apple Silicon (MPS) Optimized**: The backend automatically detects Mac M-series chips to run computations on the Neural Engine via Metal Performance Shaders.
*   **Real-time Visualizations**:
    *   **Network Viz**: Dynamically renders your `nn.Module` architecture.
    *   **Training Curves**: Live plotting of loss history during training loops.
*   **Liquid Glass Design**: A highly polished UI with blur effects, animations, and theme-aware glassmorphism (Light/Dark modes).
*   **Course Map & Deep Linking**: Track your progress and jump to specific sections (Theory, Examples, Exercises) via a sliding drawer.
*   **Session Management**: Save and Load your progress (XP, completed modules) via JSON files.
*   **Custom Data Injection**: Inject raw text or CSV data into the Python environment to test models with your own inputs.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: Next.js 14+ (App Router)
*   **Styling**: Tailwind CSS + Custom CSS Variables (P3 Color Space)
*   **State Management**: Zustand (with local storage persistence)
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **Charts**: Recharts

### Backend
*   **Server**: FastAPI (Python)
*   **Runtime**: PyTorch (Torch)
*   **Execution**: Safe `exec()` wrapper with stdout capturing and variable introspection.

---

## 🚀 Installation & Setup

### Prerequisites
1.  **Node.js** (v18 or higher)
2.  **Python** (v3.9 or higher)

### 1. Set up the Backend (Python)

The backend handles code execution. It is designed to run locally on your machine to leverage your GPU/NPU.

1.  Open a terminal and navigate to the project root.
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the FastAPI server:
    ```bash
    python main.py
    ```
    *You should see: `Server starting on http://0.0.0.0:8000`*

### 2. Set up the Frontend (Next.js)

1.  Open a new terminal window (keep the backend running).
2.  Install Node modules:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to: `http://localhost:3000`

---

## 📚 User Guide

### Navigation (The Dock)
On the left side of the screen is the floating **Dock**:
*   **Home**: Return to the Landing Page / Bento Grid.
*   **Course Map**: Opens the Table of Contents drawer.
*   **Playground**: Jumps to the current active module.
*   **XP Badge**: Shows your current experience points.
*   **Save/Load**: Download your progress as `.json` or upload a previous save file.
*   **Theme Toggle**: Switch between "Ice White" (Light) and "Deep Space" (Dark) modes.

### The Learning Interface
When you enter a module, the screen is split:
*   **Left Panel**: Interactive Markdown content. It explains the theory.
*   **Right Panel**: The Coding Playground.

### Running Code
1.  Read the instructions on the left.
2.  Modify the code in the **Editor** on the right.
3.  Click the **Run** button.
    *   The code is sent to your local Python backend.
    *   It executes on your hardware (checking for MPS/CUDA).
    *   Output is displayed in the terminal below.

### Visualizations
The bottom-right panel has tabs to switch views:
*   **Terminal**: Standard text output (`print` statements).
*   **Network**: If you define a class inheriting from `nn.Module`, this tab visualizes the layers (Conv2d, Linear, ReLU, etc.).
*   **Training**: If your code populates a list named `loss_history`, this tab renders a real-time line chart of your training loss.

### Injecting Custom Data
Want to test the code with your own numbers?
1.  Click **"Input Data"** above the editor.
2.  Type or paste your data (e.g., `1.5, 2.0, 5.1`).
3.  In the Python code, access this string via the variable `user_data`.
4.  Example usage:
    ```python
    data_list = [float(x) for x in user_data.split(',')]
    tensor = torch.tensor(data_list, device=device)
    print(tensor)
    ```

### Hardware Acceleration
The platform automatically injects a `device` variable into your code scope.
*   On **Mac M-series**, `device` is set to `mps` (Metal Performance Shaders).
*   On **NVIDIA**, it is set to `cuda`.
*   Otherwise, it defaults to `cpu`.

Always use `.to(device)` on your models and tensors to ensure maximum performance.

---

## ⚠️ Troubleshooting

**"Backend error" or "Local Simulation Mode"**
*   This means the frontend cannot talk to `localhost:8000`.
*   Ensure you ran `python main.py` and the terminal shows the server is active.
*   If the backend is down, the app falls back to a simulation mode (mock data) so you can still navigate the UI, but code execution won't be real.

**Visualizations not showing?**
*   **Network Viz**: Ensure your model instance is named `net` or `model`, or simply print it: `print(model)`. The backend looks for `nn.Module` objects in the local scope.
*   **Training Curve**: Ensure you append loss values to a list named exactly `loss_history`.
