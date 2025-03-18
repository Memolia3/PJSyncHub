use async_graphql::*;

pub struct Query;
pub struct Mutation;

#[Object]
impl Query {
    async fn health(&self) -> &'static str {
        "ok"
    }
}

#[Object]
impl Mutation {
    async fn ping(&self) -> &'static str {
        "pong"
    }
}
