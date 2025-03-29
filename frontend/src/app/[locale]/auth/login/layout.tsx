import { COMPONENT } from "@/constants";
import { generateCommonMetadata } from "@/utils";
import type { Metadata } from "next";

/**
 * ログインページのメタデータを動的に生成
 * en.json, ja.jsonのLoginLayoutに対応
 * @returns メタデータ
 */
export async function generateMetadata(): Promise<Metadata> {
  return generateCommonMetadata(COMPONENT.LAYOUT.LOGIN);
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
