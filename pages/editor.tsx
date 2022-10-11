import styles from "../styles/Home.module.css";
import {
  TextareaAutosize,
  Button,
  Box,
  AppBar,
  Typography,
  Toolbar,
  Modal,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { QueryResult, UpdateResult } from "./proto/connection";
import { useRouter } from "next/router";
import Link from "next/link";
import logo from "../public/logo.png";
import Image from "next/image";
import Head from "next/head";
import NewBranch from "./branch";
import History from "./history";
import { AuthContext } from "./context";
import Commit from "./commit";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Editor() {
  const authContext = useContext(AuthContext);
  const [status, setStatus] = useState<any | null>(null);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [commitOpen, setCommitOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (window.localStorage.getItem("loggedIn") !== null) {
      authContext.login(window.localStorage.getItem("loggedIn"));
    }
  }, []);

  const setTextStatus = (
    text: string,
    com: boolean,
    error: boolean = false
  ) => {
    setStatus(
      <h1
        style={{
          color: "black",
        }}
      >
        {text}
      </h1>
    );

    if (com) {
      if (error) {
        setStatus(
          <h1
            style={{
              color: "red",
            }}
          >
            {text}
          </h1>
        );
      } else {
        setStatus(
          <h1
            style={{
              color: "cyan",
            }}
          >
            {text}
          </h1>
        );
      }
    }
  };

  const setEmptyStatus = () => {
    setStatus(null);
  };

  const handleInput = () => {
    if (text === "") {
      setTextStatus("Please enter a valid GQL command", false, true);
      return;
    }
    if (text.toLowerCase().startsWith("select")) {
      handleQuery();
    } else if (text.toLowerCase().startsWith("gql")) {
      handleVC();
    } else {
      handleUpdate();
    }
  };

  const handleQuery = async () => {
    const response = await fetch("/api/query", {
      method: "POST",
      body: JSON.stringify({ query: text, id: authContext.loggedIn }),
    });
    if (!response.ok) {
      let text = await response.text();
      setTextStatus(text, true, true);
    } else {
      // const data: QueryResult = await response.json();
      const data = await response.json();
      // Create table from data
      setStatus(
        <TableContainer
          style={{
            fontSize: "1.5rem",
            height: "50vh",
            width: "85%",
            minHeight: "20vh",
            marginTop: "2vh",
            backgroundColor: "rgba(34, 34, 34, 0.85)",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {data.column_names.map((name: string) => (
                  <TableCell align="center">
                    <b>{name}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.values.map((row: string[]) => (
                <TableRow>
                  {row.map((value: string) => (
                    <TableCell align="center">{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
      setText("");
    }
  };

  const handleDisconnect = async () => {
    if (authContext.loggedIn) {
      const response = await fetch("/api/disconnect", {
        method: "POST",
        body: JSON.stringify({ id: authContext.loggedIn }),
      });
      if (!response.ok) {
        let text = await response.text();
        setTextStatus(text, true, true);
      } else {
        setTextStatus("Client has disconnected", false);
        authContext.logout();
        router.push("/");
      }
    }
  };

  const handleBranchOpen = () => setOpen(true);
  const handleBranchClose = () => setOpen(false);
  const handleCommitOpen = () => setCommitOpen(true);
  const handleCommitClose = () => setCommitOpen(false);
  const handleHistoryOpen = () => setHistoryOpen(true);
  const handleHistoryClose = () => setHistoryOpen(false);

  const handleVC = async () => {
    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({ query: text, id: authContext.loggedIn }),
    });
    if (!response.ok) {
      let text = await response.text();
      setTextStatus(text, true, true);
    } else {
      const data: UpdateResult = await response.json();
      setTextStatus(data.message, true);
      setText("");
    }
  };

  const handleUpdate = async () => {
    const response = await fetch("/api/update", {
      method: "POST",
      body: JSON.stringify({ query: text, id: authContext.loggedIn }),
    });
    if (!response.ok) {
      let text = await response.text();
      setTextStatus(text, true, true);
    } else {
      const data: UpdateResult = await response.json();
      setTextStatus(data.message, true);
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
      <ThemeProvider theme={darkTheme}>
        <Box className={`${styles.bg} ${styles.center}`}>
          <Head>
            <title>GQL Editor</title>
          </Head>
          <Modal open={open} onClose={handleBranchClose}>
            <NewBranch close={handleBranchClose} />
          </Modal>
          <Modal open={commitOpen} onClose={handleCommitClose}>
            <Commit close={handleCommitClose} />
          </Modal>
          <Modal open={historyOpen} onClose={handleHistoryClose}>
            <History />
          </Modal>
          <AppBar
            position="fixed"
            sx={{ background: "rgba(34, 34, 34, 0.438)" }}
          >
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link href="/">GQL</Link>
              </Typography>
              <Button color="inherit" onClick={handleHistoryOpen}>
                History
              </Button>
              <Button color="inherit" onClick={handleBranchOpen}>
                New Branch
              </Button>
              <Button color="inherit" onClick={handleCommitOpen}>
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
              minHeight: "30vh",
              marginTop: "2vh",
            }}
            value={text}
            onChange={handleTextChange}
          />
          {status}
          <Box>
            <Button className={styles.button} onClick={handleInput}>
              Execute
            </Button>
            <Button className={styles.button} onClick={setEmptyStatus}>
              Clear Result
            </Button>
          </Box>
          <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
        </Box>
      </ThemeProvider>
    )
  );
}

export default Editor;
