from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clients = []

@app.get("/")
async def get_index():
    return HTMLResponse(open("static/index.html").read())

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        clients.remove(websocket)

@app.get("/trigger")
async def trigger_event():
    event_data = {
        "background": "lightblue",
        "message": "Crisis detectada: iniciando rutina calmante...",
        "routine": "Luces tenues, música relajante"
    }

    disconnected = []
    for client in clients:
        try:
            await client.send_json(event_data)
        except:
            disconnected.append(client)

    for client in disconnected:
        clients.remove(client)

    return {"status": "ok", "detail": event_data}
