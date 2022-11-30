import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { TextareaAutosize, Button, Box, Grid, Checkbox, Card, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { QueryResult, UpdateResult } from "./proto/connection";

function NewBranch(props: { close: () => void }) {
  const authContext = useContext(AuthContext);
  const [text, setText] = useState("");
  const [branchListText, setBranchListText] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [useCommit, setUseCommit] = useState(false);
  const [logList, setLogList] = useState([]);
  const [commit, setCommit] = useState("");

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
          query: "gql list",
          id: authContext.loggedIn,
        }),
      });
      if (!response.ok) {
        setBranchListText([]);
        handleErrorChange();
      }
      const data: UpdateResult = await response.json();
      if (data.message !== "") {
        let splitMsg = data.message.split("\n");
        splitMsg = splitMsg.slice(0, -1);
        for (let i = 0; i < splitMsg.length; i++) {
          splitMsg[i] = splitMsg[i].trim().replace("*", "");
        }
        setBranchListText(splitMsg);
      }
    }
    getBranchNames();
  }, [authContext.loggedIn]);

  useEffect(() => {
    const handleLoadCommits = async () => {
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
              hash: log.hash,
            };
            return newLog;
          });
          setLogList(logs);
          console.log(logs);
        }
      }
    };
    handleLoadCommits();
  }, [useCommit]);

  const handleCreateNewBranch = async () => {
    if (text === "") {
      setError("Please enter a branch name");
      return;
    }
    var query = "gql branch " + text;
    if (useCommit) {
      query += " -c " + commit;
    }
    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({
        query: query,
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
      <div>
        <label className={styles.mergeBranchesLabel}>Branch from Commit: </label>
        <Checkbox
          checked={useCommit}
          onChange={() => setUseCommit(!useCommit)}
        />
      </div>
      {
        useCommit && (
          (logList.length == 0 && (
            <p>No Commits to Branch From</p>
          )) ||

          <Select
            labelId="select-commit"
            label="Commit"
            value={commit}
            onChange={(event) => setCommit(event.target.value)}
          >
            {logList.map((log: any) => {
              return (
                <MenuItem
                  value={log.hash}
                >
                  {log.message + " - " + log.hash}
                </MenuItem>
              );
            })
            }
          </Select>
        )
      }
      {branchListText.length > 0 && <h2>Existing Branches</h2>}
      <br />
      <Box className={styles.branchForm}>
        <ul className={styles.branchList}>
          {branchListText.map((branch) => (
            <li key={0}>
              <h4>{branch}</h4>
            </li>
          ))}
        </ul>
      </Box>
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
        onClick={handleCreateNewBranch}
      >
        Create
      </Button>
      <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
    </Box>
  ) : (
    <h1>Not Logged In</h1>
  );
}

export default NewBranch;
