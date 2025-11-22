# PyTorch Master Class

**Master deep learning through interactive visuals and liquid interfaces.**

PyTorch Master Class is a premium, web-based educational platform designed to teach PyTorch concepts—from basic Tensors to complex Training Loops—using a stunning "Liquid Glass" UI (inspired by macOS visionOS).

## 🌟 How to Run

### 1. Local Full Power Mode (Recommended for M4 Mac)
To use **Hardware Acceleration (Metal/MPS)**, train real models, and use your actual GPU, you must run the Python backend locally.

1.  **Setup Backend**:
    ```bash
    # Install dependencies
    pip install -r requirements.txt
    
    # Run the server
    python main.py
    ```
    *Ensure `main.py` is running! If the file is empty or corrupt, copy the code from the repository again.*

2.  **Setup Frontend**:
    ```bash
    npm install
    npm run dev
    ```
3.  **Open App**: Go to `http://localhost:3000`.
    *   When you click "Run", it sends code to your Python server.
    *   You will see `Using device: mps` in the output if using an Apple Silicon Mac.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: Next.js 14+ (App Router)
*   **Styling**: Tailwind CSS + Custom CSS Variables (P3 Color Space)
*   **State Management**: Zustand (with local storage persistence)
*   **Animations**: Framer Motion
*   **Charts**: Recharts

### Backend (Local Only)
*   **Server**: FastAPI (Python)
*   **Runtime**: PyTorch (Torch)
*   **Execution**: Safe `exec()` wrapper with stdout capturing and variable introspection.

---

## 📚 User Guide

### Navigation (The Dock)
On the left side of the screen is the floating **Dock**:
*   **Home**: Return to the Landing Page / Bento Grid.
*   **Course Map**: Opens the Table of Contents drawer.
*   **Playground**: Jumps to the current active module.
*   **Theme Toggle**: Switch between "Ice White" (Light) and "Deep Space" (Dark) modes.

### The Learning Interface
When you enter a module, the screen is split:
*   **Left Panel**: Interactive Markdown content. It explains the theory.
*   **Right Panel**: The Coding Playground.

### Visualizations
The bottom-right panel has tabs to switch views:
*   **Terminal**: Standard text output.
*   **Network**: If you define a class inheriting from `nn.Module`, this tab visualizes the layers.
*   **Training**: If your code populates a list named `loss_history`, this tab renders a real-time line chart.

### Injecting Custom Data
Want to test the code with your own numbers?
1.  Click **"Input Data"** above the editor.
2.  Type or paste your data.
3.  In the Python code, access this string via the variable `user_data`.
