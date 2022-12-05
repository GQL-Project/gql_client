import React, { useEffect, useState } from "react";
import {
  TextareaAutosize,
  Button,
  Box,
  Grid,
  Card,
  Stack,
  Select,
  MenuItem,
  SelectChangeEvent,
  getLinearProgressUtilityClass,
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
  const [filterSelection, setFilterSelection] = useState("My Commits")
  const [newToOld, setNewToOld] = useState(true)
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

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterSelection(event.target.value);
    var selection = event.target.value;
    var temp = [];
    
    if (selection == "My Commits") {
      // TODO Sorting Logic for my commits
      console.log("Testing my commits");
      
    } else if (selection == "Newest Commits"){
      // TODO Sort to have newest commits first\
      console.log("Testing newest commits");
      if (!newToOld) {
        for (var key in logList) {
          temp.push(logList[key]);
        }
        temp.reverse();
        setLogList(temp);
        setNewToOld(true);
      }
      //setLogList(logList.reverse());
    } else if (selection == "Oldest Commits"){
      // TODO Sort by the oldest commits first
      console.log("Testing oldest commits");
      for (var key in logList) {
        console.log(logList[key][0].timestamp);
      }
      if (newToOld) {
        for (var key in logList) {
          temp.push(logList[key]);
        }
        temp.reverse();
        setLogList(temp);
        setNewToOld(false);
      }
    }
  };

  useEffect(() => {
    if (window.localStorage.getItem("loggedIn") !== null) {
      authContext.login(window.localStorage.getItem("loggedIn"));
    }
    async function getLogs() {
      const response = await fetch("/api/vcs", {
        method: "POST",
        body: JSON.stringify({
          query: "gql log -j",
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
          sx={{
            color: "white",
            marginTop: "1vh",
            height: "10vh",
            width: "20vw",
            margin: "2vw",
            fontSize: "larger",
            backgroundColor: "rgba(34, 34, 34, 0.438)",
          }}
          onClick={handleBack}
        >{`← Back`}</Button>
        <Box className={styles.center}>
          <h1>Database Log</h1>
        </Box>
       {/* {logList.length > 0 ?*/} 
        <h2 className={styles.center}>Order By:
          <Select
            defaultValue="Newest Commits"
            style={{ marginLeft: '.5rem' }}
            onChange={handleFilterChange}
          >
            <MenuItem value="Newest Commits">Newest Commits</MenuItem>
            <MenuItem value="Oldest Commits">Oldest Commits</MenuItem>
            <MenuItem value="My Commits">My Commits</MenuItem>
          </Select>
          </h2>
       {/*</h2> : <h2></h2>} */} 
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
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
      </Box>
    )
  );
}

export default Log;
