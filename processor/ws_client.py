# ws_client.py
import asyncio
import websockets
import json

WS_URL = "ws://localhost:8765"

async def listen():
    async with websockets.connect(WS_URL) as websocket:
        print(f"Connected to {WS_URL}, waiting for alerts...")
        try:
            async for message in websocket:
                try:
                    alert = json.loads(message)
                except Exception:
                    alert = message
                print("ALERT RECEIVED:", alert)
        except websockets.ConnectionClosed:
            print("Connection closed by server.")

if __name__ == "__main__":
    asyncio.run(listen())
