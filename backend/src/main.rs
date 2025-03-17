use axum::{
    routing::get,
    Router,
};
use tokio;

#[tokio::main]
async fn main() {
    println!("Initializing server...");

    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }));

    let addr = "0.0.0.0:8080";
    println!("Server starting on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind");

    println!("Server is running on http://{}", addr);

    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}
