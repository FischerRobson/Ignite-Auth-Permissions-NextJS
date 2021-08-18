import { createContext, ReactNode, useContext } from "react";

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {

  const isAuthenticated = true;

  async function signIn({ email, password }: SignInCredentials) {

  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn }} >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
}