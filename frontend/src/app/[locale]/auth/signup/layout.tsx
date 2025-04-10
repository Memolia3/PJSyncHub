import { COMPONENT } from "@/constants";
import { generateCommonMetadata } from "@/utils";
import type { Metadata } from "next";

/**
 * 新規登録ページのメタデータを動的に生成
 * en.json, ja.jsonのSignupLayoutに対応
 * @returns メタデータ
 */
export async function generateMetadata(): Promise<Metadata> {
  return generateCommonMetadata(COMPONENT.LAYOUT.SIGNUP);
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
