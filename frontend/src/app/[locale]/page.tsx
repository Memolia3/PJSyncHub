import styles from "./index.module.scss";

import { Hero } from "@/components/features/home";

/**
 * トップページ
 * 「/」にアクセスしたときのページ
 * en.json, ja.jsonのIndexに対応
 * @returns トップページ
 */
export default function IndexPage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Hero />
      </main>
    </div>
  );
}
