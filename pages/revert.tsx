import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { TextareaAutosize, Button, Box, Grid } from "@mui/material";
import { useState } from "react";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { QueryResult, UpdateResult } from "./proto/connection";
import { get } from "http";

function Revert(props: { close: () => void }) {
  const authContext = useContext(AuthContext);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("Enter Commit Hash here ...");

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  useEffect(() => {
    if (window.localStorage.getItem("loggedIn") !== null) {
      authContext.login(window.localStorage.getItem("loggedIn"));
    }
    async function getStatus() {
      const response = await fetch("/api/vcs", {
        method: "POST",
        body: JSON.stringify({
          query: "gql status",
          id: authContext.loggedIn,
        }),
      });
      if (!response.ok) {
        setStatus("Error retrieving status");
      }
      const data: UpdateResult = await response.json();
      console.log(data);

      if (data.message !== "") {
        setStatus(data.message.split("\n").join("\n"));
      }
    }
    getStatus();
  }, [authContext.loggedIn]);

  const handleErrorChange = () => {
    setError("Error Reverting!");
  };

  const handleRevertCommit = async () => {
    if (text === "") {
      setError("Please enter a commit hash!");
      return;
    }
    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({
        query: "gql revert " + text,
        id: authContext.loggedIn,
      }),
    });
    if (!response.ok) {
      setError("Failed to revert!");
    } else {
      const data: UpdateResult = await response.json();
    }
    if (response.statusText === "OK") {
      props.close();
    } else {
      setText("");
      handleErrorChange();
    }
  };

  return authContext.loggedIn ? (
    <Box className={styles.modal}>
      <h1>Enter Commit Hash</h1>
      <Box className={styles.commitPage}>
        <Box className={styles.status}>
          <h2>{status}</h2>
        </Box>
        <TextareaAutosize
          placeholder={error}
          style={{
            fontSize: "1.0rem",
            height: "10vh",
            width: "30vw",
            minHeight: "30vh",
            marginTop: "2vh",
            marginLeft: "2vh",
            marginRight: "2vh",
          }}
          value={text}
          onChange={handleTextChange}
        />
      </Box>
      <br />
      <Button
        className={styles.regularButton}
        sx={{
          color: "white",
          borderColor: "white",
          marginTop: "2vh",
          marginBottom: "2vh",
          fontSize: "large",
          backgroundColor: "rgba(34, 34, 34, 0.438)",
        }}
        onClick={handleRevertCommit}
      >
        Revert
      </Button>
      <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
    </Box>
  ) : (
    <h1>Not Logged In</h1>
  );
}

export default Revert;
