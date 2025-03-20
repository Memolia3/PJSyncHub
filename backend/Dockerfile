FROM rust:1.81.0-slim
WORKDIR /usr/src/app
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    pkg-config \
    libssl-dev \
    cmake \
    && rm -rf /var/lib/apt/lists/*
RUN cargo install cargo-watch
COPY . .
EXPOSE 8080
CMD ["cargo", "watch", "-x", "run"]
