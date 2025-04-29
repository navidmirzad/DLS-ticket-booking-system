export const fetchWithAuth = async (input: RequestInfo, init?: RequestInit) => {
    const token = localStorage.getItem("token");
    let headers: HeadersInit = {
      "Content-Type": "application/json",
    };
  
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  
    if (init && init.headers) {
      headers = { ...headers, ...init.headers };
    }
  
    const response = await fetch(input, {
      ...init,
      headers,
    });
  
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.statusText}`);
    }
  
    return response;
  };
  