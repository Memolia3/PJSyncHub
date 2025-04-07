import type {
  GraphQLRequestOptions,
  GraphQLRequestParams,
  GraphQLRequestResult,
} from "@/graphql/types/action.type";

/**
 * GraphQLリクエストを実行する関数
 */
export async function fetchGraphQL({
  query,
  variables,
  options = {},
}: GraphQLRequestParams) {
  const { method = "POST", ...restOptions } = options;
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL!;
  const body = JSON.stringify({ query, variables });

  // GETリクエストの場合はクエリパラメータとして送信
  const finalUrl =
    method === "GET"
      ? `${url}?query=${encodeURIComponent(
          query
        )}&variables=${encodeURIComponent(JSON.stringify(variables))}`
      : url;

  const res = await fetch(finalUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...restOptions.headers,
    },
    ...restOptions,
    ...(method === "POST" ? { body } : {}),
  });

  const json = await res.json();
  if (json.errors) {
    return {
      data: null,
      errors: json.errors,
    };
  }

  return json;
}

/**
 * クエリ実行用のヘルパー関数
 */
export function fetchQuery(
  query: string,
  variables?: Record<string, unknown>,
  options?: GraphQLRequestOptions
) {
  return fetchGraphQL({
    query,
    variables,
    options: { method: "GET", ...options },
  });
}

/**
 * ミューテーション実行用のヘルパー関数
 */
export async function fetchMutation<T>(
  mutation: string,
  variables?: Record<string, unknown>,
  options?: GraphQLRequestOptions
): GraphQLRequestResult<T> {
  return fetchGraphQL({
    query: mutation,
    variables,
    options: { method: "POST", ...options },
  }) as GraphQLRequestResult<T>;
}
