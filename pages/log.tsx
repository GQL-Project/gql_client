import React, { useEffect, useState } from "react";
import {
  TextareaAutosize,
  Button,
  Box,
  Grid,
  Card,
  Stack,
} from "@mui/material";
import styles from "../styles/Home.module.css";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { UpdateResult } from "./proto/connection";
import { useRouter } from "next/router";
import Head from "next/head";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

function Log() {
  const authContext = useContext(AuthContext);
  const [logList, setLogList] = useState({});
  const [error, setError] = useState("No Commits");
  TimeAgo.addDefaultLocale(en);
  const timeAgo = new TimeAgo("en-US");

  function groupArrayOfObjects(list, key) {
    return list.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  const router = useRouter();
  const handleBack = () => {
    router.push("/editor");
  };

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
          const logs: [] = JSON.parse(data.message).map((log) => {
            const newLog = {
              message: log.message,
              hash: log.hash.slice(0, 7),
              timestamp: new Date(+log.timestamp).toDateString(),
              timeAgo: timeAgo.format(+log.timestamp),
            };
            return newLog;
          });
          setLogList(groupArrayOfObjects(logs, "timestamp"));
        }
      }
    }
    getLogs();
  }, [authContext.loggedIn]);
  return (
    authContext.loggedIn && (
      <Box className={`${styles.background}`}>
        <Head>
          <title>GQL Editor</title>
        </Head>
        <Button
          className={styles.button}
          onClick={handleBack}
        >{`← Back`}</Button>
        <Box className={styles.center}>
          <h1>Database Log</h1>
        </Box>
        <Stack className={styles.center}>
          {Object.keys(logList).map((key) => {
            return (
              <Card
                key={key}
                sx={{
                  width: "60vw",
                  backgroundColor: "#1e1e1e",
                  boxShadow: 1,
                  p: 1.5,
                  m: 1,
                }}
              >
                <h2>{key}</h2>
                {logList[key].map((log) => {
                  return (
                    <Grid key={log.hash} container spacing={2}>
                      <Grid item xs={12} sm container>
                        <Grid item xs>
                          <h3>{log.message}</h3>
                        </Grid>
                        <Grid item xs>
                          <h4>{log.hash}</h4>
                        </Grid>
                        <Grid item>
                          <h4>{log.timeAgo}</h4>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}
              </Card>
            );
          })}
        </Stack>
        <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
      </Box>
    )
  );
}

export default Log;
