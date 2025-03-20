use super::env::Env;
use mongodb::Client;
use sea_orm::{Database, DatabaseConnection};
use std::sync::Arc;

/// データベース接続プール
/// リレーショナルデータベースとコンテンツデータベースの接続プールを管理する
pub struct DatabasePool {
    pub relational_db: DatabaseConnection,
    pub content_db: Client,
}

/// データベース接続プールの新規作成
/// リレーショナルデータベースとコンテンツデータベースの接続プールを作成する
impl DatabasePool {
    pub async fn new(env: &Env) -> Result<Arc<Self>, Box<dyn std::error::Error>> {
        // リレーショナルデータベースの接続
        let relational_db = Database::connect(&env.relational_db_url)
            .await
            .map_err(|e| {
                tracing::error!("PostgreSQL connection error: {:?}", e);
                e
            })?;

        // コンテンツデータベースの接続
        let content_db = Client::with_uri_str(&env.content_db_url)
            .await
            .map_err(|e| {
                tracing::error!("MongoDB connection error: {:?}", e);
                e
            })?;

        // 接続プールの返却
        Ok(Arc::new(Self {
            relational_db,
            content_db,
        }))
    }
}
