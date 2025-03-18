use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};
use std::env;

pub struct Env {
    pub database_url: String,
    pub document_db_url: String,
    pub minio_endpoint: String,
    pub minio_user: String,
    pub minio_password: String,
}

impl Env {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let password =
            utf8_percent_encode(&env::var("POSTGRES_PASSWORD")?, NON_ALPHANUMERIC).to_string();
        let database_url = format!(
            "postgres://{}:{}@postgres:5432/{}",
            env::var("POSTGRES_USER")?,
            password,
            env::var("POSTGRES_DB")?
        );
        let document_db_url = env::var("DOCUMENT_DB_URL")?;
        let minio_endpoint = format!(
            "http://minio:{}",
            env::var("MINIO_PORT").unwrap_or_else(|_| String::from("${MINIO_PORT}"))
        );
        let minio_user = env::var("MINIO_ROOT_USER")?;
        let minio_password = env::var("MINIO_ROOT_PASSWORD")?;

        Ok(Self {
            database_url,
            document_db_url,
            minio_endpoint,
            minio_user,
            minio_password,
        })
    }
}
