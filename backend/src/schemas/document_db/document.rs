use crate::models::document_db::document::DocumentModel;
use async_graphql::*;
use mongodb::Database;
use serde::{Deserialize, Serialize};

#[derive(SimpleObject, Serialize, Deserialize)]
pub struct DocumentOutput {
    pub title: String,
    pub content: String,
}

#[derive(InputObject)]
pub struct DocumentInput {
    pub title: String,
    pub content: String,
}

#[derive(Default)]
pub struct DocumentQuery;

#[derive(Default)]
pub struct DocumentMutation;

#[Object]
impl DocumentQuery {
    async fn documents(&self, ctx: &Context<'_>) -> Result<Vec<DocumentOutput>> {
        let db = ctx.data::<Database>()?;
        let documents = DocumentModel::find_all(db).await?;
        Ok(documents
            .into_iter()
            .map(|doc| DocumentOutput {
                title: doc.title,
                content: doc.content,
            })
            .collect())
    }
}

#[Object]
impl DocumentMutation {
    async fn create_document(
        &self,
        ctx: &Context<'_>,
        input: DocumentInput,
    ) -> Result<DocumentOutput> {
        let db = ctx.data::<Database>()?;
        let doc = DocumentModel::create(db, input).await?;
        Ok(DocumentOutput {
            title: doc.title,
            content: doc.content,
        })
    }
}
