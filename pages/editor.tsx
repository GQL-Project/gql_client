import styles from "../styles/Home.module.css";
import {
  TextareaAutosize,
  Button,
  Box,
  AppBar,
  Typography,
  Toolbar,
  Modal,
} from "@mui/material";
import { useContext, useState } from "react";
import { QueryResult, UpdateResult } from "./proto/connection";
import { useRouter } from "next/router";
import Link from "next/link";
import logo from "../public/logo.png";
import Image from "next/image";
import Head from "next/head";
import NewBranch from "./branch";
import { AuthContext } from "./context";

function rowVals(data: any) {
  let all_row_vals = "";
  for (var i = 0; i < data.row_values.length; i++) {
    let row_vals = [];
    let row = data.row_values[i];
    for (var j = 0; j < row.cell_values.length; j++) {
      let cell_type = row.cell_values[j].cell_type;
      let cell_val = row.cell_values[j][cell_type];
      row_vals.push(cell_val);
    }
    all_row_vals += "(" + row_vals.join(", ") + ")\n";
  }
  return all_row_vals;
}

function Editor() {
  const authContext = useContext(AuthContext);
  const [status, setStatus] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handleQuery = async () => {
    console.log(authContext.loggedIn);
    if (text === "") {
      setStatus("Please enter a select query");
      return;
    }

    const response = await fetch("/api/query", {
      method: "POST",
      body: JSON.stringify({ query: text, id: authContext.loggedIn }),
    });
    if (!response.ok) {
      setStatus("Error: " + response.statusText);
    } else {
      // const data: QueryResult = await response.json();
      const data = await response.json();
      setStatus(data.column_names.join(", ") + "\n" + rowVals(data));
      setText("");
    }
  };

  const handleDisconnect = async () => {
    console.log(authContext.loggedIn);
    if (authContext.loggedIn) {
      const response = await fetch("/api/disconnect", {
        method: "POST",
        body: JSON.stringify({ id: authContext.loggedIn }),
      });
      if (!response.ok) {
        setStatus("Error: " + response.statusText);
      } else {
        setStatus("Client has disconnected");
        authContext.logout();
        router.push("/");
      }
    }
  };

  const handleBranchOpen = () => setOpen(true);
  const handleBranchClose = () => setOpen(false);
  const handleVC = async () => {
    console.log(authContext.loggedIn);
    if (text === "") {
      setStatus("Please enter a VC Command");
      return;
    }
    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({ query: text, id: authContext.loggedIn }),
    });
    if (!response.ok) {
      setStatus("Error: " + response.statusText);
    } else {
      const data: UpdateResult = await response.json();
      setStatus(JSON.stringify(data.message));
    }
  };

  const handleUpdate = async () => {
    console.log(authContext.loggedIn);
    if (text === "") {
      setStatus("Please enter a create/insert query");
      return;
    }
    const response = await fetch("/api/update", {
      method: "POST",
      body: JSON.stringify({ query: text, id: authContext.loggedIn }),
    });
    if (!response.ok) {
      setStatus("Error: " + response.statusText);
    } else {
      const data: UpdateResult = await response.json();
      setStatus(JSON.stringify(data.message));
      setText("");
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleCommit = () => {
    router.push("/commit");
  };

  return (
    authContext.loggedIn && (
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
          <title>GQL Editor</title>
        </Head>
        <Modal
          open={open}
          onClose={handleBranchClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <NewBranch />
        </Modal>
        <AppBar position="fixed" sx={{ background: "rgba(34, 34, 34, 0.438)" }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link href="/">GQL</Link>
            </Typography>
            <Button color="inherit" onClick={handleBranchOpen}>
              New Branch
            </Button>
            <Button color="inherit" onClick={handleCommit}>
              Commit
            </Button>
            <Button color="inherit" onClick={handleDisconnect}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <TextareaAutosize
          aria-label="empty textarea"
          placeholder="Enter your SQL query here"
          style={{
            fontSize: "1.5rem",
            height: "50vh",
            width: "50vw",
            marginTop: "2vh",
          }}
          value={text}
          onChange={handleTextChange}
        />
        <h1>{status}</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            columnGap: "1vw",
          }}
        >
          <Button className={styles.loginButton} onClick={handleQuery}>
            Execute
          </Button>
          <Button className={styles.loginButton} onClick={handleUpdate}>
            Update
          </Button>
          <Button className={styles.loginButton} onClick={handleVC}>
            Version Control
          </Button>
        </div>
        <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
      </Box>
    )
  );
}

export default Editor;
