pub mod content_db;
pub mod relational_db;

use async_graphql::MergedObject;
use content_db::{ContentDBMutation, ContentDBQuery};
use relational_db::{RelationalDBMutation, RelationalDBQuery};

/// クエリ
#[derive(MergedObject, Default)]
pub struct Query(RelationalDBQuery, ContentDBQuery);

/// ミューテーション
#[derive(MergedObject, Default)]
pub struct Mutation(RelationalDBMutation, ContentDBMutation);
