const API_URL = "http://localhost:8080";

interface FetchOptions extends RequestInit {
  token?: string | null;
}

/**
 * Utility function for making authenticated API requests
 */
export async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  
  // Set default headers
  const headers = new Headers(fetchOptions.headers);
  
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  
  // Add authorization header if token exists
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });
  
  // Handle non-successful responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  
  // Parse JSON response
  return response.json();
} 