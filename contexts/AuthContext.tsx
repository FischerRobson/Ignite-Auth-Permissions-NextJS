import { useRouter } from "next/dist/client/router";
import { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../services/api";
import { setCookie } from "nookies";

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  isAuthenticated: boolean;
  user: User;
};

type AuthProviderProps = {
  children: ReactNode;
}

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {

  const router = useRouter();

  const [user, setUser] = useState<User>(null);

  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInCredentials) {

    try {
      const response = await api.post("/sessions", {
        email,
        password
      });

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: "/",
      });
      setCookie(undefined, "nextauth.refreshToek", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: "/",
      });

      setUser({
        email,
        permissions,
        roles
      });

      router.push("dashboard");

    } catch (err) {
      console.log(err);
    }

  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user }} >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
}