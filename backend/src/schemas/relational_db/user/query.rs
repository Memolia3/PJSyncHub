use crate::models::relational_db::user::{self, Entity as User};
use async_graphql::*;
use sea_orm::*;
use uuid::Uuid;

/// userテーブルのクエリ
#[derive(Default)]
pub struct UserQuery;

/// userテーブルのクエリの実装
#[Object]
impl UserQuery {
    /// ユーザを取得
    async fn user(
        &self,
        ctx: &Context<'_>,
        id: Option<Uuid>,
        email: Option<String>,
    ) -> Result<Option<user::Model>> {
        let db = ctx.data::<DatabaseConnection>()?;

        let mut query = User::find();

        // idまたはemailで検索
        if let Some(id) = id {
            query = query.filter(user::Column::Id.eq(id));
        } else if let Some(email) = email {
            query = query.filter(user::Column::Email.eq(email));
        } else {
            return Err(Error::new("id or email is required"));
        }

        let user = query.one(db).await?;
        Ok(user)
    }

    /// ユーザ一覧を取得
    async fn users(&self, ctx: &Context<'_>) -> Result<Vec<user::Model>> {
        let db = ctx.data::<DatabaseConnection>()?;
        let users = User::find().all(db).await?;
        Ok(users)
    }
}
