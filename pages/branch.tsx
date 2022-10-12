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

function NewBranch(props: { close: () => void }) {
  const authContext = useContext(AuthContext);
  const [text, setText] = useState("");
  const [branchListText, setBranchListText] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleErrorChange = () => {
    setError("Error Creating Branch!");
  };

  useEffect(() => {
    async function getBranchNames() {
      const response = await fetch("/api/vcs", {
        method: "POST",
        body: JSON.stringify({
          query: "gql branch -l",
          id: authContext.loggedIn,
        }),
      });
      if (!response.ok) {
        setBranchListText([]);
        handleErrorChange();
      }
      const data: UpdateResult = await response.json();
      if (data.message !== "") {
        setBranchListText(data.message.split(","));
      }
    }
    getBranchNames();
  }, [authContext.loggedIn]);

  const handleCreateNewBranch = async () => {
    if (text === "") {
      setError("Please enter a branch name");
      return;
    }
    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({
        query: "gql branch " + text,
        id: authContext.loggedIn,
      }),
    });
    if (!response.ok) {
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
      <h1>Create New Branch</h1>
      <TextareaAutosize
        placeholder={error}
        className={styles.branchTextArea}
        value={text}
        onChange={handleTextChange}
      />
      <br />
      {branchListText.length > 0 && <h2>Existing Branches</h2>}
      <Box className={styles.branchForm}>
        <ul className={styles.branchList}>
          {branchListText.map((branch) => (
            <li key={0}>
              <h4>{branch}</h4>
            </li>
          ))}
        </ul>
      </Box>
      <Button className={styles.regularButton} onClick={handleCreateNewBranch}>
        Create
      </Button>
      <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
    </Box>
  ) : (
    <h1>Not Logged In</h1>
  );
}

export default NewBranch;
