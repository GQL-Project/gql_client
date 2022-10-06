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

function NewBranch(props) {
  const authContext = useContext(AuthContext);
  console.log(authContext.loggedIn);
  const [text, setText] = useState("");
  const [branchListText, setBranchListText] = useState([]);
  const [constructorHasRun, setConstructorHasRun] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleErrorChange = () => {
    setError("Error Creating Branch!");
  }

  // Create a constructor that only runs once to get the list of branches
  const constructor = () => {
    if (constructorHasRun) return;
    setConstructorHasRun(true);

    // Log the current branch names
    fetch("/api/vcs", {
        method: "POST",
        body: JSON.stringify({ query:"gql branch -l", id: authContext.loggedIn }),
    }).then(
        (branch_list_response) => {
            // If failed to get branch list
            if (!branch_list_response.ok || branch_list_response.statusText !== "OK") {
                console.log("Receiving error with code");
                setBranchListText([]);
                handleErrorChange();
            }
            // If we succeeded
            else {
                branch_list_response.json().then((json_data) => {
                    const data: UpdateResult = json_data;
                    let branch_names = data.message.split(",");
                    const listItems = branch_names.map((branch_name) => <li>{branch_name}</li>);
                    setBranchListText(listItems);
                    console.log("Branches: " + data.message);
                });
            }
        });
  };
  constructor();

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
    console.log("Response status: " + response.statusText);
    if (!response.ok) {
    } else {
      const data: UpdateResult = await response.json();
    }
    if (response.statusText === "OK") {
      console.log("Branch created, moving back to main page");
      props.close();
      
    } else {
      console.log("Receiving error with code");
      setText("");
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
      <br></br>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          columnGap: "1vw",
        }}
      >
        Existing Branches:
      </div>
      <div
      >
        <ul 
            style={{
                columns: 2,
                listStyle: "none",
            }}
        >{branchListText}</ul>
      </div>
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
