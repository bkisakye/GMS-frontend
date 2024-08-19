export function removeTrailingSlash(url) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}
const baseUrl = removeTrailingSlash(process.env.REACT_APP_API_BASE_URL);
export function setTokens(accessToken, refreshToken) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  return fetch(`${baseUrl}/api/authentication/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
}

export async function fetchWithAuth(url, options = {}) {
  const accessToken = getAccessToken();
  url = `${baseUrl}${url}`;

  // Default to GET method if not provided
  options.method = options.method || "GET";

  // Ensure headers are properly set
  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  // Only set the body if there's data to send
  if (options.body && typeof options.body !== "string") {
    options.body = JSON.stringify(options.body);
  }

  console.log("request:", url, options);
  let response = await fetch(url, options);

  // If access token is expired, try to refresh it
  if (response.status === 401) {
    const refreshResponse = await refreshAccessToken();
    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      const newAccessToken = data.access;
      setTokens(newAccessToken, getRefreshToken());

      // Retry the original request with the new access token
      options.headers["Authorization"] = `Bearer ${newAccessToken}`;
      response = await fetch(url, options);
    } else {
      localStorage.clear();
      window.location.href = "/login";
    }
  } else if (response.status === 400) {
    const data = await response.json();
    console.error("Error:", data);
  }

  return response;
}
