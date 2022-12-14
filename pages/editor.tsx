import styles from "../styles/Home.module.css";
import {
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
  Menu,
  MenuItem,
  Fade,
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
import CreateTable from "./create_table";
import Prism from "prismjs";
import { AuthContext } from "./context";
import Commit from "./commit";
import Editor from "react-simple-code-editor";
import "prismjs/themes/prism-twilight.css";
import { highlight } from "prismjs";
import saveAs from "file-saver";
import { Cookies } from "next/dist/server/web/spec-extension/cookies";
import MergeBranch from "./merge_branch";
import SwitchBranch from "./switch_branch";
import Revert from "./revert";
import ViewTable from "./view_table";
import BranchView from "./branch_view";

require("prismjs/components/prism-sql");

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function QueryEditor() {
  const authContext = useContext(AuthContext);
  const [status, setStatus] = useState(
    <Image src={logo} alt="GQL Logo" height={350} objectFit="contain" />
  );
  const [text, setText] = useState("");
  const [currentBranchName, setCurrentBranchName] = useState("");
  const [queryDuration, setQueryDuration] = useState("");
  const [open, setOpen] = useState(false);
  const [mergeBranchOpen, setMergeBranchOpen] = useState(false);
  const [switchBranchOpen, setSwitchBranchOpen] = useState(false);
  const [commitOpen, setCommitOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [viewTableOpen, setViewTableOpen] = useState(false);
  const [createTableOpen, setCreateTableOpen] = useState(false);
  const router = useRouter();
  //VCS Drop-down menu variables
  const [anchorElVCS, setAnchorElVCS] = useState<null | HTMLElement>(null);
  const openVCSMenu = Boolean(anchorElVCS);

  //Table Drop-down menu variables
  const [anchorElTable, setAnchorElTable] = useState<null | HTMLElement>(null);
  const openTableMenu = Boolean(anchorElTable);

  //Save Button Query Array
  // var query_array: string[] = [];
  const [queryArray, setQueryArray] = useState<string[]>([]);

  //Revert Window
  const [revertOpen, setRevertOpen] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("loggedIn") !== null) {
      authContext.login(window.localStorage.getItem("loggedIn"));
      refreshCurrentBranch();
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

  //Drop-down menu functions
  //VCS
  const handleVCSDropDownClose = () => {
    setAnchorElVCS(null);
  };

  const handleVCSDropDownClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElVCS(event.currentTarget);
  };

  //Table
  const handleTableDropDownClose = () => {
    setAnchorElTable(null);
  };

  const handleTableDropDownClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTable(event.currentTarget);
  };

  //End Drop-down menu functions

  // Refreshes the current branch that the user is on
  async function refreshCurrentBranch() {
    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({
        query: "gql list --current",
        id: authContext.loggedIn,
      }),
    });
    if (!response.ok) {
      setTextStatus("Could not retrieve current branch name", true, true);
    }
    const data: UpdateResult = await response.json();
    if (data.message !== "") {
      setCurrentBranchName(data.message);
    }
  }

  const setEmptyStatus = () => {
    setStatus(
      <Image src={logo} alt="GQL Logo" height={350} objectFit="contain" />
    );
  };

  const handleInput = () => {
    if (text === "") {
      setTextStatus("Please enter a valid GQL command", false, true);
      return;
    }
    if (text.toLowerCase().startsWith("select")) {
      //Adding the query to the current session's array
      const previousState = queryArray;
      previousState.push(text);
      setQueryArray(previousState);
      //Processing Query
      handleQuery();
    } else if (text.toLowerCase().startsWith("gql")) {
      handleVC();
    } else {
      const previousState = queryArray;
      previousState.push(text);
      setQueryArray(previousState);
      handleUpdate();
    }
  };

  const handleQuery = async () => {
    setQueryDuration("Running...");
    const response = await fetch("/api/query", {
      method: "POST",
      body: JSON.stringify({ query: text, id: authContext.loggedIn }),
    });
    if (!response.ok) {
      setQueryDuration("");
      let text = await response.text();
      setTextStatus(text, true, true);
    } else {
      // const data: QueryResult = await response.json();
      const data = await response.json();

      setQueryDuration("Query Duration: " + data.time_taken + "s");

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
                  <TableCell key={0} align="center">
                    <b>{name}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.values.map((row: string[]) => (
                <TableRow key={0}>
                  {row.map((value: string) => (
                    <TableCell key={0} align="center">
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
      setText("");

      // Refresh current branch
      refreshCurrentBranch();
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
        window.localStorage.removeItem("loggedIn");
        router.push("/");
      }
    }
  };

  const handleBranchOpen = () => setOpen(true);
  const handleBranchClose = () => {
    setOpen(false);
    refreshCurrentBranch();
  };
  const handleMergeBranchOpen = () => setMergeBranchOpen(true);
  const handleMergeBranchClose = () => {
    setMergeBranchOpen(false);
    refreshCurrentBranch();
  };
  const handleSwitchBranchOpen = () => setSwitchBranchOpen(true);
  const handleSwitchBranchClose = () => {
    setSwitchBranchOpen(false);
    refreshCurrentBranch();
  };
  const handleCommitOpen = () => setCommitOpen(true);
  const handleCommitClose = () => setCommitOpen(false);
  const handleHistoryOpen = () => setHistoryOpen(true);
  const handleHistoryClose = () => setHistoryOpen(false);
  const handleViewTableOpen = () => setViewTableOpen(true);
  const handleViewTableClose = () => setViewTableOpen(false);
  const handleCreateTableOpen = () => setCreateTableOpen(true);
  const handleCreateTableClose = () => setCreateTableOpen(false);
  const handleRevertOpen = () => setRevertOpen(true);
  const handleRevertClose = () => setRevertOpen(false);

  const handleBranchViewClick = () => {
    router.push("/branch_view");
  };

  // Discard button functionality
  const handleDiscardClick = async () => {
    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({
        query: "gql discard",
        id: authContext.loggedIn,
      }),
    });
    if (!response.ok) {
      setTextStatus("Failed to Discard!", true, true);
    } else {
      const data: UpdateResult = await response.json();
    }
    if (response.statusText === "OK") {
      setText("");
    } else {
      setTextStatus("Failed to Discard!", true, true);
    }
  };

  //Pull Button functionality
  const handlePullClick = async () => {
    const response = await fetch("/api/vcs", {
      method: "POST",
      body: JSON.stringify({

        query: "gql pull",
        id: authContext.loggedIn,
      }),
    });
    if (!response.ok) {
      setTextStatus("Failed to Pull!", true, true);
    }
    else {
      const data: UpdateResult = await response.json();
    }
    if (response.statusText === "OK") {
      setText("");
    } else {
      setTextStatus("Failed to Pull!", true, true);    
    }
  };

  //Save Queries Functionality
  const handleSaveQueries = () => {
    //Checking if there have been any queries
    if (queryArray.length === 0) {
      setTextStatus("No queries have been run so far", true, true);
      return;
    }

    //Saving the file
    //queryArray.join() turns the Array into a single string with \n as the
    // delimiting token into the teext file GQL_Queries.txt
    var blob = new Blob([queryArray.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "GQL_Queries.txt");
  };

  //Load Queries Functionality
  const handleLoadQueries = () => {
    var openDoc = document.createElement("input");
    openDoc.type = "file";

    openDoc.onchange = (e) => {
      // Grabbing the file reference
      const result = (e.target as HTMLInputElement).files;
      if (result === null) {
        setTextStatus("No file selected", true, true);
        return;
      }
      var file = result[0];
      // Creating the reader
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      // Error checking the file
      var extensionCheck = file.name.endsWith(".txt");
      if (!extensionCheck) {
        setTextStatus(
          "Invalid file type! Only files that end with '.txt' are accepted.",
          true,
          true
        );
        return;
      }

      // Code to execute once the reader has loaded and read the file
      reader.onload = (readerEvent) => {
        var fileContent = readerEvent?.target?.result; // Contents of user's chosen file
        console.log(fileContent);
        //setTextStatus(data.message, true);
        if ((fileContent = "")) {
          setTextStatus("File is empty", true, true);
        } else {
          setText(fileContent?.toString());
        }
      };
    };
    openDoc.click();
  };

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
    setQueryDuration("Running...")
    const response = await fetch("/api/update", {
      method: "POST",
      body: JSON.stringify({ query: text, id: authContext.loggedIn }),
    });
    if (!response.ok) {
      setQueryDuration("");
      let text = await response.text();
      setTextStatus(text, true, true);
    } else {
      const data: UpdateResult = await response.json();

      setQueryDuration("Query Duration: " + data.timeTaken + "s");

      setTextStatus(data.message, true);
      setText("");
    }
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
          <Modal open={mergeBranchOpen} onClose={handleMergeBranchClose}>
            <MergeBranch close={handleMergeBranchClose} />
          </Modal>
          <Modal open={switchBranchOpen} onClose={handleSwitchBranchClose}>
            <SwitchBranch close={handleSwitchBranchClose} />
          </Modal>
          <Modal open={commitOpen} onClose={handleCommitClose}>
            <Commit close={handleCommitClose} />
          </Modal>
          <Modal open={historyOpen} onClose={handleHistoryClose}>
            <History />
          </Modal>
          <Modal open={viewTableOpen} onClose={handleViewTableClose}>
            <ViewTable />
          </Modal>
          <Modal open={createTableOpen} onClose={handleCreateTableClose}>
            <CreateTable close={handleCreateTableClose} />
          </Modal>
          <Modal open={revertOpen} onClose={handleRevertClose}>
            <Revert close={handleRevertClose} />
          </Modal>
          <AppBar
            position="fixed"
            sx={{ background: "rgba(34, 34, 34, 0.438)" }}
          >
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link href="/">GQL</Link>
              </Typography>
              <div>
                <Button
                  id="fade-button"
                  aria-controls={openVCSMenu ? "fade-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openVCSMenu ? "true" : undefined}
                  onClick={handleVCSDropDownClick}
                >
                  VCS Commands
                </Button>
                <Menu
                  id="fade-menu"
                  MenuListProps={{
                    "aria-labelledby": "fade-button",
                  }}
                  anchorEl={anchorElVCS}
                  open={openVCSMenu}
                  onClose={handleVCSDropDownClose}
                  TransitionComponent={Fade}
                >
                  <MenuItem onClick={handleHistoryOpen}>History</MenuItem>
                  <MenuItem onClick={handleViewTableOpen}>View Table</MenuItem>
                  <MenuItem onClick={handleBranchOpen}>Create Branch</MenuItem>
                  <MenuItem onClick={handleSwitchBranchOpen}>
                    Switch Branch
                  </MenuItem>
                  <MenuItem onClick={handleMergeBranchOpen}>
                    Merge Branches
                  </MenuItem>
                  <MenuItem onClick={handleCommitOpen}>Create Commit</MenuItem>
                  <MenuItem onClick={handleRevertOpen}>Revert</MenuItem>
                  <MenuItem
                    title="Discard all uncommitted changes"
                    onClick={handleDiscardClick}
                  >
                    Discard
                  </MenuItem>
                  <MenuItem 
                    title="Retrieve any new changes made to the database made by other users" 
                    onClick={handlePullClick}>
                      Pull
                      </MenuItem>
                  <MenuItem onClick={handleBranchViewClick}>Branch View</MenuItem>
                </Menu>
              </div>
              <div>
                <Button
                  id="fade-button"
                  aria-controls={openTableMenu ? "fade-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openTableMenu ? "true" : undefined}
                  onClick={handleTableDropDownClick}
                >
                  Table Commands
                </Button>
                <Menu
                  id="fade-menu"
                  MenuListProps={{
                    "aria-labelledby": "fade-button",
                  }}
                  anchorEl={anchorElTable}
                  open={openTableMenu}
                  onClose={handleTableDropDownClose}
                  TransitionComponent={Fade}
                >
                  <MenuItem onClick={handleCreateTableOpen}>
                    Create Table
                  </MenuItem>
                  <MenuItem
                    title="Save the current queries as a file to your computer..."
                    onClick={handleSaveQueries}
                  >
                    Save Queries
                  </MenuItem>
                  <MenuItem
                    title="Load queries from a file on your computer..."
                    onClick={handleLoadQueries}
                  >
                    Load Queries
                  </MenuItem>
                </Menu>
              </div>
              <Button color="inherit" onClick={handleDisconnect}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>
          <Toolbar />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Box>
              <Box
                sx={{
                  height: "50vh",
                  width: "50vw",
                  marginTop: "2vh",
                  overflowY: "auto",
                }}
              >
                <Editor
                  highlight={(text) =>
                    highlight(text, Prism.languages.sql, "sql")
                  }
                  aria-label="empty textarea"
                  placeholder="Enter your SQL query here"
                  className={styles.editor}
                  value={text}
                  padding={10}
                  onValueChange={(text) => setText(text)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      handleInput();
                    }
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row"
                }}>
                <div className={styles.queryDurationText}>
                  {queryDuration}
                </div>
                <div className={styles.currentBranchText}>
                  Current Branch: {currentBranchName}
                </div>
              </Box>
            </Box>
            <Box className={styles.commandOutput}>{status}</Box>
          </Box>
          <Box>
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
              onClick={handleInput}
            >
              Execute
            </Button>
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
              onClick={setEmptyStatus}
            >
              Clear Result
            </Button>
          </Box>
          <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
        </Box>
      </ThemeProvider>
    )
  );
}

export default QueryEditor;
