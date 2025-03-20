use aws_config::BehaviorVersion;
use aws_sdk_s3::{config::Credentials, primitives::ByteStream, Client};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum StorageError {
    #[error("S3 error: {0}")]
    Get(#[from] aws_sdk_s3::error::SdkError<aws_sdk_s3::operation::get_object::GetObjectError>),
    #[error("Upload error: {0}")]
    Put(#[from] aws_sdk_s3::error::SdkError<aws_sdk_s3::operation::put_object::PutObjectError>),
    #[error("Stream error: {0}")]
    Stream(#[from] aws_sdk_s3::primitives::ByteStreamError),
}

pub struct StorageClient {
    pub s3: Client,
}

impl StorageClient {
    pub async fn new(
        endpoint: &str,
        access_key: &str,
        secret_key: &str,
    ) -> Result<Self, StorageError> {
        let config = aws_config::defaults(BehaviorVersion::latest())
            .endpoint_url(endpoint)
            .region("ap-northeast-1")
            .credentials_provider(Credentials::new(
                access_key, secret_key, None, None, "static",
            ))
            .load()
            .await;

        let s3 = Client::new(&config);
        Ok(Self { s3 })
    }

    pub async fn upload_file(
        &self,
        bucket: &str,
        key: &str,
        data: Vec<u8>,
    ) -> Result<(), StorageError> {
        self.s3
            .put_object()
            .bucket(bucket)
            .key(key)
            .body(ByteStream::from(data))
            .send()
            .await?;
        Ok(())
    }

    pub async fn get_file(&self, bucket: &str, key: &str) -> Result<Vec<u8>, StorageError> {
        let resp = self.s3.get_object().bucket(bucket).key(key).send().await?;

        Ok(resp.body.collect().await?.to_vec())
    }
}
