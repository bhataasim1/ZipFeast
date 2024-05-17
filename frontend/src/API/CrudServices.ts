import { BACKEND_URL } from "@/constant/endpoins";
import { userRegisterTypes } from "./types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export class CrudServices {
  private backendUrl: string;

  constructor() {
    this.backendUrl =
      `${BACKEND_URL}/api/v1/user` || "http://localhost:3000/api/v1/user";
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (response.ok) {
      return { data: await response.json() };
    } else {
      const errorData = await response.json();
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return { error: errorData.message.message || "Request failed" };
    }
  }

  private async fetchJson<T>(
    url: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, options);
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error("Fetch error:", error);
      return { error: "Network error" };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async registerUser(data: userRegisterTypes): Promise<ApiResponse<any>> {
    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.fetchJson<any>(`${this.backendUrl}/register`, options);
  }

  async loginUser(data: {
    email: string;
    password: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<ApiResponse<any>> {
    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.fetchJson<any>(`${this.backendUrl}/login`, options);
  }

  async logoutUser(): Promise<ApiResponse<null>> {
    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    return this.fetchJson<null>(`${this.backendUrl}/logout`, options);
  }
}
