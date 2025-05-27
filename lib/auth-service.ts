import type { UserType } from "@/types";
import { env } from "@/lib/env";

// Use centralized environment configuration
const API_URL = env.API_URL;

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: UserType;
  token: string;
}

export async function registerUser(data: RegisterRequest): Promise<void> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Registration API error:", {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(errorData.message || "Registration failed");
  }

  // Handle text response for successful registration
  const responseText = await response.text();
  console.log("Registration successful:", responseText);
  
  // No need to return anything for successful registration
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Login API error:", {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(errorData.message || "Login failed");
  }

  return response.json();
} 