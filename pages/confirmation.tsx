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



function ViewConfirmation(props: { close: () => void }) {
    const authContext = useContext(AuthContext);

    const handleConfirmedClick = () => {
        props.close();
    }

    return authContext.loggedIn ? (
        <Box className={styles.modal}>
        <h1>Are you sure?</h1>
        <Button
          className={styles.regularButton}
          sx={{
            color: "error",
            borderColor: "white",
            marginTop: "2vh",
            marginBottom: "2vh",
            fontSize: "large",
            backgroundColor: "rgba(34, 34, 34, 0.438)",
          }}
          onClick={handleConfirmedClick}
        >
          Yes, delete table.
        </Button>
        <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
      </Box>
    ) : (
        <h1>Not Logged In</h1>
      );
}
export default ViewConfirmation;