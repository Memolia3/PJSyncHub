use crate::schemas::document_db::document::DocumentInput;
use futures::TryStreamExt;
use mongodb::bson::doc;
use mongodb::Database;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DocumentModel {
    pub title: String,
    pub content: String,
    // 他のフィールド
}

impl DocumentModel {
    pub async fn find_all(db: &Database) -> mongodb::error::Result<Vec<Self>> {
        let collection = db.collection::<DocumentModel>("documents");
        let mut cursor = collection.find(doc! {}).await?;
        let mut documents = Vec::new();
        while let Some(doc) = cursor.try_next().await? {
            documents.push(doc);
        }
        Ok(documents)
    }

    pub async fn create(db: &Database, input: DocumentInput) -> mongodb::error::Result<Self> {
        let doc = Self {
            title: input.title,
            content: input.content,
        };
        let collection = db.collection::<DocumentModel>("documents");
        collection.insert_one(doc.clone()).await?;
        Ok(doc)
    }
}
