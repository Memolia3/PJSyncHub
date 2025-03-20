use futures::TryStreamExt;
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct DocumentModel {
    pub title: String,
    pub content: String,
    // 他のフィールド
}

impl DocumentModel {
    pub async fn find_all(db: &mongodb::Database) -> mongodb::error::Result<Vec<Self>> {
        let collection = db.collection::<DocumentModel>("documents");
        let mut cursor = collection.find(doc! {}).await?;
        let mut documents = Vec::new();
        while let Some(doc) = cursor.try_next().await? {
            documents.push(doc);
        }
        Ok(documents)
    }
}
