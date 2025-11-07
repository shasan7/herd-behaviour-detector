import asyncio
import json
import time
import statistics
import websockets
from aiokafka import AIOKafkaConsumer

BROKER = "localhost:29092"
TOPIC = "herd-events"
GROUP_ID = "herd-processor"

WINDOW_SIZE = 5
THRESHOLD = 1  # how many std devs above baseline = anomaly

product_activity = {}
alert_clients = set()  # WebSocket connections


def process_event(event):
    pid = event['product_id']
    now_minute = int(time.time() // 60)

    history = product_activity.get(pid, [])
    if not history or history[-1][0] != now_minute:
        history.append([now_minute, 1])
    else:
        history[-1][1] += 1

    if len(history) > WINDOW_SIZE:
        history.pop(0)

    product_activity[pid] = history
    counts = [c for _, c in history]
    avg = sum(counts) / len(counts)
    stdev = statistics.pstdev(counts) if len(counts) > 1 else 0
    current = counts[-1]

    print(f"[Product {pid}] counts={counts} avg={avg:.2f} stdev={stdev:.2f}")

    # anomaly detection
    if stdev >= THRESHOLD * stdev and current > avg:
        alert = {
            "product_id": pid,
            "current": current,
            "avg": avg,
            "stdev": stdev,
            "timestamp": time.time()
        }
        print("ALERT:", alert)
        return alert
    return None


async def consume():
    consumer = AIOKafkaConsumer(
        TOPIC,
        bootstrap_servers=BROKER,
        group_id=GROUP_ID,
        auto_offset_reset="earliest"
    )
    await consumer.start()
    print("Async Kafka consumer started...")

    try:
        async for msg in consumer:
            try:
                event = json.loads(msg.value.decode("utf-8"))
            except Exception as e:
                print("Failed to decode message:", e)
                continue

            alert = process_event(event)
            if alert:
                await broadcast_alert(alert)

    finally:
        await consumer.stop()


async def broadcast_alert(alert):
    if not alert_clients:
        return
    data = json.dumps(alert)
    dead_clients = []
    for client in alert_clients:
        try:
            await client.send(data)
        except Exception as e:
            print(f"Failed to send to client {client}: {e}")
            dead_clients.append(client)
    # Clean up closed clients
    for client in dead_clients:
        alert_clients.remove(client)



async def alerts_server():
    async def handler(websocket):
        alert_clients.add(websocket)
        print("Client connected:", websocket.remote_address)
        try:
            await websocket.wait_closed()
        finally:
            alert_clients.remove(websocket)

    async with websockets.serve(handler, "0.0.0.0", 8765):
        print("WebSocket server started on ws://localhost:8765")
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.create_task(consume())
    loop.run_until_complete(alerts_server())
