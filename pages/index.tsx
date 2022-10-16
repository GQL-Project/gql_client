import { Container, Typography, Button } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { ConnectResult, QueryResult, UpdateResult } from "./proto/connection";
import Image from "next/image";
import logo from "../public/logo.png";
import Link from "next/link";

function Home(): JSX.Element {
  /*
   * These ones were pretty straight forward to develop.
   * One thing to note is we'd want to try and server-side
   * render the page for Table Reads, since JSON is a lot
   * slower than Protobuf.
   */

  return (
    <div className={styles.bg}>
      <Head>
        <title>GQL</title>
        <link rel="shortcut icon" href="/favico.ico" />
      </Head>
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Image src={logo} alt="GQL Logo" height={300} objectFit="contain" />
          <h5 className={styles.title}>A version control system for SQL</h5>
          <Link href="/login">
            <Button
              className={styles.button}
              sx={{
                color: "white",
                marginTop: "2vh",
                height: "10vh",
                width: "20vw",
                margin: "2vw",
                fontSize: "larger",
                backgroundColor: "rgba(34, 34, 34, 0.438)",
              }}
            >
              Continue →
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default Home;
