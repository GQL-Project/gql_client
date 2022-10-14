import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import {
  TextareaAutosize,
  Button,
  Box,
  Grid,
  Card,
  Stack,
} from "@mui/material";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { UpdateResult } from "./proto/connection";

function Log() {
  const authContext = useContext(AuthContext);
  const [logList, setLogList] = useState([]);
  const [error, setError] = useState("No Commits");

  useEffect(() => {
    if (window.localStorage.getItem("loggedIn") !== null) {
      authContext.login(window.localStorage.getItem("loggedIn"));
    }
  }, []);

  useEffect(() => {
    async function getLogs() {
      const response = await fetch("/api/vcs", {
        method: "POST",
        body: JSON.stringify({
          query: "gql log -json",
          id: authContext.loggedIn,
        }),
      });
      if (!response.ok) {
        setLogList([]);
        setError("Error Retrieving Log!");
      }
      const data: UpdateResult = await response.json();
      if (data.message !== "") {
        if (data.message.toLowerCase() === "no commits!") {
          setLogList([]);
        } else {
          const logs = JSON.parse(data.message);
          setLogList(
            logs.map((log) => {
              const newLog = {
                hash: log.hash,
                timestamp: new Date(+log.timestamp).toLocaleString(),

                message: log.message,
              };
              return newLog;
            })
          );
        }
      }
    }
    getLogs();
  }, [authContext.loggedIn]);
  return (
    authContext.loggedIn && (
      <Box className={`${styles.background}`}>
        <Box className={styles.center}>
          <h1>Database Log</h1>
          <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
        </Box>
        <Box>
          {logList.length > 0 ? (
            <h2 className={styles.center}>Commits</h2>
          ) : (
            <h2>{error}</h2>
          )}
          <Stack>
            {logList.map((log) => (
              <Box className={styles.log} key={log.hash}>
                <h3>{log.message}</h3>
                <h3>{log.hash}</h3>
                <h3>{log.timestamp}</h3>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    )
  );
}

export default Log;
