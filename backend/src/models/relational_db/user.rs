use crate::configs::storage::StorageClient;
use async_graphql::*;
use base64::{engine::general_purpose::STANDARD as BASE64, Engine as _};
use sea_orm::entity::prelude::*;
use uuid::Uuid;

/// userテーブルのモデル
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, SimpleObject)]
#[sea_orm(table_name = "user")]
pub struct Model {
    /// ユーザーID
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,
    /// メールアドレス
    pub email: String,
    /// ユーザー名
    pub name: String,
    /// パスワード
    #[graphql(skip)]
    pub password: String,
    /// アバター画像URL
    #[graphql(name = "avatarUrl")]
    pub avatar_url: Option<String>,
    /// アバター画像更新日時
    pub avatar_updated_at: Option<DateTimeWithTimeZone>,
    /// 作成日時
    pub created_at: DateTimeWithTimeZone,
    /// 更新日時
    pub updated_at: DateTimeWithTimeZone,
}

/// userテーブルのリレーション
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

/// userテーブルのアクティブモデルの振る舞い
impl ActiveModelBehavior for ActiveModel {}

/// userテーブルのアバター画像のデータ
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

/// userテーブルのアバター画像のデータ
#[derive(SimpleObject)]
struct AvatarData {
    /// データ
    data: String,
    /// メディアタイプ
    mime_type: String,
}
