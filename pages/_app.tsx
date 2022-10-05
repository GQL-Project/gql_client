import "../styles/globals.css";
import type { AppProps } from "next/app";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "./context";
import { useState } from "react";

const theme = createTheme({
  typography: {
    fontFamily: ["Segoe UI", "Arial"].join(","),
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedIn, setLoggedIn] = useState(null);

  const login = (id: any) => {
    setLoggedIn(id);
  };

  const logout = () => {
    setLoggedIn(null);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />;
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default MyApp;
