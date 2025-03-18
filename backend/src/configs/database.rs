use super::env::Env;
use mongodb::Client;
use sea_orm::{Database, DatabaseConnection};
use sqlx::postgres::PgPool;
use std::sync::Arc;

pub struct DatabasePool {
    pub db: DatabaseConnection,
    pub document_db: Client,
}

impl DatabasePool {
    pub async fn new(env: &Env) -> Result<Arc<Self>, Box<dyn std::error::Error>> {
        // 接続テスト用コード
        tokio::time::sleep(std::time::Duration::from_secs(5)).await;

        tracing::info!("Final connection URL: {}", env.database_url);

        tracing::info!("Attempting sqlx connection...");
        let _pool = PgPool::connect(&env.database_url).await.map_err(|e| {
            tracing::error!("sqlx connection error: {:#?}", e);
            e
        })?;
        tracing::info!("sqlx connection successful");

        // 接続成功したらsea-ormで接続
        tracing::info!("Attempting sea-orm connection...");
        let db = Database::connect(&env.database_url).await.map_err(|e| {
            tracing::error!("PostgreSQL connection error: {:?}", e);
            e
        })?;

        let document_db = Client::with_uri_str(&env.document_db_url)
            .await
            .map_err(|e| {
                tracing::error!("MongoDB connection error: {:?}", e);
                e
            })?;

        Ok(Arc::new(Self { db, document_db }))
    }
}
