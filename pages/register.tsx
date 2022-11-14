import {
  Container,
  TextField,
  InputLabel,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { useContext, useState } from "react";
import { ConnectResult } from "./proto/connection";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import logo from "../public/logo.png";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { AuthContext } from "./context";

function Register() {
  const authContext = useContext(AuthContext);
  const [status, setStatus] = useState<string | null>(null);
  const [creds, setCreds] = useState({
    address: "localhost",
    port: "50051",
    username: "",
    password1: "",
    password2: "",
  });
  const router = useRouter();

  const handleConnect = async () => {
    if (creds.password1 !== creds.password2) {
      setStatus("Passwords do not match");
      return;
    }
    if (
      creds.username === "" ||
      creds.password1 === "" ||
      creds.password2 === ""
    ) {
      setStatus("Username and password cannot be empty");
      return;
    }
    if (!authContext.loggedIn) {
      const response = await fetch("/api/connect", {
        method: "POST",
        body: JSON.stringify({
          address: creds.address,
          port: creds.port,
          username: creds.username,
          password: creds.password1,
          create: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setStatus("Error: " + data.error);
      } else {
        const data: ConnectResult = await response.json();
        setStatus(
          "User " +
            data.id +
            " created and connected to " +
            creds.address +
            ":" +
            creds.port
        );
        setCreds({
          ...creds,
          username: "",
          password1: "",
          password2: "",
        });
        authContext.login(data.id);
        window.localStorage.setItem("loggedIn", data.id);
        router.push("/editor");
      }
    }
  };

  const handleUsernameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCreds({ ...creds, username: event.target.value });
  };
  const handlePassword1Change = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCreds({ ...creds, password1: event.target.value });
  };
  const handlePassword2Change = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCreds({ ...creds, password2: event.target.value });
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
          <title>GQL Register</title>
        </Head>
        <Box className={styles.loginForm}>
          <h1 className={styles.title}>Register</h1>
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
          <Grid container columns={2} columnSpacing={3} sx={{ width: "60%" }}>
            <Grid
              item
              xs={1}
              display="flex"
              justifyContent="center"
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
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={1}
              display="flex"
              justifyContent="center"
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
                />
              </Box>
            </Grid>
            <Grid
              container
              columns={3}
              columnSpacing={3}
              justifyContent="space-evenly"
            >
              <Grid item xs={1} display="flex" alignItems="center">
                <Box>
                  <InputLabel className={styles.loginLabel}>
                    Username
                  </InputLabel>
                  <TextField
                    type="text"
                    sx={{ input: { color: "white", textAlign: "center" } }}
                    onChange={handleUsernameChange}
                    value={creds.username}
                    id="username"
                  />
                </Box>
              </Grid>

              <Grid item xs={1} display="flex" alignItems="center">
                <Box>
                  <InputLabel className={styles.loginLabel}>
                    Password
                  </InputLabel>
                  <TextField
                    type="password"
                    sx={{ input: { color: "white", textAlign: "center" } }}
                    onChange={handlePassword1Change}
                    value={creds.password1}
                    id="password"
                  />
                </Box>
              </Grid>
              <Grid item xs={1} display="flex" alignItems="center">
                <Box>
                  <InputLabel className={styles.loginLabel}>
                    Confirm password
                  </InputLabel>
                  <TextField
                    type="password"
                    sx={{ input: { color: "white", textAlign: "center" } }}
                    onChange={handlePassword2Change}
                    value={creds.password2}
                    id="password"
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Button
            className={styles.loginButton}
            sx={{
              color: "white",
              marginTop: "5vh",
              height: "10vh",
              width: "20vw",
              fontSize: "larger",
              backgroundColor: "rgba(34, 34, 34, 0.438)",
            }}
            onClick={handleConnect}
          >
            Register →
          </Button>
          <h3>{status}</h3>
        </Box>
      </Container>
    </div>
  );
}

export default Register;
