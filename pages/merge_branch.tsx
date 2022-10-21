import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { TextareaAutosize, Button, Box, Grid, Select, SelectChangeEvent, Input, MenuItem } from "@mui/material";
import { useState } from "react";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { QueryResult, UpdateResult } from "./proto/connection";
import { get } from "http";
import { resourceUsage } from "process";

function MergeBranch(props: { close: () => void }) {
  const authContext = useContext(AuthContext);
  const [cmtMsg, setCmtMsg] = useState("");
  const [srcBranch, setSrcBranch] = useState("");
  const [destBranch, setDestBranch] = useState("");
  const [branchListText, setBranchListText] = useState<string[]>([]);
  const [error, setError] = useState("");
  
  const handleSrcBranchChange = (event: SelectChangeEvent) => {
    setSrcBranch(event.target.value);
  };

  const handleDestBranchChange = (event: SelectChangeEvent) => {
    setDestBranch(event.target.value);
  };

  const handleCmtMsgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCmtMsg(event.target.value);
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

  const handleMergingBranches = async () => {
    setError("");

    if (branchListText.includes(srcBranch) == false || branchListText.includes(destBranch) == false) {
        handleErrorChange("Could not merge branches: Must select source and destination branches");
        return;
    }

    if (cmtMsg === "") {
        handleErrorChange("Please enter a commit message");
        return;
    }

    let positionalArgs = srcBranch + " " + destBranch + " " + cmtMsg + " ";

    let merge_query = "gql merge_branch " + positionalArgs;
    
    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({
        query: merge_query.trim(),
        id: authContext.loggedIn,
      }),
    });
    if (response.ok) {
      const data: UpdateResult = await response.json();
    }
    if (response.statusText === "OK") {
      props.close();
    } else {
      const errMsg = await response.json();
      handleErrorChange("Could not merge branches: " + errMsg.message);
    }
  };

  return authContext.loggedIn ? (
    <Box className={styles.modal}>
      <h1>Merge Branches</h1>

      
      <form>
          <div>
              <label className={styles.mergeBranchesLabel}>Source Branch: </label>

              <Select
                  defaultValue=""
                  onChange={handleSrcBranchChange}
                  >
                  {branchListText.map((branch) => (
                      <MenuItem value={branch}>{branch}</MenuItem>
                  ))}
              </Select>
          </div>

          <div>
              <label className={styles.mergeBranchesLabel}>Destination Branch: </label>

              <Select
                  defaultValue=""
                  onChange={handleDestBranchChange}
                  >
                  {branchListText.map((branch) => (
                      <MenuItem value={branch}>{branch}</MenuItem>
                  ))}
              </Select>
          </div>

          <div>
              <label className={styles.mergeBranchesLabel}>Merge Commit Message: </label>

              <Input
                  placeholder={'Merge Commit Message...'}
                  onChange={handleCmtMsgChange}
                  />
          </div>
      </form>

      <p className={styles.createTableErrorText}>{error}</p>

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
        onClick={handleMergingBranches}
      >
        Merge Branches
      </Button>
      <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
    </Box>
  ) : (
    <h1>Not Logged In</h1>
  );
}

export default MergeBranch;
