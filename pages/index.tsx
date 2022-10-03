import { Container, Typography, Button } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { ConnectResult, QueryResult, UpdateResult } from "./proto/connection";
import Image from "next/image";
import logo from "../public/logo.png";
import Link from "next/link";

function Home(): JSX.Element {
  const [userid, setID] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [text, setText] = useState<string | null>("");

  /*
   * These ones were pretty straight forward to develop.
   * One thing to note is we'd want to try and server-side
   * render the page for Table Reads, since JSON is a lot
   * slower than Protobuf.
   */
  // const handleConnect = async () => {
  //   const response = await fetch("/api/connect");
  //   if (!response.ok) {
  //     setStatus("Error: " + response.statusText);
  //   } else {
  //     const data: ConnectResult = await response.json();
  //     setID(data.id);
  //     setStatus(null);
  //   }
  // };

  // const handleDisconnect = async () => {
  //   const response = await fetch("/api/disconnect", {
  //     method: "POST",
  //     body: JSON.stringify({ id: userid }),
  //   });
  //   setID(null);
  //   if (!response.ok) {
  //     setStatus("Error: " + response.statusText);
  //   } else {
  //     setStatus("Client has disconnected");
  //   }
  // };

  // // Take a string and call api/query with it.
  // const handleQuery = async () => {
  //   const response = await fetch("/api/query", {
  //     method: "POST",
  //     body: JSON.stringify({ query: text }),
  //   });
  //   setID(null);
  //   if (!response.ok) {
  //     setStatus("Error: " + response.statusText);
  //   } else {
  //     const data: QueryResult = await response.json();
  //     setStatus(JSON.stringify(data.columnNames));
  //   }
  // };

  // const handleUpdate = async () => {
  //   const response = await fetch("/api/update", {
  //     method: "POST",
  //     body: JSON.stringify({ query: text }),
  //   });
  //   setID(null);
  //   if (!response.ok) {
  //     setStatus("Error: " + response.statusText);
  //   } else {
  //     const data: UpdateResult = await response.json();
  //     setStatus(JSON.stringify(data.message));
  //   }
  // };

  // const handleVC = async () => {
  //   const response = await fetch("/api/vcs", {
  //     method: "POST",
  //     body: JSON.stringify({ query: text }),
  //   });
  //   setID(null);
  //   if (!response.ok) {
  //     setStatus("Error: " + response.statusText);
  //   } else {
  //     const data: UpdateResult = await response.json();
  //     setStatus(JSON.stringify(data.message));
  //   }
  // };

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
            <Button className={styles.button}>Continue →</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default Home;
