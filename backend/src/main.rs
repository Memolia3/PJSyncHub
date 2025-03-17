mod routes;
mod handlers;
mod models;
mod error;

use axum::{
    routing::{get, post},
    Router,
    Json,
    extract::State,
};
use tower_http::cors::CorsLayer;
use std::sync::Arc;

#[tokio::main]
async fn main() {
    // ロギングの初期化
    tracing_subscriber::fmt::init();

    // アプリケーションの状態を管理
    let state = Arc::new(AppState {
        // 必要な共有状態をここに
    });

    let app = Router::new()
        .route("/health", get(routes::health::check))
        .route("/api/users", get(routes::users::list_users))
        .route("/api/users", post(routes::users::create_user))
        .layer(CorsLayer::permissive()) // 開発環境用
        .with_state(state);

    let addr = "0.0.0.0:8080";
    tracing::info!("Server starting on {}", addr);

    axum::serve(
        tokio::net::TcpListener::bind(addr)
            .await
            .expect("Failed to bind"),
        app
    )
    .await
    .expect("Failed to start server");
}
