import { useTranslations } from "next-intl";
import styles from "./index.module.scss";
import { Header, Footer } from "@/components/layouts";
/**
 * トップページ
 * 「/」にアクセスしたときのページ
 * en.json, ja.jsonのIndexに対応
 * @returns トップページ
 */
export default function IndexPage() {
  const t = useTranslations("Index");
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1>{t("title")}</h1>
      </main>
      <Footer />
    </div>
  );
}
