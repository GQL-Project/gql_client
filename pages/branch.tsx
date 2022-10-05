import Head from "next/head";
import React from 'react'
import styles from "../styles/Home.module.css";
import {
  TextareaAutosize,
  Button,
  Box,
  AppBar,
  Typography,
  Toolbar,
} from "@mui/material";
import { useState } from "react";
import { QueryResult, UpdateResult } from "./proto/connection";
import { useRouter } from "next/router";
import Link from "next/link";
import logo from "../public/logo.png";
import Image from "next/image";


function NewBranch() {
    const [text, setText] = useState("");
    const router = useRouter();

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleClose = async () => {
        router.push("/editor");
      };
      const handleCreateNewBranch = async () => {
        //TODO, how do I connect this to the backend?
        router.push("/editor");
      };

    return (
        <Box
        className={styles.bg}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Head>
          <title>Create New Branch</title>
        </Head>
        <TextareaAutosize
          aria-label="empty textarea"
          placeholder="Enter name of the new branch"
          style={{
            fontSize: "1.5rem",
            height: "4vh",
            width: "50vw",
            marginTop: "2vh",
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
        <Button className={styles.regularButton} onClick={handleCreateNewBranch}>
          Create New Branch
        </Button>
        <Button className={styles.regularButton} onClick={handleClose}>
          Close
        </Button>
        </div>
        <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
      </Box>
  
    );
  }
  
  export default NewBranch;