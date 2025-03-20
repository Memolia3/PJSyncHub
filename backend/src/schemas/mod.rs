pub mod db {
    pub mod user;
}

pub mod document_db {
    pub mod document;
}

use async_graphql::MergedObject;
use db::user::{UserMutation, UserQuery};
use document_db::document::{DocumentMutation, DocumentQuery};

#[derive(MergedObject, Default)]
pub struct Query(UserQuery, DocumentQuery);

#[derive(MergedObject, Default)]
pub struct Mutation(UserMutation, DocumentMutation);
