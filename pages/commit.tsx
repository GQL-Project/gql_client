import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { TextareaAutosize, Button, Box, Grid } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { QueryResult, UpdateResult } from "./proto/connection";
import { get } from "http";

function Commit(props) {
  const authContext = useContext(AuthContext);
  
  console.log(authContext.loggedIn);
  const [text, setText] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleErrorChange = () => {
    setError("Error Creating Commit!");
  };
  
  const handleCreateNewCommit = async () => {
    if (text === "") {
      setError("Please enter a commit message!");
      return;
    }
    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({
        query: "gql commit -m " + '"' + text + '"',
        id: authContext.loggedIn,
      }),
    });
    if (!response.ok) {
      setError("Failed to create commit!");
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
      <h1>Enter Commit Message</h1>
      <TextareaAutosize
        placeholder="Enter Commit Message here ..."
        style={{
          fontSize: "1.0rem",
          height: "10vh",
          width: "30vw",
          minHeight: "30vh",
          marginTop: "2vh",
          marginLeft: "2vh",
          marginRight: "2vh"
        }}
        value={text}
        onChange={handleTextChange}
      />
      <br />
      <Button className={styles.regularButton} onClick={handleCreateNewCommit}>
        Commit
      </Button>
      <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
    </Box>
  ) : (
    <h1>Not Logged In</h1>
  );
}

export default Commit;
