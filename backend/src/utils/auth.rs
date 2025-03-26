use async_graphql::*;
use chrono::Utc;
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

pub struct AuthUtils;

#[derive(SimpleObject)]
pub struct AuthTokens {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: i64,
}

#[derive(Serialize, Deserialize, PartialEq)]
pub enum TokenType {
    Access,
    Refresh,
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub sub: uuid::Uuid,
    pub exp: usize,
    pub token_type: TokenType,
}

impl AuthUtils {
    /// トークンペアを生成
    pub fn generate_token_pair(user_id: Uuid, jwt_secret: &str) -> Result<AuthTokens, String> {
        // アクセストークン（1時間）
        let access_token_exp = Utc::now()
            .checked_add_signed(chrono::Duration::hours(1))
            .expect("valid timestamp")
            .timestamp();

        let access_claims = Claims {
            sub: user_id,
            exp: access_token_exp as usize,
            token_type: TokenType::Access,
        };

        let access_token = encode(
            &Header::default(),
            &access_claims,
            &EncodingKey::from_secret(jwt_secret.as_bytes()),
        )
        .map_err(|e| e.to_string())?;

        // リフレッシュトークン（14日）
        let refresh_token_exp = Utc::now()
            .checked_add_signed(chrono::Duration::days(14))
            .expect("valid timestamp")
            .timestamp();

        let refresh_claims = Claims {
            sub: user_id,
            exp: refresh_token_exp as usize,
            token_type: TokenType::Refresh,
        };

        let refresh_token = encode(
            &Header::default(),
            &refresh_claims,
            &EncodingKey::from_secret(jwt_secret.as_bytes()),
        )
        .map_err(|e| e.to_string())?;

        Ok(AuthTokens {
            access_token,
            refresh_token,
            expires_at: access_token_exp,
        })
    }
}
