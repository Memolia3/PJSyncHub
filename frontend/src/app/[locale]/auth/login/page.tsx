import styles from "./login.module.scss";

import { LoginCard } from "@/components/features/auth";

/**
 * ログインページ
 * 「/auth/login」にアクセスしたときのページ
 * @returns ログインページ
 */
export default function LoginPage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <LoginCard />
      </main>
    </div>
  );
}
