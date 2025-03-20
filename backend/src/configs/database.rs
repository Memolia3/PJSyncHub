use super::env::Env;
use mongodb::Client;
use sea_orm::{Database, DatabaseConnection};
use std::sync::Arc;

pub struct DatabasePool {
    pub db: DatabaseConnection,
    pub document_db: Client,
}

impl DatabasePool {
    pub async fn new(env: &Env) -> Result<Arc<Self>, Box<dyn std::error::Error>> {
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
