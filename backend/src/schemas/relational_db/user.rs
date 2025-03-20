use crate::configs::storage::StorageClient;
use crate::models::relational_db::user::{self, Entity as User};
use async_graphql::*;
use sea_orm::*;
use std::io::Read;
use uuid::Uuid;

/// userテーブルの入力
#[derive(InputObject)]
struct CreateUserInput {
    email: String,
    name: String,
    password: String,
}

/// userテーブルの更新入力
#[derive(InputObject)]
struct UpdateUserInput {
    name: Option<String>,
    email: Option<String>,
    avatar: Option<Upload>,
}

/// userテーブルのクエリ
#[derive(Default)]
pub struct UserQuery;

/// userテーブルのミューテーション
#[derive(Default)]
pub struct UserMutation;

/// userテーブルのクエリの実装
#[Object]
impl UserQuery {
    /// ユーザ一覧を取得
    async fn users(&self, ctx: &Context<'_>) -> Result<Vec<user::Model>> {
        let db = ctx.data::<DatabaseConnection>()?;
        let users = User::find().all(db).await?;
        Ok(users)
    }

    /// uuidからユーザを取得
    async fn user(&self, ctx: &Context<'_>, id: Uuid) -> Result<Option<user::Model>> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = User::find_by_id(id).one(db).await?;
        Ok(user)
    }
}

/// userテーブルのミューテーションの実装
#[Object]
impl UserMutation {
    /// ユーザを作成
    async fn create_user(&self, ctx: &Context<'_>, input: CreateUserInput) -> Result<user::Model> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user = user::ActiveModel {
            id: Set(Uuid::new_v4()),
            email: Set(input.email),
            name: Set(input.name),
            password: Set(input.password),
            ..Default::default()
        };
        let user = user.insert(db).await?;
        Ok(user)
    }

    /// ユーザを更新
    async fn update_user(
        &self,
        ctx: &Context<'_>,
        id: Uuid,
        input: UpdateUserInput,
    ) -> Result<user::Model> {
        let db = ctx.data::<DatabaseConnection>()?;
        let storage = ctx.data::<StorageClient>()?;
        let mut user: user::ActiveModel = User::find_by_id(id)
            .one(db)
            .await?
            .ok_or_else(|| Error::new("User not found"))?
            .into();

        if let Some(name) = input.name {
            user.name = Set(name);
        }
        if let Some(email) = input.email {
            user.email = Set(email);
        }
        if let Some(avatar) = input.avatar {
            let mut content = Vec::new();
            avatar.value(ctx)?.content.read_to_end(&mut content)?;
            let key = format!("avatars/{}.jpg", id);
            storage.upload_file("user-content", &key, content).await?;
            user.avatar_url = Set(Some(format!("/avatars/{}.jpg", id)));
        }

        let user = user.update(db).await?;
        Ok(user)
    }
}
