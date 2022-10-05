import React from "react";
import styles from "../styles/Home.module.css";
import { TextareaAutosize, Button, Box } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { QueryResult, UpdateResult } from "./proto/connection";

function NewBranch() {
  const authContext = useContext(AuthContext);
  console.log(authContext.loggedIn);
  const [text, setText] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleErrorChange = () => {
    setError("Error Creating Branch!");
  }

  const handleCreateNewBranch = async () => {
    console.log("Create new branch");
    console.log(text);
    console.log(authContext.loggedIn);
    if (text === "") {
      return;
    }
    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({ query:"gql branch " + text, id: authContext.loggedIn }),
    });
    console.log(response.statusText);
    if (!response.ok) {
    } else {
      const data: UpdateResult = await response.json();
    }
    if (response.statusText === "Valid Branch Name") {
      router.push("/editor");
    } else {
      console.log("Receiving error with code");
      handleErrorChange();
    }
  };

  return authContext.loggedIn ? (
    <Box className={styles.modal}>
      <h1>Create New Branch</h1>
      <TextareaAutosize
        aria-label="empty textarea"
        placeholder={error}
        style={{
          fontSize: "1.2rem",
          width: "80%",
          textAlign: "center",
        }}
        value={text}
        onChange={handleTextChange}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          columnGap: "1vw",
        }}
      >
        <Button
          className={styles.regularButton}
          onClick={handleCreateNewBranch}
        >
          Create
        </Button>
      </div>
      <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
    </Box>
  ) : (
    <h1>Not Logged In</h1>
  );
}

export default NewBranch;
