import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BACKEND_URL } from "@/constant/endpoins";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export class ProductServices {
  private backendUrl: string;

  constructor() {
    this.backendUrl =
      `${BACKEND_URL}/api/v1/products` ||
      "http://localhost:3000/api/v1/products";
  }

  private async handleResponse<T>(
    response: AxiosResponse<T>
  ): Promise<ApiResponse<T>> {
    if (response.status >= 200 && response.status < 300) {
      return { data: response.data };
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return { error: response.data?.message || "Request failed" };
    }
  }

  private async fetchJson<T>(
    url: string,
    options: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axios(url, options);
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("Fetch error:", error);
      if (axios.isAxiosError(error) && error.response) {
        return { error: error.response.data?.message || "Network error" };
      }
      return { error: "Network error" };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getAllProducts(page = 1, limit = 20): Promise<ApiResponse<any>> {
    const options: AxiosRequestConfig = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.fetchJson<any>(
      `${this.backendUrl}?page=${page}&limit=${limit}`,
      options
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getProductById(id: number): Promise<ApiResponse<any>> {
    const options: AxiosRequestConfig = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.fetchJson<any>(`${this.backendUrl}/${id}`, options);
  }
}
