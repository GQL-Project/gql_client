import React, { useEffect, useState } from "react";
import {
    TextareaAutosize,
    Modal,
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
    getTableSortLabelUtilityClass,
} from "@mui/material";
import styles from "../styles/Home.module.css";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { UpdateResult } from "./proto/connection";
import { useRouter } from "next/router";
import Head from "next/head";
import InlineEditable from "./components/inline_editable";
import ViewConfirmation from "./confirmation";

function ViewTable(props: { close: () => void }) {
    const authContext = useContext(AuthContext);
    const [tableList, setTableList] = useState({});
    const [error, setError] = useState("No Tables");
    const [empty, setEmpty] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [type, setType] = useState("");
    const [colName, setColName] = useState("");
    const [newColName, setNewColName] = useState("");
    const [newColType, setNewColType] = useState("");

    const handleConfirmationOpen = () => setConfirmationOpen(true);
    const handleConfirmationClose = () => setConfirmationOpen(false);

    const handleColName = (e) => {
        setNewColName(e.target.value);
    }
    const handleColType = (e) => {
        setNewColType(e.target.value);
    }

    const onColNameChange = (e) => {
        setColName(e.target.value);
    }
    const onColNameKeyDown = async (e, i : number, schemaName: string, schemaType : string, tableName : string) => {
        let option = '';
        if (schemaType.includes('Nullable')) {
            option = 'null';
            
            let pChar = '';
            if (schemaType.includes('String')) pChar = ")";

            var regExp = /\(([^)]+)\)/;
            var matches = regExp.exec(schemaType);
            schemaType = matches[1];
            schemaType += pChar;
        }

        if (schemaType == 'I32') schemaType = 'smallint';
        if (schemaType == 'I64') schemaType = 'int';
        if (schemaType.includes('String')) schemaType = schemaType.replace('String', 'varchar');
        if (schemaType.includes('Bool')) schemaType = schemaType.replace('Bool', 'Boolean');
        
        if (e.key === "Enter" || e.key === "Escape") {
            e.target.blur();
            setColName(e.target.value);
            const response = await fetch("/api/update", {
                method: "POST",
                body: JSON.stringify({
                    query: "ALTER TABLE " + tableName + " CHANGE " + schemaName + " " + e.target.value + " " + schemaType + " " + option,
                    id: authContext.loggedIn,
                }),
            });
            if (response.ok) refreshPage();
        }
    }

    const onTypeChange = (e) => {
        setType(e.target.value);
    };

    const onTypeKeyDown = async (e, i : number, schemaName: string, tableName : string) => {
        var schemaType = e.target.value;
        let option = '';
        if (schemaType.includes('Nullable')) {
            option = 'null';
            var regExp = /\(([^)]+)\)/;
            var matches = regExp.exec(schemaType);
            schemaType = matches[1];
        }

        if (schemaType == 'I32') schemaType = 'smallint';
        if (schemaType == 'I64') schemaType = 'int';
        if (schemaType.includes('String')) schemaType = schemaType.replace('String', 'varchar');
        if (schemaType.includes('Bool')) schemaType = schemaType.replace('Bool', 'Boolean');
        
        if (e.key === "Enter" || e.key === "Escape") {
            e.target.blur();
            setType(e.target.value);
            const response = await fetch("/api/update", {
                method: "POST",
                body: JSON.stringify({
                    query: "ALTER TABLE " + tableName + " CHANGE " + schemaName + " " + schemaName + " " + schemaType + " " + option,
                    id: authContext.loggedIn,
                }),
            });
            if (response.ok) {
                refreshPage();
                console.log('here');
            }
            else {
                console.log(response);
            }
        }
    }

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

    const refreshPage = async () => {
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

    const handleDropTable = async (key) => {
        console.log(key);
        const response = await fetch("/api/update", {
            method: "POST",
            body: JSON.stringify({
                query: "DROP TABLE " + key,
                id: authContext.loggedIn,
            }),
        });
        if (response.ok) refreshPage();
    };

    const handleAddColumn = async (key) => {
        const response = await fetch("/api/update", {
            method: "POST",
            body: JSON.stringify({
                query: "ALTER TABLE " + key + " ADD " + newColName + " " + newColType,
                id: authContext.loggedIn,
            }),
        });

        
        if (response.ok) {
            setNewColName('');
            setNewColType('');

            var name = document.querySelectorAll("[id='newNameCol']");
            for(var i = 0; i < name.length; i++) 
                name[i].value='';

            var type = document.querySelectorAll("[id='newTypeCol']");
            for(var i = 0; i < type.length; i++) 
                type[i].value='';
            refreshPage();
        }
    }

    const handleDropColumn = async (key, column) => {
        const response = await fetch("/api/update", {
            method: "POST",
            body: JSON.stringify({
                query: "ALTER TABLE " + key + " DROP " + column,
                id: authContext.loggedIn,
            }),
        });
        if (response.ok) refreshPage();
    }

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
                                        <h2>{key}
                                            <Button
                                                color="error"
                                                variant="contained"
                                                style={{ float: "right" }}
                                                onClick={() => {
                                                    // Drop the table
                                                    console.log(key);
                                                    //handleConfirmationOpen();
                                                    handleDropTable(key);

                                                }}
                                            >
                                                Drop Table
                                            </Button></h2>
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
                                                                        {table.table_schema.map((name: string, i: number) => (
                                                                            <TableCell key={0} align="center">
                                                                                <Button
                                                                                    color="error"
                                                                                    variant="outlined"
                                                                                    // style={{ float: "right" }}
                                                                                    size="small"
                                                                                    onClick={() => {
                                                                                        //handleConfirmationOpen();
                                                                                        handleDropColumn(key, name);
                                                                                    }}
                                                                                >
                                                                                    Drop
                                                                                </Button>
                                                                                <InlineEditable text={name} type="input" placeholder={name}>
                                                                                    <input
                                                                                    type="text"
                                                                                    defaultValue={name}
                                                                                    style={{ width: "8vw", fontSize: "0.9em" }}
                                                                                    className={styles.createTableNameInput}
                                                                                    onChange={onColNameChange}
                                                                                    onKeyDown={e => onColNameKeyDown(e, i,
                                                                                                table.table_schema[i], table.schema_type[i], key)}
                                                                                    />
                                                                                </InlineEditable>
                                                                            </TableCell>
                                                                        ))}
                                                                        <TableCell
                                                                            align="center"
                                                                            style = {{width: "8vw"}}
                                                                        >
                                                                            <Button
                                                                                color="info"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                style={{marginBottom: 10}}
                                                                                onClick={() => {
                                                                                    handleAddColumn(key);
                                                                                }}
                                                                            >
                                                                                Add
                                                                            </Button>

                                                                            <input
                                                                                id = "newNameCol"
                                                                                style={{width: "100%"}}
                                                                                onChange={handleColName}
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableRow key={0}>
                                                                        {table.schema_type.map((value: string, i: number) => (
                                                                            <TableCell key={0} align="center">
                                                                                <InlineEditable text={value} type="input" placeholder={value}>
                                                                                    <input
                                                                                    type="text"
                                                                                    defaultValue={value}
                                                                                    style={{ width: "8vw", fontSize: "0.9em" }}
                                                                                    className={styles.createTableNameInput}
                                                                                    onChange={onTypeChange}
                                                                                    onKeyDown={e => onTypeKeyDown(e, i, table.table_schema[i], key)}
                                                                                    />
                                                                                </InlineEditable>
                                                                            </TableCell>
                                                                        ))}
                                                                        <TableCell
                                                                            style = {{width: "8vw"}}
                                                                            align="center"
                                                                        >
                                                                            <input
                                                                                id = "newTypeCol"
                                                                                style={{width: "100%"}}
                                                                                onChange={handleColType}
                                                                            />
                                                                        </TableCell>
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
