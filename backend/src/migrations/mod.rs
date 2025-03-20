use sea_orm_migration::prelude::*;

mod m001_create_user;

/// マイグレーション
pub struct Migrator;

/// マイグレーションの実行
#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![Box::new(m001_create_user::Migration)]
    }
}
