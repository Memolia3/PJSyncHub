use crate::schemas::{Mutation, Query};
use async_graphql::http::GraphQLPlaygroundConfig;
use async_graphql::*;
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::extract::Extension;
use axum::response::Html;

/// GraphQLハンドラー
pub async fn graphql_handler(
    schema: Extension<Schema<Query, Mutation, EmptySubscription>>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

/// GraphQLプレイグラウンド
pub async fn graphql_playground() -> Html<String> {
    Html(async_graphql::http::playground_source(
        GraphQLPlaygroundConfig::new("/graphql"),
    ))
}
