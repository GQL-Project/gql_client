import { createContext } from "react";

export const AuthContext = createContext({
  loggedIn: null,
  login: (id: any) => {},
  logout: () => {},
});
