pub mod user;

use async_graphql::MergedObject;
use user::{UserMutation, UserQuery};

/// リレーショナルデータベースのクエリ
#[derive(MergedObject, Default)]
pub struct RelationalDBQuery(UserQuery);

/// リレーショナルデータベースのミューテーション
#[derive(MergedObject, Default)]
pub struct RelationalDBMutation(UserMutation);
