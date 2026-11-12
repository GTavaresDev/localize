import "server-only";
import { fetchHTTP } from "@/core/infra/http/fetch-http";

const BASE_URL = process.env.BACKEND_URL ?? "http://localhost:4001";

export const orderGateway = {
  async getOrder() {
    return fetchHTTP<string>({
      url: `${BASE_URL}/orders`,
      responseType: "text",
    });
  },
};
