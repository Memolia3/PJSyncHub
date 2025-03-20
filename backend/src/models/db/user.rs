use crate::configs::storage::StorageClient;
use async_graphql::*;
use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};
use sea_orm::entity::prelude::*;
use uuid::Uuid;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, SimpleObject)]
#[sea_orm(table_name = "user")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,
    pub email: String,
    pub name: String,
    #[graphql(skip)]
    pub password: String,
    #[graphql(name = "avatarUrl")]
    pub avatar_url: Option<String>,
    pub avatar_updated_at: Option<DateTimeWithTimeZone>,
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}

#[ComplexObject]
impl Model {
    #[graphql(name = "avatar")]
    async fn avatar_data(&self, ctx: &Context<'_>) -> Result<Option<AvatarData>> {
        if let Some(url) = &self.avatar_url {
            let key = url.trim_start_matches('/');
            let storage = ctx.data::<StorageClient>()?;
            let bytes = storage.get_file("user-content", key).await?;
            Ok(Some(AvatarData {
                data: BASE64.encode(bytes),
                mime_type: "image/jpeg".to_string(),
            }))
        } else {
            Ok(None)
        }
    }
}

#[derive(SimpleObject)]
struct AvatarData {
    data: String,
    mime_type: String,
}
