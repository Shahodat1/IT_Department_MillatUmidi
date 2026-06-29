const API_BASE = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

const TOKEN_REFRESH_URL = `${API_BASE}/api/token/refresh/`;

const ACCESS_TOKEN_KEYS = [
  "access",
  "access_token",
  "token",
  "jwt",
  "authToken",
  "adminAccessToken",
];

const REFRESH_TOKEN_KEYS = [
  "refresh",
  "refresh_token",
  "refreshToken",
  "jwt_refresh",
  "authRefreshToken",
  "adminRefreshToken",
];

let refreshPromise = null;

function readFirstStored(keys) {
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }
  return "";
}

function writeAllStored(keys, token) {
  for (const key of keys) {
    if (token) localStorage.setItem(key, token);
    else localStorage.removeItem(key);
  }
}

function removeAllStored(keys) {
  for (const key of keys) {
    localStorage.removeItem(key);
  }
}

export function getAccessToken() {
  return readFirstStored(ACCESS_TOKEN_KEYS);
}

export function getRefreshToken() {
  return readFirstStored(REFRESH_TOKEN_KEYS);
}

export function setAccessToken(token) {
  writeAllStored(ACCESS_TOKEN_KEYS, token);
}

export function setRefreshToken(token) {
  writeAllStored(REFRESH_TOKEN_KEYS, token);
}

export function clearAuthTokens() {
  removeAllStored(ACCESS_TOKEN_KEYS);
  removeAllStored(REFRESH_TOKEN_KEYS);
}

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refresh = getRefreshToken();

    if (!refresh) {
      clearAuthTokens();
      throw new Error("Refresh token topilmadi. Qayta login qiling.");
    }

    const response = await fetch(TOKEN_REFRESH_URL, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      clearAuthTokens();
      throw new Error("Session expired. Qayta login qiling.");
    }

    const data = await response.json();

    if (!data?.access) {
      clearAuthTokens();
      throw new Error("Token yangilanmadi. Qayta login qiling.");
    }

    setAccessToken(data.access);
    return data.access;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

function isAuthError(response, errData) {
  const detail =
    errData?.detail ||
    errData?.message ||
    errData?.non_field_errors?.[0] ||
    errData?.error ||
    "";

  const text = String(detail).toLowerCase();

  return (
    response.status === 401 ||
    text.includes("token") ||
    text.includes("authentication") ||
    text.includes("not valid") ||
    text.includes("unauthorized") ||
    text.includes("credentials") ||
    text.includes("not authenticated")
  );
}

async function readErrorData(response) {
  try {
    return await response.json();
  } catch {
    try {
      const text = await response.text();
      return text ? { detail: text } : null;
    } catch {
      return null;
    }
  }
}

export async function request(path, options = {}) {
  const {
    method = "GET",
    data = null,
    isFormData = false,
    headers = {},
    auth = true,
    retryOnAuthError = true,
  } = options;

  const token = auth ? getAccessToken() : "";

  const finalHeaders = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  if (!isFormData && data !== null) {
    const hasContentType = Object.keys(finalHeaders).some(
      (key) => key.toLowerCase() === "content-type",
    );

    if (!hasContentType) {
      finalHeaders["Content-Type"] = "application/json";
    }
  }

  const config = {
    method,
    mode: "cors",
    credentials: "omit",
    headers: finalHeaders,
  };

  if (data !== null) {
    config.body = isFormData ? data : JSON.stringify(data);
  }

  const url = /^https?:\/\//i.test(path) ? path : `${API_BASE}${path}`;

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new Error(networkError?.message || "Network xatolik yuz berdi.");
  }

  if (!response.ok) {
    const errData = await readErrorData(response);

    const errorMessage =
      errData?.detail ||
      errData?.message ||
      errData?.non_field_errors?.[0] ||
      errData?.error ||
      (typeof errData === "string" ? errData : "") ||
      `Request failed with status ${response.status}`;

    if (auth && retryOnAuthError && isAuthError(response, errData)) {
      await refreshAccessToken();

      return request(path, {
        method,
        data,
        isFormData,
        headers,
        auth,
        retryOnAuthError: false,
      });
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) return null;

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function extractItems(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload?.results && Array.isArray(payload.results))
    return payload.results;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  return [];
}

export function buildPayload(values, fields = []) {
  console.log("FIELDS", fields);
  console.log("VALUES", values);
  const hasFile = fields.some((field) => {
    const value = values?.[field.name];

    if (field.type === "file" && value instanceof File) {
      return true;
    }

    if (field.type === "nested_section" && Array.isArray(value)) {
      return value.some((item) =>
        field.fields?.some(
          (subField) =>
            subField.type === "file" && item?.[subField.name] instanceof File,
        ),
      );
    }

    return false;
  });
  if (!hasFile) {
    const payload = {};

    fields.forEach((field) => {
      if (field.skipOnSubmit) return;
      if (field.type === "file") return;

      let value = values?.[field.name];

      if (field.parse) {
        value = field.parse(value);
      }

      if (field.type === "number") {
        if (value === "" || value === null || value === undefined) return;
        payload[field.name] = Number(value);
        return;
      }

      if (field.type === "checkbox") {
        payload[field.name] = Boolean(value);
        return;
      }

      if (field.name === "tags") {
        if (Array.isArray(value)) {
          payload[field.name] = value;
          return;
        }

        if (typeof value === "string") {
          payload[field.name] = value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          return;
        }
      }

      payload[field.name] = value;
    });

    return payload;
  }

  const formData = new FormData();

  fields.forEach((field) => {
    if (field.skipOnSubmit) return;

    let value = values?.[field.name];

    if (field.parse) {
      value = field.parse(value);
    }

    if (field.type === "file") {
      if (value instanceof File) {
        formData.append(field.name, value);
      }
      return;
    }

    if (value === undefined || value === null || value === "") return;

    if (field.type === "number") {
      formData.append(field.name, String(Number(value)));
      return;
    }

    if (field.type === "checkbox") {
      formData.append(field.name, value ? "true" : "false");
      return;
    }

    if (field.name === "tags") {
      if (Array.isArray(value)) {
        formData.append(field.name, JSON.stringify(value));
        return;
      }

      if (typeof value === "string") {
        const arr = value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        formData.append(field.name, JSON.stringify(arr));
        return;
      }
    }

    if (field.type === "nested_section" && Array.isArray(value)) {
      const cleaned = value.map((item) => {
        const copy = { ...item };

        field.fields?.forEach((subField) => {
          if (subField.type === "file" && copy[subField.name] instanceof File) {
            delete copy[subField.name];
          }
        });

        return copy;
      });

      formData.append(field.name, JSON.stringify(cleaned));

      value.forEach((item, index) => {
        field.fields?.forEach((subField) => {
          const fileValue = item?.[subField.name];

          if (subField.type === "file" && fileValue instanceof File) {
            formData.append(
              `${field.name}_${index}_${subField.name}`,
              fileValue,
            );
          }
        });
      });

      return;
    }

    if (Array.isArray(value)) {
      formData.append(field.name, JSON.stringify(value));
      return;
    }

    formData.append(field.name, value);
  });
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  return formData;
}

export function toSelectOptions(items = [], valueKey = "id", labelFn = null) {
  return items.map((item) => ({
    value: item?.[valueKey],
    label:
      typeof labelFn === "function"
        ? labelFn(item)
        : item?.name || item?.title || item?.label || `#${item?.id}`,
  }));
}

export function getId(item) {
  return item?.id || item?.pk || null;
}
