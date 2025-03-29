# GraphQL とは

作成日: 2025-03-26<br>
最終更新日: 2025-03-26

## 概要

GraphQL は API のためのクエリ言語であり、既存のデータに対するクエリを実行するためのランタイムです。<br>以下の特徴を持ち、RESTFul API と比較してより柔軟性があります。

- クライアントが必要なデータを正確に指定できる
  - RESTFul API では、クライアントが必要なデータを指定することが難しい
- 複数のリソースを 1 回のリクエストで取得可能
  - RESTFul API では、複数のリクエストが必要になる
- 型システムによる強力な開発時のサポート
  - RESTFul API では、型システムがないため、開発時のサポートが弱い

## クエリ

GraphQL のクエリは、以下のような形式で記述します：

```graphql
query {
  user(id: "123") {
    name
  }
}
```

このクエリは、`user` というリソースを取得し、その `id` が `123` のユーザーの `name` を返します。

## ミューテーション

GraphQL のミューテーションは、以下のような形式で記述します：

```graphql
mutation {
  createUser(name: "John Doe") {
    id
  }
}
```

このミューテーションは、新しいユーザーを作成し、その `id` を返します。

## クエリとミューテーションの違い

クエリは、データを取得するためのもので、ミューテーションは、データを変更するためのものです。<br>
→ クエリは読み取り専用で、ミューテーションは書き込み専用です。<br>
DB で言うと、クエリは SELECT 文で、ミューテーションは INSERT、UPDATE、DELETE 文です。

## Q. ログイン機能はクエリか？ミューテーションか？

<details>
<summary>ログイン機能は...</summary>
<h3 style="color: red;">A. ミューテーション</h3>

ログイン機能は、ミューテーションで実行します。

```graphql
mutation {
  login(email: "john.doe@example.com", password: "password") {
    accessToken
    refreshToken
    expiresAt
  }
}
```

なぜなのか？<br>

<h3>副作用があるから</h3>

DB 自体に更新や削除はない機能ではありますが(要件による)、<br>
ログイン機能はユーザーの認証を行い、トークンを発行します。<br>
この処理は、データベースに対して副作用を起こします。<br>
そのため、ミューテーションで実行します。

</details>

## 型システム

GraphQL は、型システムを持ち、以下のような型を定義できます：

```graphql
type User {
  id: ID!
  name: String!
  email: String!
}
```

この型は、`id` が `ID` 型で、`name` と `email` が `String` 型であることを示します。

## スカラー型

GraphQL は、以下のようなスカラー型を持ちます：

- `ID`
- `String`
- `Int`
- `Float`
- `Boolean`
- `DateTime`

## オブジェクト型

GraphQL は、以下のようなオブジェクト型を持ちます：

```graphql
type User {
  id: ID!
  name: String!
  email: String!
}
```

この型は、`id` が `ID` 型で、`name` と `email` が `String` 型であることを示します。

## リスト型

GraphQL は、以下のようなリスト型を持ちます：

```graphql
type UserList {
  users: [User!]!
}
```

この型は、`users` が `User` 型のリストであることを示します。

## インターフェース型

GraphQL は、以下のようなインターフェース型を持ちます：

```graphql
interface Node {
  id: ID!
}
```

この型は、`id` が `ID` 型であることを示します。
