use async_graphql::{Object, Schema, EmptySubscription};

pub struct Query;
pub struct Mutation;

#[Object]
impl Query {
    async fn users(&self) -> Vec<User> {
        // PostgreSQLからユーザー情報を取得
    }

    async fn posts(&self) -> Vec<Post> {
        // MongoDBから投稿データを取得
    }
}

#[Object]
impl Mutation {
    async fn create_user(&self, input: CreateUserInput) -> User {
        // PostgreSQLにユーザーを作成
    }

    async fn create_post(&self, input: CreatePostInput) -> Post {
        // MongoDBに投稿を作成
    }
}

pub type AppSchema = Schema<Query, Mutation, EmptySubscription>; 