pub mod document;

use async_graphql::MergedObject;
use document::{DocumentMutation, DocumentQuery};

/// コンテンツデータベースのクエリ
#[derive(MergedObject, Default)]
pub struct ContentDBQuery(DocumentQuery);

/// コンテンツデータベースのミューテーション
#[derive(MergedObject, Default)]
pub struct ContentDBMutation(DocumentMutation);
