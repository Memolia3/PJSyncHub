use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};
use std::env;

/// 環境変数
pub struct Env {
    pub relational_db_url: String,
    pub content_db_url: String,
    pub minio_endpoint: String,
    pub minio_user: String,
    pub minio_password: String,
    pub jwt_secret: String,
}

/// 環境変数の新規作成
impl Env {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        // リレーショナルデータベースのURL
        let password =
            utf8_percent_encode(&env::var("POSTGRES_PASSWORD")?, NON_ALPHANUMERIC).to_string();
        let relational_db_url = format!(
            "postgres://{}:{}@postgres:5432/{}",
            env::var("POSTGRES_USER")?,
            password,
            env::var("POSTGRES_DB")?
        );
        // コンテンツデータベースのURL
        let content_db_url = env::var("CONTENT_DB_URL")?;
        // Minioのエンドポイント
        let minio_endpoint = format!(
            "http://minio:{}",
            env::var("MINIO_PORT").unwrap_or_else(|_| String::from("${MINIO_PORT}"))
        );
        // Minioのユーザー名
        let minio_user = env::var("MINIO_ROOT_USER")?;
        // Minioのパスワード
        let minio_password = env::var("MINIO_ROOT_PASSWORD")?;
        let jwt_secret = env::var("JWT_SECRET")?;

        // 環境変数の返却
        Ok(Self {
            relational_db_url,
            content_db_url,
            minio_endpoint,
            minio_user,
            minio_password,
            jwt_secret,
        })
    }
}
