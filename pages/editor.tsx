import styles from "../styles/Home.module.css";
import {
  TextareaAutosize,
  Button,
  Box,
  AppBar,
  Typography,
  Toolbar,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { QueryResult, UpdateResult } from "./proto/connection";
import { useRouter } from "next/router";

function Editor() {
  const [userid, setID] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [text, setText] = useState<string | null>("");
  const router = useRouter();

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
      setText("");
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
      router.push("/");
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

  const handleCommit = () => {
    router.push("/commit");
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
      <AppBar position="fixed" sx={{ background: "rgba(34, 34, 34, 0.438)" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GQL
          </Typography>
          <Button color="inherit" onClick={handleDisconnect}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <TextareaAutosize
        aria-label="empty textarea"
        placeholder="Enter your SQL query here"
        style={{ fontSize: "1.5rem", height: "50vh", width: "50vw" }}
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
        <Button className={styles.loginButton} onClick={handleQuery}>
          Execute
        </Button>
        <Button className={styles.loginButton} onClick={handleCommit}>
          Commit
        </Button>
      </div>
    </Box>
  );
}

export default Editor;
