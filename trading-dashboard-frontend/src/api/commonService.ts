export async function loginService(
  username: string,
  password: string
) {
  try {
    const res = await fetch(
      "http://localhost:3000/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    if (!res.ok) {
      return {
        success: false,
        error: "Invalid credentials",
      };
    }

    const data = await res.json();

    return {
      success: true,
      token: data.token,
    };
  } catch (error) {
    return {
      success: false,
      error: "Network error",
    };
  }
}