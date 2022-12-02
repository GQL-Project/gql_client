import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { TextareaAutosize, Button, Box, Grid, Select, SelectChangeEvent, Input, MenuItem, Checkbox } from "@mui/material";
import { useState } from "react";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { QueryResult, UpdateResult } from "./proto/connection";
import { get } from "http";
import Link from "next/link";

function History() {
  const authContext = useContext(AuthContext);
  const [commitListText, setCommitListText] = useState<string[]>([]);
  const [error, setError] = useState("No Commits");
  const [filterSelection, setFilterSelection] = useState("My Commits")
  const handleErrorChange = () => {
    setError("Error Retrieving Log!");
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterSelection(event.target.value);
    if (filterSelection == "My Commits") {
      // TODO Sorting Logic for my commits
      
    } else if (filterSelection == "Newest Commits"){
      // TODO Sort to have newest commits first
      
    } else if (filterSelection == "Oldest Commits"){
      // TODO Sort by the oldest commits first
      
    }
  };

  useEffect(() => {
    async function getCommitNames() {
      const response = await fetch("/api/vcs", {
        method: "POST",
        body: JSON.stringify({
          query: "gql log",
          id: authContext.loggedIn,
        }),
      });
      if (!response.ok) {
        setCommitListText([]);
        handleErrorChange();
      }
      const data: UpdateResult = await response.json();
      if (data.message !== "") {
        if (data.message.toLowerCase() === "no commits!") {
          setCommitListText([]);
        } else {
          setCommitListText(
            data.message.split("-----------------------").slice(0, 10)
          );
        }
      }
    }
    getCommitNames();
  }, [authContext.loggedIn]);

  return authContext.loggedIn ? (
    <Box className={styles.modal}>
      <h1>Commit History</h1>
      {commitListText.length > 0 ? <h2>Commits</h2> : <h2>{error}</h2>}
      <Box className={styles.branchForm}>
        <ul className={styles.commitList}>
          {commitListText.map((commit) => (
            <li key={0}>
              <h4>{commit}</h4>
            </li>
          ))}
        </ul>
      </Box>
      <Link href="/log">View all logs</Link>
      <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
    </Box>
  ) : (
    <h1>Not Logged In</h1>
  );
}

export default History;
