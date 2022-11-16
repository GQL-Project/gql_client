import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { 
  TextareaAutosize,
  Button,
  Box,
  Grid,
  Card,
  Stack } from "@mui/material";
import { useState } from "react";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { QueryResult, UpdateResult } from "./proto/connection";
import { get } from "http";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import BranchDiagram from "./components/branch_diagram";
import { ReactFlowProvider } from "reactflow";

function BranchView() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const handleBack = () => {
    router.push("/editor");
  };


  return (
    authContext.loggedIn && (
      <Box className={`${styles.background}`}>
        <Head>
          <title>Branch View</title>
        </Head>
        <Button
          className={styles.button}
          sx={{
            color: "white",
            marginTop: "1vh",
            height: "10vh",
            width: "20vw",
            margin: "2vw",
            fontSize: "larger",
            backgroundColor: "rgba(34, 34, 34, 0.438)",
          }}
          onClick={handleBack}
        >{`← Back`}</Button>
        <div style={{height: "60vh", width: "100%", borderStyle: "solid", borderColor: "black", borderWidth: "1px"}}>
            <BranchDiagram></BranchDiagram>
        </div>
        
        <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
        <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
      </Box>
    )
  );
}

export default BranchView;
