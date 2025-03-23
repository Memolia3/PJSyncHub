import { SignupCard } from "@/components/features/auth";

/**
 * 新規登録ページ
 * 「/auth/signup」にアクセスしたときのページ
 * @returns 新規登録ページ
 */
export default function SignupPage() {
  return (
    <main>
      <SignupCard />
    </main>
  );
}
