FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# install compatible packages
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["faust", "-A", "app", "worker", "-l", "info"]
