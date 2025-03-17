use axum::{
    extract::State,
    Json,
};
use crate::models::User;
use crate::error::AppError;

pub async fn list_users(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<User>>, AppError> {
    // ユーザー一覧を取得するロジック
    Ok(Json(vec![]))
}

pub async fn create_user(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateUser>,
) -> Result<Json<User>, AppError> {
    // ユーザーを作成するロジック
    Ok(Json(User::new()))
} 