# GraphQL とは

作成日: 2025-03-26<br>
最終更新日: 2025-04-07

## 概要

GraphQL は API のためのクエリ言語であり、既存のデータに対するクエリを実行するためのランタイムです。<br>RESTFul API と比較してより柔軟性があります。<br>
Facebook 社により作られ 2015 年にオープンソース化されました。

2012 年に Facebook が内部で開発を始め、Instagram のモバイルアプリで最初に使用されました。モバイルアプリの効率的なデータ取得のために設計され、その後多くの大手企業（GitHub, Twitter, Shopify, Netflix）で採用されています。

### GraphQL を使う主な理由

- クライアント主導のデータ取得
- 型システムによる堅牢な API 設計
- 強力な開発者ツールとエコシステム
- フロントエンドとバックエンドの分離が容易

## REST の課題と GraphQL による解決策

１．オーバーフェッチング（Over-fetching）<br>
　　クライアントが必要としている以上のデータをサーバ側から取得すること<br>
　　 → 　クライアント側が必要なデータを指定することができる<br>

**具体例**：
ユーザープロフィールのページで名前とアバターだけが必要な場合

REST API の場合:

```json
GET /api/users/123
結果: {
  "id": 123,
  "name": "山田太郎",
  "email": "taro@example.com",
  "address": "東京都...",
  "phoneNumber": "090-XXXX-XXXX",
  "createdAt": "2025-01-01",
  "lastLogin": "2025-03-26",
  "preferences": { ... },
  "paymentMethods": [ ... ]
  // 他多くの不要なデータ
}
```

GraphQL の場合:

```graphql
query {
  user(id: 123) {
    name
    avatar
  }
}

結果: {
  "data": {
    "user": {
      "name": "山田太郎",
      "avatar": "https://..."
    }
  }
}
```

<br>
２．アンダーフェッチング（Under-fetching）<br>
　　クライアントが必要とするデータを一度のリクエストで取得できず、<br>　　複数回の API リクエストを送る必要がある状況<br>
　　 → 　１リクエストで必要なデータが取得可能<br>

**具体例**：
ブログ記事とその著者情報、コメントを表示する場合

REST API の場合:

```
GET /api/posts/456        // 記事の詳細を取得
GET /api/users/123        // 著者の情報を取得
GET /api/posts/456/comments // コメントを取得
```

GraphQL の場合:

```graphql
query {
  post(id: 456) {
    title
    content
    author {
      name
      bio
      avatarUrl
    }
    comments {
      text
      user {
        name
      }
      createdAt
    }
  }
}
```

<br>
３．エンドポイント設計の複雑さ<br>
　　オーバーフェッチングを防ごうとした結果、似たようなエンドポイントの数が膨大になってしまう<br>
　　 → 　指定しなければ「/graphql」で単一エンドポイントとしてアクセスできる<br>

**具体例**：
SNS アプリを考えると、REST では以下のようなエンドポイントが必要になります:

```
/api/users
/api/users/:id
/api/users/:id/friends
/api/users/:id/photos
/api/users/:id/posts
/api/posts
/api/posts/:id
/api/posts/:id/comments
/api/posts/:id/likes
/api/comments/:id/replies
...
```

GraphQL では単一のエンドポイント `/graphql` を通じて全てのリソースにアクセスできます。

## GraphQL の主要な機能

主にクエリ(Query), ミューテーション(Mutation), サブスクリプション(Subscription)があります。
その中でまずは分かりやすいクエリ、ミューテーションについて記述します。

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

### クエリのバリエーション

#### フィールド引数

```graphql
query {
  user(id: "123") {
    name
    posts(limit: 5, offset: 0) {
      title
      comments(first: 3) {
        text
      }
    }
  }
}
```

#### エイリアス

同じフィールドを異なる引数で複数回クエリする場合

```graphql
query {
  recentPosts: posts(limit: 10, sort: "recent") {
    title
  }
  popularPosts: posts(limit: 10, sort: "popular") {
    title
  }
}
```

#### フラグメント

再利用可能なフィールドセットを定義

```graphql
query {
  user(id: "123") {
    ...userFields
    posts {
      ...postFields
    }
  }
}

fragment userFields on User {
  id
  name
  email
}

fragment postFields on Post {
  id
  title
  createdAt
}
```

## ミューテーション

GraphQL のミューテーションは、以下のような形式で記述します：

```graphql
mutation {
  createUser(name: "Alex") {
    id
  }
}
```

このミューテーションは、新しいユーザーを作成し、その `id` を返します。

### ミューテーションの実例

#### 複雑なデータ操作

```graphql
mutation {
  createPost(
    input: {
      title: "GraphQLの利点"
      content: "GraphQLは素晴らしい技術です..."
      tags: ["GraphQL", "API", "Web開発"]
      isPublished: true
    }
  ) {
    id
    createdAt
    author {
      name
    }
  }
}
```

#### 複数操作の同時実行

```graphql
mutation {
  likePost(id: "123") {
    likesCount
  }
  addComment(postId: "123", text: "素晴らしい記事です！") {
    id
    text
  }
}
```

## クエリとミューテーションの違い

クエリは、データを取得するためのもので、ミューテーションは、データを変更するためのものです。<br>
→ クエリは読み取り専用で、ミューテーションは書き込み専用です。<br>
DB で言うと、クエリは SELECT 文で、ミューテーションは INSERT、UPDATE、DELETE 文です。

### 実行順序の違い

- クエリ: 複数のフィールドが並列で実行される
- ミューテーション: シーケンシャル（順番に）実行される

これは副作用を予測可能にするために重要です。例えば以下のミューテーションは常に上から順に実行されます:

```graphql
mutation {
  updateUserEmail(id: "123", email: "new@example.com") {
    success
  }
  sendVerificationEmail(id: "123") {
    success
  }
}
```

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

**他の例**:

- `logout`: セッション破棄の副作用があるため
- `viewPost`: 閲覧数をカウントする場合は副作用があるため
- `search`: 検索履歴を保存する場合は副作用があるため

基本的には「状態を変更する可能性がある操作」は全てミューテーションとして扱うべきです。

</details>

## サブスクリプション

- GraphQL サーバーにデータ変化などの特定のイベントが生じるたびにクライアント側に通知（データ）を送る PubSub(Publish/Subscribe)通信の一つ
- 一般的な実装技術は WebSocket

```graphql
subscription {
  newMessage(roomId: "123") {
    id
    content
    sender {
      name
      avatar
    }
    createdAt
  }
}
```

このサブスクリプションは、チャットルーム「123」に新しいメッセージが投稿されるたびに通知を受け取ります。<br>
リアルタイム処理が容易に実装できる

### サブスクリプションのユースケース

1. **チャットアプリケーション**: 新しいメッセージの通知
2. **通知システム**: ユーザーへのリアルタイム通知
3. **リアルタイムダッシュボード**: 指標のライブ更新
4. **オンラインゲーム**: プレイヤーの動きや状態変化
5. **株価・仮想通貨トラッカー**: 価格の変動監視

### サブスクリプションの実装例（サーバー側: Apollo Server）

```javascript
const resolvers = {
  Subscription: {
    newMessage: {
      subscribe: (_, { roomId }, { pubsub }) => {
        // このクライアントをroomIdのPubSubチャンネルに登録
        return pubsub.asyncIterator(`CHAT_${roomId}`);
      },
    },
  },
  Mutation: {
    sendMessage: (_, { roomId, content, userId }, { pubsub, db }) => {
      // 新しいメッセージをデータベースに保存
      const message = {
        id: generateId(),
        roomId,
        content,
        senderId: userId,
        createdAt: new Date().toISOString(),
      };
      db.messages.push(message);

      // 該当するルームの購読者全員に通知
      pubsub.publish(`CHAT_${roomId}`, {
        newMessage: message,
      });

      return message;
    },
  },
};
```

<p><span style="color: yellow;">TIPS</span>
　Next.js＋Apollo Clientで効率的にリアルタイム処理を利用することができる
</p>

## GraphQL の型システム

GraphQL はスキーマ定義言語（SDL）を使用して、API のデータモデルを定義します。

### 基本的な型

```graphql
type User {
  id: ID! # 非nullのID型
  name: String! # 非nullの文字列
  email: String
  age: Int
  isActive: Boolean
  score: Float
  posts: [Post!]! # Post型の配列（null不可）
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}
```

### 特殊な型

- **スカラー型**: ID, String, Int, Float, Boolean
- **列挙型**: 事前定義された値のセット

```graphql
enum Role {
  ADMIN
  USER
  GUEST
}
```

- **入力型**: ミューテーションの引数として使用

```graphql
input PostInput {
  title: String!
  content: String!
  tags: [String!]
}
```

- **インターフェース**: 共通フィールドを持つ型の集合

```graphql
interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
}
```

- **ユニオン型**: 複数の型のいずれかを表現

```graphql
union SearchResult = User | Post | Comment
```

## まとめ: GraphQL のメリット

- クライアントが必要なデータだけを取得できる
- 一度のリクエストで関連データを全て取得できる
- 型システムによる堅牢な API 設計
- API の進化が容易（破壊的変更を避けられる）
- リアルタイム機能の組み込みサポート
- 優れた開発者体験と豊富なツールエコシステム

REST はシンプルで広く採用されていますが、GraphQL は複雑なデータ要件や頻繁に変化するフロントエンドに特に適しています。プロジェクトの要件に合わせて適切な技術を選択しましょう。
