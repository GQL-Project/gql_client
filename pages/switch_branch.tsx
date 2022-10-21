import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { TextareaAutosize, Button, Box, Grid, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { QueryResult, UpdateResult } from "./proto/connection";
import { get } from "http";

function SwitchBranch(props: { close: () => void }) {
  const authContext = useContext(AuthContext);
  const [newBranchName, setBranchName] = useState("");
  const [branchListText, setBranchListText] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleBranchChange = (event: SelectChangeEvent) => {
    setBranchName(event.target.value);
  };

  const handleErrorChange = (text: string) => {
    setError(text);
  };

  useEffect(() => {
    async function getBranchNames() {
      setError("");

      const response = await fetch("/api/vcs", {
        method: "POST",
        body: JSON.stringify({
          query: "gql branch -l",
          id: authContext.loggedIn,
        }),
      });
      if (!response.ok) {
        setBranchListText([]);
        handleErrorChange("Could not retrieve branch names");
      }
      const data: UpdateResult = await response.json();
      if (data.message !== "") {
        let splitMsg = data.message.split(",");
        for (let i = 0; i < splitMsg.length; i++) {
            splitMsg[i] = splitMsg[i].trim();
        }
        setBranchListText(splitMsg);
      }
    }
    getBranchNames();
  }, [authContext.loggedIn]);

  const handleSwitchBranch = async () => {
    if (newBranchName === "") {
      setError("Please enter a branch name");
      return;
    }

    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({
        query: "gql switch_branch " + newBranchName.trim(),
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
      const errMsg = await response.json();
      handleErrorChange("Could not switch branches: " + errMsg.message);
    }
  };

  return authContext.loggedIn ? (
    <Box className={styles.modal}>
      <h1>Switch Branch</h1>
      
      <div>
        <label className={styles.mergeBranchesLabel}>New Branch: </label>

        <Select
            defaultValue=""
            onChange={handleBranchChange}
            >
            {branchListText.map((branch) => (
                <MenuItem value={branch}>{branch}</MenuItem>
            ))}
        </Select>
      </div>

      <p className={styles.createTableErrorText}>{error}</p>

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
        onClick={handleSwitchBranch}
      >
        Switch
      </Button>
      <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
    </Box>
  ) : (
    <h1>Not Logged In</h1>
  );
}

export default SwitchBranch;
