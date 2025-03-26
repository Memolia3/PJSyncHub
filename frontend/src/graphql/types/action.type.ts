import type { RequestInit } from "next/dist/server/web/spec-extension/request";

export interface GraphQLRequestOptions
  extends Omit<RequestInit, "body" | "method"> {
  method?: "GET" | "POST";
}

export interface GraphQLRequestParams {
  query: string;
  variables?: Record<string, unknown>;
  options?: GraphQLRequestOptions;
}
