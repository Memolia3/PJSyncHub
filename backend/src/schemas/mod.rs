pub mod db {
    pub mod user;
}

pub mod document_db {
    pub mod document;
}

use async_graphql::{ComplexObject, SimpleObject};

#[derive(SimpleObject, Default)]
pub struct Query {
    user: db::user::UserQuery,
    document: document_db::document::DocumentQuery,
}

#[derive(SimpleObject, Default)]
pub struct Mutation {
    user: db::user::UserMutation,
}

#[ComplexObject]
impl Query {
    async fn users(&self) -> &db::user::UserQuery {
        &self.user
    }

    async fn documents(&self) -> &document_db::document::DocumentQuery {
        &self.document
    }
}
