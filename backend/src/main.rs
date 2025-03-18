mod configs;
mod handlers;
mod migrations;
mod schemas;

use crate::migrations::Migrator;
use async_graphql::*;
use axum::{
    extract::Extension,
    response::IntoResponse,
    routing::{get, post},
    Router,
};
use configs::{database::DatabasePool, env::Env};
use handlers::graphql::graphql_handler;
use schemas::{Mutation, Query};
use sea_orm_migration::MigratorTrait;
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;
use tracing::{error, info, warn, Level};
use tracing_subscriber::FmtSubscriber;

async fn health_check() -> impl IntoResponse {
    "OK"
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 開発環境用ロガーの初期化
    FmtSubscriber::builder()
        .with_max_level(Level::DEBUG)
        .with_file(true)
        .with_line_number(true)
        .with_thread_ids(true)
        .with_target(false)
        .with_ansi(true)
        .pretty()
        .init();

    // 環境変数の初期化
    let env = Env::new()?;
    info!("Environment loaded");

    // DB接続プールの初期化
    info!("Connecting to databases...");
    let db = DatabasePool::new(&env).await?;
    info!("Database connections established");

    // マイグレーションの実行
    info!("Running database migrations...");
    if let Err(e) = Migrator::up(&db.db, None).await {
        error!("Migration failed: {:?}", e);
        return Err(e.into());
    }
    info!("Migrations completed successfully");

    // GraphQLスキーマの構築
    info!("Building GraphQL schema...");
    let schema = Schema::build(Query, Mutation, EmptySubscription)
        .data(db.clone())
        .finish();
    info!("GraphQL schema ready");

    let app: Router = Router::new()
        .route("/", get(health_check))
        .route("/graphql", get(graphql_handler).post(graphql_handler))
        .layer(Extension(schema))
        .layer(CorsLayer::permissive());

    // サーバーの起動
    info!("Starting server on 0.0.0.0:8080");
    let listener = TcpListener::bind("0.0.0.0:8080").await?;
    axum::serve(listener, app).await?;

    Ok(())
}
