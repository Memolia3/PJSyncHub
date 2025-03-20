use crate::configs::env::Env;
use crate::configs::storage::StorageClient;
use crate::models::relational_db::user::{self, Entity as User};
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use async_graphql::*;
use jsonwebtoken::{encode, EncodingKey, Header};
use sea_orm::*;
use serde::{Deserialize, Serialize};
use std::io::Read;
use std::sync::Arc;
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

        // パスワードのハッシュ化
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        let password_hash = argon2
            .hash_password(input.password.as_bytes(), &salt)
            .map_err(|e| Error::new(format!("Password hashing failed: {}", e)))?
            .to_string();

        let user = user::ActiveModel {
            id: Set(Uuid::new_v4()),
            email: Set(input.email),
            name: Set(input.name),
            password: Set(password_hash),
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

    /// ログイン
    async fn login(&self, ctx: &Context<'_>, input: LoginInput) -> Result<LoginResponse> {
        let db = ctx.data::<DatabaseConnection>()?;
        let env = ctx.data::<Arc<Env>>()?;

        // ユーザーを検索
        let user = User::find()
            .filter(user::Column::Email.eq(input.email))
            .one(db)
            .await?
            .ok_or_else(|| Error::new("Invalid credentials"))?;

        // パスワードの検証
        let parsed_hash = PasswordHash::new(&user.password)
            .map_err(|e| Error::new(format!("Invalid password hash: {}", e)))?;

        if Argon2::default()
            .verify_password(input.password.as_bytes(), &parsed_hash)
            .is_err()
        {
            return Err(Error::new("Invalid credentials"));
        }

        // JWTトークンの生成
        let expiration = chrono::Utc::now()
            .checked_add_signed(chrono::Duration::hours(24))
            .expect("valid timestamp")
            .timestamp() as usize;

        let claims = Claims {
            sub: user.id,
            exp: expiration,
        };

        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(env.jwt_secret.as_bytes()),
        )
        .map_err(|e| Error::new(format!("Token generation failed: {}", e)))?;

        Ok(LoginResponse { token, user })
    }
}

#[derive(InputObject)]
struct LoginInput {
    email: String,
    password: String,
}

#[derive(SimpleObject)]
struct LoginResponse {
    token: String,
    user: user::Model,
}

#[derive(Serialize, Deserialize)]
struct Claims {
    sub: uuid::Uuid, // ユーザーID
    exp: usize,      // 有効期限
}
