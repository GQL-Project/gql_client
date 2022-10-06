import {
  Container,
  TextField,
  InputLabel,
  Button,
  Grid,
  Box,
} from "@mui/material";
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
    address: "localhost",
    port: "50051",
    username: "",
    password: "",
  });
  const router = useRouter();

  const handleConnect = async () => {
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
        setStatus("Connected to " + creds.address + ":" + creds.port);
        setCreds({
          ...creds,
          username: "",
          password: "",
        });
        authContext.login(data.id);
        setTimeout(() => {
          router.push("/editor");
        }, 1000);
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
  const handleAddressChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCreds({ ...creds, address: event.target.value });
  };
  const handlePortChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCreds({ ...creds, port: event.target.value });
  };

  return (
    <div className={styles.bg}>
      <Container className={styles.container}>
        <Head>
          <title>GQL Login</title>
        </Head>
        <Box className={styles.loginForm}>
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
          <Grid container columns={2} columnSpacing={3}>
            <Grid
              item
              xs={1}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Box>
                <InputLabel className={styles.loginLabel}>Address</InputLabel>
                <TextField
                  type="text"
                  sx={{ input: { color: "white", textAlign: "center" } }}
                  onChange={handleAddressChange}
                  value={creds.address}
                  id="address"
                  inputProps={{ "data-testid": "server-address" }} // The value is the id needed for testing
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={1}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Box>
                <InputLabel className={styles.loginLabel}>Username</InputLabel>
                <TextField
                  type="text"
                  sx={{ input: { color: "white", textAlign: "center" } }}
                  onChange={handleUsernameChange}
                  value={creds.username}
                  id="username"
                  inputProps={{ "data-testid": "account-username" }} // The value is the id needed for testing
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={1}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Box>
                <InputLabel className={styles.loginLabel}>Port</InputLabel>
                <TextField
                  type="text"
                  sx={{ input: { color: "white", textAlign: "center" } }}
                  onChange={handlePortChange}
                  value={creds.port}
                  id="port"
                  inputProps={{ "data-testid": "server-port" }} // The value is the id needed for testing
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={1}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Box>
                <InputLabel className={styles.loginLabel}>Password</InputLabel>
                <TextField
                  type="password"
                  sx={{ input: { color: "white", textAlign: "center" } }}
                  onChange={handlePasswordChange}
                  value={creds.password}
                  id="password"
                  inputProps={{ "data-testid": "account-password" }} // The value is the id needed for testing
                />
              </Box>
            </Grid>
          </Grid>
          <Button className={styles.loginButton} onClick={handleConnect}>
            Login →
          </Button>
          <h3>{status}</h3>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
