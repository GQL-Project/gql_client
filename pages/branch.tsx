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

function NewBranch() {
  const authContext = useContext(AuthContext);
  console.log(authContext.loggedIn);
  const [text, setText] = useState("");
  const router = useRouter();

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleCreateNewBranch = async () => {
    //TODO, how do I connect this to the backend?
    console.log("Create new branch");
    console.log(text);
  };

  return authContext.loggedIn ? (
    <Box className={styles.modal}>
      <h1>Create New Branch</h1>
      <TextareaAutosize
        aria-label="empty textarea"
        placeholder="Enter name of the new branch"
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
