export const validateToken = async (): Promise<boolean> => {
    const token = localStorage.getItem("token");
  
    if (!token) return false;
  
    try {
      const response = await fetch(import.meta.env.VITE_VALIDATE_TOKEN_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        return true; // token is valid
      } else {
        return false; // invalid or expired
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  };