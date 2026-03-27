# Sentinel Mini SIEM - Full Stack Implementation

This project includes a React frontend and a Python (FastAPI) backend with MongoDB.

## 🚀 How to Run Everything

### 1. Frontend
The frontend runs automatically in this environment.
*   **Green WiFi Icon**: Indicates connection to the real Python backend.
*   **Yellow WiFi Icon**: Indicates "Simulation Mode" (Backend not found).

### 2. Backend (Local Setup)
To make this SIEM fully functional and process logs from external sources, you need to run the backend on your local machine.

#### A. Create the Project Structure
Create a folder named `sentinel-backend` on your computer and create the following files inside it.

#### B. `requirements.txt`
```text
fastapi
uvicorn
motor
pydantic
python-dotenv
websockets
```

#### C. `main.py`
```python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Optional
import json
import asyncio
from datetime import datetime
import random

app = FastAPI()

# --- Data Models ---
class LogEntry(BaseModel):
    id: str
    timestamp: str
    src_ip: str
    dest_port: int
    event_type: str
    protocol: str
    payload: str
    status: str
    country: Optional[str] = "Unknown"

# --- WebSocket Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast_log(self, log: dict):
        for connection in self.active_connections:
            await connection.send_json({"type": "LOG", "payload": log})

    async def broadcast_alert(self, alert: dict):
        for connection in self.active_connections:
            await connection.send_json({"type": "ALERT", "payload": alert})

manager = ConnectionManager()

# --- Routes ---

@app.get("/")
def read_root():
    return {"status": "Sentinel SIEM Backend Online"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/ingest")
async def ingest_log(log: LogEntry):
    # 1. Save to DB (Mocked here for simplicity, in real app use Motor/MongoDB)
    # await db.logs.insert_one(log.dict())
    
    # 2. Simple Detection Logic (Example)
    print(f"Ingested: {log.payload}")
    
    # 3. Broadcast to Frontend
    await manager.broadcast_log(log.dict())
    
    # 4. Check for Threats
    if "UNION SELECT" in log.payload:
        alert = {
            "id": f"alert-{random.randint(1000,9999)}",
            "timestamp": datetime.now().isoformat(),
            "rule_name": "SQL Injection",
            "severity": "CRITICAL",
            "src_ip": log.src_ip,
            "description": "SQLi Detected via API",
            "mitigation": "Block IP",
            "status": "active"
        }
        await manager.broadcast_alert(alert)

    return {"status": "processed"}
```

#### D. `docker-compose.yml` (Optional but Recommended)
```yaml
version: '3.8'
services:
  backend:
    build: .
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ports:
      - "8000:8000"
    volumes:
      - .:/app
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
```

### 3. Running the Backend
1.  Open your terminal in the `sentinel-backend` folder.
2.  Install requirements: `pip install -r requirements.txt`
3.  Run the server: `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`
4.  **Refresh this web page.** The top-right icon should turn **Green (Connected)**.

### 4. Sending Real Logs ("Every website I scroll")
To send logs to your running SIEM from anywhere, use a `curl` command or a simple Python script.

**Example: Sending a Log**
```bash
curl -X POST http://localhost:8000/ingest \
     -H "Content-Type: application/json" \
     -d '{
           "id": "123",
           "timestamp": "2023-10-27T10:00:00Z",
           "src_ip": "1.2.3.4",
           "dest_port": 80,
           "event_type": "web_request",
           "protocol": "HTTP",
           "payload": "GET /admin UNION SELECT 1",
           "status": "monitored"
         }'
```

If you run this command, you will immediately see the log appear on the Dashboard and an Alert trigger in the table!
