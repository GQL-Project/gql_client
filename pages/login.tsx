import { Container, TextField, InputLabel, Button } from "@mui/material";
import { useState } from "react";
import { ConnectResult } from "./proto/connection";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import logo from "../assets/logo.png";
import Link from "next/link";
import { useRouter } from "next/router";

function Login() {
  const [userid, setID] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [creds, setCreds] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();

  const handleConnect = async () => {
    const response = await fetch("/api/connect");
    if (!response.ok) {
      setStatus("Error: " + response.statusText);
    } else {
      const data: ConnectResult = await response.json();
      setID(data.id);
      setStatus(data.id);
      setCreds({
        username: "",
        password: "",
      });
      router.push("/editor");
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
        <h1 className={styles.title}>Login</h1>
        <form
          style={{
            marginTop: "10vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Image src={logo} alt="GQL Logo" height={200} objectFit="contain" />
          <InputLabel
            style={{
              marginTop: "2vh",
              color: "white",
            }}
          >
            Username:
          </InputLabel>
          <TextField
            type="text"
            sx={{ input: { color: "white" } }}
            onChange={handleUsernameChange}
            value={creds.username}
            id="username"
          />
          <InputLabel
            style={{
              color: "white",
            }}
          >
            Password:
          </InputLabel>
          <TextField
            type="password"
            sx={{ input: { color: "white" } }}
            onChange={handlePasswordChange}
            value={creds.password}
            id="password"
          />
          <Button className={styles.loginButton} onClick={handleConnect}>
            Login
          </Button>
          <h5>
            <a>
              {status
                ? `Connected to server at ${status}`
                : "Not connected to server"}
            </a>
          </h5>
        </form>
      </Container>
    </div>
  );
}

export default Login;
