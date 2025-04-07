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

export interface GraphQLResponse<T = any> {
  data: T | null;
  errors?: Array<{
    message: string;
    locations: Array<{
      line: number;
      column: number;
    }>;
    path: string[];
    extensions?: {
      validationErrors?: {
        [key: string]: string[];
      };
    };
  }>;
}

export type GraphQLRequestResult<T> = Promise<GraphQLResponse<T>>;
