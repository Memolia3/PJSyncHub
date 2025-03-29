use crate::configs::env::Env;
use crate::configs::storage::StorageClient;
use crate::models::relational_db::user::{self, Entity as User};
use crate::schemas::relational_db::user::types::*;
use crate::utils::auth::{AuthTokens, AuthUtils};
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use async_graphql::*;
use jsonwebtoken::{encode, DecodingKey, EncodingKey, Header, Validation};
use sea_orm::*;
use std::io::Read;
use std::sync::Arc;
use uuid::Uuid;

/// userテーブルのミューテーション
#[derive(Default)]
pub struct UserMutation;

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
            avatar_url: Set(input.avatar_url),
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
        if let Some(avatar_url) = input.avatar_url {
            let mut content = Vec::new();
            avatar_url.value(ctx)?.content.read_to_end(&mut content)?;
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
            .filter(user::Column::Email.eq(&input.email))
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

        let tokens = AuthUtils::generate_token_pair(user.id, &env.jwt_secret)
            .map_err(|e| Error::new(format!("Token generation failed: {}", e)))?;

        Ok(LoginResponse { tokens, user })
    }

    /// OAuth認証
    async fn oauth_authenticate(
        &self,
        ctx: &Context<'_>,
        input: OAuthAuthenticateInput,
    ) -> Result<LoginResponse> {
        let db = ctx.data::<DatabaseConnection>()?;
        let env = ctx.data::<Arc<Env>>()?;

        // ユーザーを検索または作成
        let user = match User::find()
            .filter(user::Column::Email.eq(&input.email))
            .one(db)
            .await?
        {
            Some(user) => user,
            None => {
                let user = user::ActiveModel {
                    id: Set(Uuid::new_v4()),
                    email: Set(input.email),
                    name: Set(input.name),
                    password: Set(String::new()),
                    avatar_url: Set(input.avatar_url),
                    ..Default::default()
                };
                user.insert(db).await?
            }
        };

        let tokens = AuthUtils::generate_token_pair(user.id, &env.jwt_secret)
            .map_err(|e| Error::new(format!("Token generation failed: {}", e)))?;

        Ok(LoginResponse { tokens, user })
    }

    /// トークンのリフレッシュ
    async fn refresh_token(&self, ctx: &Context<'_>, refresh_token: String) -> Result<AuthTokens> {
        let env = ctx.data::<Arc<Env>>()?;

        // リフレッシュトークンの検証
        let claims = jsonwebtoken::decode::<Claims>(
            &refresh_token,
            &DecodingKey::from_secret(env.jwt_secret.as_bytes()),
            &Validation::default(),
        )
        .map_err(|_| Error::new("Invalid refresh token"))?;

        if claims.claims.token_type != TokenType::Refresh {
            return Err(Error::new("Invalid token type"));
        }

        // 新しいアクセストークンの生成
        let access_token_exp = chrono::Utc::now()
            .checked_add_signed(chrono::Duration::hours(1))
            .expect("valid timestamp")
            .timestamp();

        let access_claims = Claims {
            sub: claims.claims.sub,
            exp: access_token_exp as usize,
            token_type: TokenType::Access,
        };

        let access_token = encode(
            &Header::default(),
            &access_claims,
            &EncodingKey::from_secret(env.jwt_secret.as_bytes()),
        )?;

        Ok(AuthTokens {
            access_token,
            refresh_token,
            expires_at: access_token_exp,
        })
    }
}
