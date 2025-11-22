# PyTorch Master Class Setup Walkthrough

I have successfully set up and started the online course. Here is what was done:

## 1. Backend Setup (Python)
- **Issue**: The system Python version is 3.14.0, which caused compatibility issues with the pinned versions in `requirements.txt` (specifically `pydantic-core`).
- **Fix**: I modified `requirements.txt` to remove version pinning, allowing `pip` to install the latest compatible versions.
- **Installation**: Installed dependencies using the existing virtual environment (`venv`).
- **Status**: The backend server is running on `http://0.0.0.0:8000` and has detected Apple Silicon (MPS) support.

## 2. Frontend Setup (React/Vite)
- **Installation**: Installed Node.js dependencies using `npm install`.
- **Status**: The frontend development server is running on `http://localhost:3000`.

## How to Access
You can now access the course by opening your browser to:
**[http://localhost:3000](http://localhost:3000)**

## How to Stop
To stop the servers, you can use `Ctrl+C` in the respective terminal windows (if you had access to them) or I can stop them for you. Currently, they are running in the background.

## Future Runs
To run the course in the future, you can use the following commands:

**Terminal 1 (Backend):**
```bash
./venv/bin/python main.py
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```
