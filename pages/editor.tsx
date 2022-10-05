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
import { useContext, useState } from "react";
import { QueryResult, UpdateResult } from "./proto/connection";
import { useRouter } from "next/router";
import Link from "next/link";
import logo from "../public/logo.png";
import Image from "next/image";
import Head from "next/head";
import NewBranch from "./branch";
import { AuthContext } from "./context";

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

  const router = useRouter();

  const setTextStatus = (text: string) => {
    setStatus(<h1>{text}</h1>);
  };

  const setEmptyStatus = () => {
    setStatus(null);
  };

  const handleQuery = async () => {
    console.log(authContext.loggedIn);
    if (text === "") {
      setTextStatus("Please enter a select query");
      return;
    }

    const response = await fetch("/api/query", {
      method: "POST",
      body: JSON.stringify({ query: text, id: authContext.loggedIn }),
    });
    if (!response.ok) {
      setTextStatus("Error: " + response.statusText);
    } else {
      // const data: QueryResult = await response.json();
      const data = await response.json();
      // Create table from data
      setStatus(
        <TableContainer style={{
          fontSize: "1.5rem",
          height: "50vh",
          width: "85%",
          minHeight: "30vh",
          marginTop: "2vh",
          backgroundColor: 'rgba(34, 34, 34, 0.85)',
        }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {data.column_names.map((name: string) => (
                  <TableCell align="center"><b>{name}</b></TableCell>
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
    console.log(authContext.loggedIn);
    if (authContext.loggedIn) {
      const response = await fetch("/api/disconnect", {
        method: "POST",
        body: JSON.stringify({ id: authContext.loggedIn }),
      });
      if (!response.ok) {
        setTextStatus("Error: " + response.statusText);
      } else {
        setTextStatus("Client has disconnected");
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
      setTextStatus("Please enter a VC Command");
      return;
    }
    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({ query: text, id: authContext.loggedIn }),
    });
    if (!response.ok) {
      setTextStatus("Error: " + response.statusText);
    } else {
      const data: UpdateResult = await response.json();
      setTextStatus(data.message);
    }
  };

  const handleUpdate = async () => {
    console.log(authContext.loggedIn);
    if (text === "") {
      setTextStatus("Please enter a create/insert query");
      return;
    }
    const response = await fetch("/api/update", {
      method: "POST",
      body: JSON.stringify({ query: text, id: authContext.loggedIn }),
    });
    if (!response.ok) {
      setTextStatus("Error: " + response.statusText);
    } else {
      const data: UpdateResult = await response.json();
      setTextStatus(data.message);
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
    authContext.loggedIn && (<ThemeProvider theme={darkTheme}>
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
            minHeight: "30vh",
            marginTop: "2vh",
          }}
          value={text}
          onChange={handleTextChange}
        />
        {status}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            columnGap: "1vw",
          }}
        >
          <Button className={styles.button} onClick={handleQuery}>
            Execute
          </Button>
          <Button className={styles.button} onClick={handleUpdate}>
            Update
          </Button>
          <Button className={styles.button} onClick={handleVC}>
            Version Control
          </Button>
        </div>
        <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
      </Box>
    </ThemeProvider>)
  );
}

export default Editor;
