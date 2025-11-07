from kafka import KafkaConsumer
import json, os

KAFKA_BOOTSTRAP = os.environ.get("KAFKA_BOOTSTRAP", "localhost:29092")
TOPIC = os.environ.get("KAFKA_TOPIC", "herd-events")

consumer = KafkaConsumer(
    TOPIC,
    bootstrap_servers=[KAFKA_BOOTSTRAP],
    auto_offset_reset="earliest",
    enable_auto_commit=True,
    group_id="verify-consumer-group",
    value_deserializer=lambda m: json.loads(m.decode("utf-8")),
)

print(f"Listening on topic {TOPIC} (bootstrap: {KAFKA_BOOTSTRAP})")

for msg in consumer:
    print("--- EVENT ---")
    print(json.dumps(msg.value, indent=2))
