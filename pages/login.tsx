import { Container, TextField, InputLabel, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useContext, useState } from "react";
import { ConnectResult } from "./proto/connection";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import logo from "../public/logo.png";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { AuthContext } from "./context";

function Login() {
  const authContext = useContext(AuthContext);
  const [status, setStatus] = useState<string | null>(null);
  const [creds, setCreds] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();

  const handleConnect = async () => {
    console.log(authContext.loggedIn);
    if (!authContext.loggedIn) {
      if (creds.username === "" || creds.password === "") {
        setStatus("Please enter a username and password");
        return;
      }
      const response = await fetch("/api/connect");
      if (!response.ok) {
        setStatus("Error: " + response.statusText);
      } else {
        const data: ConnectResult = await response.json();
        setStatus(data.id);
        setCreds({
          username: "",
          password: "",
        });
        authContext.login(data.id);
        router.push("/editor");
      }
    }
  };

  const handleUsernameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCreds({ ...creds, username: event.target.value });
  };
  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCreds({ ...creds, password: event.target.value });
  };

  return (
    <div className={styles.bg}>
      <Container className={styles.container}>
        <Head>
          <title>GQL Login</title>
        </Head>
        <form
          style={{
            marginTop: "10vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h1 className={styles.title}>Login</h1>
          <Link href="/">
            <a>
              <Image
                src={logo}
                alt="GQL Logo"
                height={200}
                objectFit="contain"
              />
            </a>
          </Link>
          <InputLabel className={styles.loginLabel}>Username:</InputLabel>
          <TextField
            type="text"
            sx={{ input: { color: "white" } }}
            onChange={handleUsernameChange}
            value={creds.username}
            id="username"
          />
          <InputLabel className={styles.loginLabel}>Password:</InputLabel>
          <TextField
            type="password"
            sx={{ input: { color: "white", borderColor: "white" } }}
            onChange={handlePasswordChange}
            value={creds.password}
            id="password"
          />
          <Button className={styles.loginButton} onClick={handleConnect}>
            Login →
          </Button>
          <h5>
            <a>{status ? `${status}` : "Not connected to server"}</a>
          </h5>
        </form>
      </Container>
    </div>
  );
}

export default Login;
