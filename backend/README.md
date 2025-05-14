# Creator Tool Suite Backend

## Setup

1. Copy `.env.example` to `.env` and add your OpenAI API key.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend will be available at `http://localhost:8000/generate` and is ready to work with your React frontend.
