import { useQuery } from "@tanstack/react-query";

const getUserQuery = `
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      avatarUrl
    }
  }
`;

/**
 * ユーザーを取得する
 * @param userId - ユーザーID
 * @returns ユーザー
 */
export function useUser(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: getUserQuery,
          variables: { id: userId },
        }),
      });
      const { data } = await response.json();
      return data.user;
    },
  });
}
