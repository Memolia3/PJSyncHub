use crate::schemas::{Mutation, Query};
use async_graphql::*;
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::extract::Extension;

pub async fn graphql_handler(
    schema: Extension<Schema<Query, Mutation, EmptySubscription>>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}
