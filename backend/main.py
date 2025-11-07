from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from kafka import KafkaProducer
import os, json, time

# Kafka setup
KAFKA_BOOTSTRAP = os.environ.get("KAFKA_BOOTSTRAP", "localhost:29092")
TOPIC = os.environ.get("KAFKA_TOPIC", "herd-events")

producer = KafkaProducer(
    bootstrap_servers=[KAFKA_BOOTSTRAP],
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    api_version=(2, 0, 0),
)

# FastAPI app
app = FastAPI(title="Event Producer")

# Allow frontend (JS tracker) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # for dev; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schema for event
class Event(BaseModel):
    event_type: str
    product_id: int
    user_id: str | None = None
    timestamp: float | None = None

@app.post("/track", status_code=202)
async def track(event: Event):
    event.timestamp = event.timestamp or time.time()
    payload = event.dict()
    try:
        producer.send(TOPIC, value=payload)
        producer.flush()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Kafka error: {e}")
    return {"status": "accepted", "event": payload}

@app.get("/health")
async def health():
    return {"ok": True, "kafka": KAFKA_BOOTSTRAP, "topic": TOPIC}
