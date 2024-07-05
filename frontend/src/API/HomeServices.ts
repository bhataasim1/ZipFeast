/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { BACKEND_URL } from "@/constant/endpoins";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export class HomeServices {
  private backendUrl: string;
  private token = useAuthHeader();

  constructor() {
    this.backendUrl =
      `${BACKEND_URL}/api/v1/homeservice` ||
      "http://localhost:3000/api/v1/homeservice";
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

  async registerUser(data: any): Promise<ApiResponse<any>> {
    const options: AxiosRequestConfig = {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      data: data,
    };

    return this.fetchJson<any>(`${this.backendUrl}/register`, options);
  }

  async loginUser(data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<any>> {
    const options: AxiosRequestConfig = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(data),
    };

    return this.fetchJson<any>(`${this.backendUrl}/login`, options);
  }

  async getUserProfile(): Promise<ApiResponse<null>> {
    const options: AxiosRequestConfig = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this?.token,
      },
    };

    return this.fetchJson<null>(`${this.backendUrl}/profile`, options);
  }

  async updateUserProfile(data: any): Promise<ApiResponse<null>> {
    const options: AxiosRequestConfig = {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: this?.token,
      },
      data: data,
    };

    return this.fetchJson<null>(`${this.backendUrl}/profile/update`, options);
  }

  async getAllServiceProviders(): Promise<ApiResponse<any>> {
    const options: AxiosRequestConfig = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this?.token,
      },
    };

    return this.fetchJson<any>(
      `http://127.0.0.1:3000/api/v1/service-providers`,
      options
    );
  }

  async getServiceProviderById(id: number): Promise<ApiResponse<any>> {
    const options: AxiosRequestConfig = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: this?.token,
      },
    };

    return this.fetchJson<any>(
      `http://127.0.0.1:3000/api/v1/service-provider/${id}`,
      options
    );
  }
}
