/**
 * OAuthユーザーの型
 * @property email - メールアドレス
 * @property name - 名前
 * @property image - プロフィール画像URL
 */
export type OAuthUser = {
  email?: string | null;
  name?: string | null;
  image?: string | null;
};
