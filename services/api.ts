import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";

let isRefreshing = false;
let failedRequestQueue = [];

export function setupApiClient(ctx = undefined) {

  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
      Authorization: `Bearer ${cookies["nextauth.token"]}`,
    }
  });

  api.interceptors.response.use(response => response, (error: AxiosError) => {

    if (error.response.status === 401) {
      if (error.response.data?.code === "token.expired") {
        cookies = parseCookies(ctx);

        const { "nextauth.refreshToken": refreshToken } = cookies;

        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api.post("/refresh", {
            refreshToken
          })
            .then(res => {
              const { token } = res.data;

              setCookie(ctx, "nextauth.token", token, {
                maxAge: 60 * 60 * 24 * 30, //30 days
                path: "/",
              });

              setCookie(ctx, "nextauth.refreshToken", res.data.refreshToken, {
                maxAge: 60 * 60 * 24 * 30, //30 days
                path: "/",
              });

              api.defaults.headers["Authorization"] = `Bearer ${token}`;

              failedRequestQueue.forEach(request => request.onSucess(token));
              failedRequestQueue = [];

              if (process.browser) {
                signOut();
              }

            })
            .catch(error => {
              failedRequestQueue.forEach(request => request.onFail(error));
              failedRequestQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });

        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSucess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`,

                resolve(api(originalConfig));
            },
            onFail: (error: AxiosError) => {
              reject(error);
            },
          });

        })

      } else {
        if (process.browser) {
          signOut();
        }
      }
    }

    return Promise.reject(error);

  });

  return api;
}