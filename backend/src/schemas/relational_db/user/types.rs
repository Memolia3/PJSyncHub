use crate::models::relational_db::user;
use crate::utils::auth::AuthTokens;
use async_graphql::*;
use serde::{Deserialize, Serialize};

#[derive(InputObject)]
pub struct CreateUserInput {
    pub email: String,
    pub name: String,
    pub password: String,
    pub avatar_url: Option<String>,
}

#[derive(InputObject)]
pub struct UpdateUserInput {
    pub name: Option<String>,
    pub email: Option<String>,
    pub avatar_url: Option<Upload>,
}

#[derive(InputObject)]
pub struct LoginInput {
    pub email: String,
    pub password: String,
}

#[derive(SimpleObject)]
pub struct LoginResponse {
    pub tokens: AuthTokens,
    pub user: user::Model,
}

#[derive(InputObject)]
#[graphql(name = "OAuthAuthenticateInput")]
pub struct OAuthAuthenticateInput {
    pub email: String,
    pub name: String,
    pub avatar_url: Option<String>,
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
