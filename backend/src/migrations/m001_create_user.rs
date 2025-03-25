use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
/// マイグレーション名
pub struct Migration;

#[async_trait::async_trait]
/// userテーブルのマイグレーション
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(User::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(User::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(User::Email).string().not_null().unique_key())
                    .col(ColumnDef::new(User::Name).string().not_null())
                    .col(ColumnDef::new(User::Password).string().null())
                    .col(ColumnDef::new(User::AvatarUrl).string().null())
                    .col(
                        ColumnDef::new(User::AvatarUpdatedAt)
                            .timestamp_with_time_zone()
                            .null(),
                    )
                    .col(
                        ColumnDef::new(User::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(SimpleExpr::Custom("CURRENT_TIMESTAMP".into())),
                    )
                    .col(
                        ColumnDef::new(User::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(SimpleExpr::Custom("CURRENT_TIMESTAMP".into())),
                    )
                    .to_owned(),
            )
            .await
    }

    /// マイグレーションのロールバック
    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(User::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
/// userテーブル
enum User {
    /// テーブル名
    Table,
    /// ユーザーID
    Id,
    /// メールアドレス
    Email,
    /// ユーザー名
    Name,
    /// パスワード
    Password,
    /// アバター画像URL
    AvatarUrl,
    /// アバター画像更新日時
    AvatarUpdatedAt,
    /// 作成日時
    CreatedAt,
    /// 更新日時
    UpdatedAt,
}
