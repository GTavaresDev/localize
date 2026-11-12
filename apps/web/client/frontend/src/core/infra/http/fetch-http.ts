import "server-only";
import { Either, RequestError, failure, success } from "@/core/shared/either";

export type Options = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  responseType?: "json" | "text";
  timeout?: number;
  revalidate?: number | false;
};

export async function fetchHTTP<T>({
  url,
  method = "GET",
  responseType = "json",
  timeout = 15000,
  revalidate = false,
}: Options): Promise<Either<RequestError, T>> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      ...(revalidate === false
        ? { cache: "no-store" }
        : { next: { revalidate } }),
    });

    if (!response.ok) {
      return failure({
        status: response.status,
        message: `Erro na requisição HTTP: status ${response.status}`,
      });
    }

    const data =
      responseType === "json" ? await response.json() : await response.text();
    return success(data as T);
  } catch (error) {
    return failure({
      status: 503,
      message: error instanceof Error ? error.message : "Serviço indisponível",
    });
  } finally {
    clearTimeout(id);
  }
}

export type HTTP = typeof fetchHTTP;
