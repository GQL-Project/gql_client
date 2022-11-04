import React, { useEffect, useState } from "react";
import {
    TextareaAutosize,
    Button,
    Box,
    Grid,
    Card,
    Stack,
    TableContainer,
    Table,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@mui/material";
import styles from "../styles/Home.module.css";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { UpdateResult } from "./proto/connection";
import { useRouter } from "next/router";
import Head from "next/head";

function ViewTable() {
    const authContext = useContext(AuthContext);
    const [tableList, setTableList] = useState({});
    const [error, setError] = useState("No Tables");
    const [empty, setEmpty] = useState(false);

    function groupArrayOfObjects(list, key) {
        return list.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    const router = useRouter();
    const handleBack = () => {
        router.push("/editor");
    };

    useEffect(() => {
        if (window.localStorage.getItem("loggedIn") !== null) {
            authContext.login(window.localStorage.getItem("loggedIn"));
        }
    }, []);

    useEffect(() => {
        async function getTables() {
            const response = await fetch("/api/vcs", {
                method: "POST",
                body: JSON.stringify({
                    query: "gql table -j",
                    id: authContext.loggedIn,
                }),
            });
            if (!response.ok) {
                setTableList([]);
                setError("Error Retrieving Table!");
            }
            const data: UpdateResult = await response.json();
            if (data.message !== "") {
                const schemas: [] = JSON.parse(data.message).map((schema) => {
                    const newSchema = {
                        table_name: schema.table_name,
                        table_schema: schema.table_schema,
                        schema_type: schema.schema_type,
                    };
                    return newSchema;
                });
                if (schemas == null) {

                }
                setTableList(groupArrayOfObjects(schemas, "table_name"));
                setEmpty(false);
            }
            else {
                setEmpty(true);
            }
        }
        getTables();
    }, [authContext.loggedIn]);
    return (
        empty ?
            <Box className={`${styles.modal}`}>
                <Box className={styles.center}>
                    <h1>No Tables in this branch!</h1>
                </Box>
                <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
            </Box> :
            (
                authContext.loggedIn && (
                    <Box className={`${styles.modal}`}>
                        <Head>
                            <title>GQL Editor</title>
                        </Head>
                        <Box className={styles.center}>
                            <h1>Database Tables</h1>
                        </Box>
                        <Stack className={styles.center}>
                            {Object.keys(tableList).map((key) => {
                                return (
                                    <Card
                                        key={key}
                                        sx={{
                                            width: "60vw",
                                            backgroundColor: "#1e1e1e",
                                            boxShadow: 1,
                                            p: 1.5,
                                            m: 1,
                                        }}
                                    >
                                        <h2>{key}</h2>
                                        {tableList[key].map((table) => {
                                            return (
                                                <Grid key={table.hash} container spacing={2}>
                                                    <Grid item xs={12} sm container>
                                                        <TableContainer
                                                            style={{
                                                                fontSize: "1.5rem",
                                                                width: "85%",
                                                                marginTop: "2vh",
                                                                backgroundColor: "rgba(34, 34, 34, 0.85)",
                                                            }}
                                                        >
                                                            <Table stickyHeader>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        {table.table_schema.map((name: string) => (
                                                                            <TableCell key={0} align="center">
                                                                                <b>{name}</b>
                                                                            </TableCell>
                                                                        ))}
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableRow key={0}>
                                                                        {table.schema_type.map((value: string) => (
                                                                            <TableCell key={0} align="center">
                                                                                {value}
                                                                            </TableCell>
                                                                        ))}
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                </Grid>
                                            );
                                        })}
                                    </Card>
                                );
                            })}
                        </Stack>
                        <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
                    </Box>
                )
            )
    );
}

export default ViewTable;
