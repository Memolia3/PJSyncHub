use crate::models::content_db::document::DocumentModel;
use async_graphql::*;
use mongodb::Database;
use serde::{Deserialize, Serialize};

/// documentテーブルの出力
#[derive(SimpleObject, Serialize, Deserialize)]
pub struct DocumentOutput {
    /// タイトル
    pub title: String,
    /// 内容
    pub content: String,
}

/// documentテーブルの入力
#[derive(InputObject)]
pub struct DocumentInput {
    /// タイトル
    pub title: String,
    /// 内容
    pub content: String,
}

/// documentテーブルのクエリ
#[derive(Default)]
pub struct DocumentQuery;

/// documentテーブルのミューテーション
#[derive(Default)]
pub struct DocumentMutation;

/// documentテーブルのクエリの実装
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

/// documentテーブルのミューテーションの実装
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
