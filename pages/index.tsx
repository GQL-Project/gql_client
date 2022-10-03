import { Container, Typography, Button } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { ConnectResult, QueryResult, UpdateResult } from "./proto/connection";
import Image from "next/image";
import logo from "../assets/logo.png";
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
  const handleConnect = async () => {
    const response = await fetch("/api/connect");
    if (!response.ok) {
      setStatus("Error: " + response.statusText);
    } else {
      const data: ConnectResult = await response.json();
      setID(data.id);
      setStatus(null);
    }
  };

  const handleDisconnect = async () => {
    const response = await fetch("/api/disconnect", {
      method: "POST",
      body: JSON.stringify({ id: userid }),
    });
    setID(null);
    if (!response.ok) {
      setStatus("Error: " + response.statusText);
    } else {
      setStatus("Client has disconnected");
    }
  };

  // Take a string and call api/query with it.
  const handleQuery = async () => {
    const response = await fetch("/api/query", {
      method: "POST",
      body: JSON.stringify({ query: text }),
    });
    setID(null);
    if (!response.ok) {
      setStatus("Error: " + response.statusText);
    } else {
      const data: QueryResult = await response.json();
      setStatus(JSON.stringify(data.columnNames));
    }
  };

  const handleUpdate = async () => {
    const response = await fetch("/api/update", {
      method: "POST",
      body: JSON.stringify({ query: text }),
    });
    setID(null);
    if (!response.ok) {
      setStatus("Error: " + response.statusText);
    } else {
      const data: UpdateResult = await response.json();
      setStatus(JSON.stringify(data.message));
    }
  };

  const handleVC = async () => {
    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({ query: text }),
    });
    setID(null);
    if (!response.ok) {
      setStatus("Error: " + response.statusText);
    } else {
      const data: UpdateResult = await response.json();
      setStatus(JSON.stringify(data.message));
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  var title = "Welcome to GQL Database";
  if (userid) {
    title = "Connected with: " + userid;
  }
  if (status) {
    title = status;
  }

  return (
    // <div className={styles.container}>
    //   <Head>
    //     <title>GQL Database Server</title>
    //     <link rel="icon" href="favicon.ico" />
    //   </Head>

    //   <main className={styles.main}>
    //     <h1 className={styles.title}>
    //       <a>{title}</a>
    //     </h1>
    //     <Typography>Hi</Typography>
    //     <div className={styles.grid}>
    //       <a className={styles.card} onClick={handleConnect}>
    //         <h2>Connect DB &rarr;</h2>
    //         <p>Connect to the Database</p>
    //       </a>
    //       <a className={styles.card} onClick={handleDisconnect}>
    //         <h2>Disconnect DB &rarr;</h2>
    //         <p>Disconnect from Database</p>
    //       </a>
    //     </div>
    //     <div className={styles.grid}>
    //       <textarea onChange={handleTextChange} />
    //     </div>
    //     <div className={styles.grid}>
    //       <a className={styles.card} onClick={handleQuery}>
    //         <h2>Query DB &rarr;</h2>
    //         <p>Query the Database</p>
    //       </a>
    //       <a className={styles.card} onClick={handleUpdate}>
    //         <h2>Update DB &rarr;</h2>
    //         <p>Query the Database</p>
    //       </a>
    //       <a className={styles.card} onClick={handleVC}>
    //         <h2>Version Control &rarr;</h2>
    //         <p>Run VC Ops</p>
    //       </a>
    //     </div>
    //   </main>
    // </div>
    <div className={styles.bg}>
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
          <Typography variant="h5" align="center">
            A version control system for SQL
          </Typography>
          <Button className={styles.button}>
            <Link href="/login">Continue →</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Home;
