import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { TextareaAutosize, Button, Box, Grid } from "@mui/material";
import { useState } from "react";
import logo from "../public/logo.png";
import Image from "next/image";
import { useContext } from "react";
import { AuthContext } from "./context";
import { QueryResult, UpdateResult } from "./proto/connection";
import { get } from "http";
import DynamicTable, { EditableCellParams } from "./components/dynamic_table";
import InlineEditable from "./components/inline_editable";

type ColumnData = { name: string } & { type: string } & { nullable: boolean };
const ColumnTypes = [
  "char",
  "smallint",
  "int",
  "timestamp",
  "float",
  "double",
  "boolean",
];

// Editable Checkbox Cell
const CheckBoxCell = ({
  value,
  row: { index },
  column: { id },
  updateMyData,
}: EditableCellParams) => {
  const onChange = () => {
    updateMyData(index, id, !value, false);
  };

  return (
    <input
      type="checkbox"
      checked={value}
      onChange={onChange}
      className={styles.createTableCheckbox}
    />
  );
};

// Editable Text Box Cell
const TextBoxCell = ({
  value,
  row: { index },
  column: { id },
  updateMyData,
}: EditableCellParams) => {
  const onChange = (e: any) => {
    updateMyData(index, id, e.target.value, false);
  };

  return (
    <InlineEditable text={value} type="input" placeholder={value}>
      <input
        type="text"
        value={value}
        style={{ width: "8vw", fontSize: "0.9em" }}
        className={styles.createTableNameInput}
        onChange={onChange}
      />
    </InlineEditable>
  );
};

function CreateTable(props: { close: () => void }) {
  const authContext = useContext(AuthContext);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMessage] = useState("");

  const [tableName, setTableName] = useState("");
  const [data, setData] = React.useState<ColumnData[]>([]);

  const handleError = async (message: string) => {
    setError("Error Creating Table: " + message);

    // Clear the error after 10 seconds
    setTimeout(function () {
      setError("");
    }, 10000);
  };

  const clearError = () => {
    setError("");
  };

  const handleTableNameTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTableName(event.target.value);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: TextBoxCell,
      },
      {
        Header: "Type",
        accessor: "type",
        Cell: TextBoxCell,
      },
      {
        Header: "Nullable",
        accessor: "nullable",
        Cell: CheckBoxCell,
      },
      {
        Header: "Delete",
        accessor: "delete",
        Cell: ({
          row: { index },
          updateMyData: updater,
        }: EditableCellParams) => {
          return (
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                // Remove the row from the data
                updater(index, "", "", true);
              }}
              className={styles.createTableDeleteButton}
            >
              Delete
            </Button>
          );
        },
      },
    ],
    []
  );

  const handleCreateNewRow = async () => {
    data.push({ name: "NULL", type: "NULL", nullable: false });
    setData((data) => [...data]);
  };

  const handleCreateNewTable = async () => {
    // Clear any previous errors
    clearError();
    setSuccessMessage("");

    // Check that the table name is not empty
    if (tableName === "") {
      handleError("Table name cannot be empty");
      return;
    }

    // Check that the table name does not have any spaces
    if (tableName.includes(" ")) {
      handleError("Table name cannot have spaces");
      return;
    }

    // Check that there are columns to create
    if (data.length === 0) {
      handleError("Table must have at least one column");
      return;
    }

    // Check that the names are all unique
    let names = new Set();
    for (let i = 0; i < data.length; i++) {
      if (names.has(data[i].name)) {
        handleError(
          "Column names must be unique [" +
            data[i].name +
            "] is used more than once"
        );
        return;
      }
      names.add(data[i].name);
    }

    // Check that there is at least one non-nullable column
    let hasNonNull = false;
    for (let i = 0; i < data.length; i++) {
      if (!data[i].nullable) {
        hasNonNull = true;
        break;
      }
    }
    if (!hasNonNull) {
      handleError("Table must have at least one non-nullable column");
      return;
    }

    // Check that the types are all correct
    for (let i = 0; i < data.length; i++) {
      if (!ColumnTypes.includes(data[i].type.toLowerCase())) {
        let errorMessage = "";
        // For the String type, we need to specify the length of it
        if (
          data[i].type.toLowerCase().startsWith("varchar") ||
          data[i].type.toLowerCase().startsWith("char")
        ) {
          // Check that the length is specified
          if (!data[i].type.includes("(") || !data[i].type.includes(")")) {
            errorMessage =
              "Type must specify length for column " + data[i].name;
          } else {
            // Check that the length is a number
            let length = data[i].type.split("(")[1].split(")")[0];
            if (isNaN(Number(length))) {
              errorMessage = "Invalid length for column " + data[i].name;
            }
          }
        } else {
          errorMessage = "Invalid column type for column " + data[i].name;
        }

        if (errorMessage.length > 0) {
          // Join all the column types
          errorMessage +=
            ". Valid types are: [" +
            ColumnTypes.slice(1).join(", ") +
            ", char(length)]";
          handleError(errorMessage);
          return;
        }
      }
    }

    // Assemble the create table query
    let query = "CREATE TABLE " + tableName + " (";
    for (let i = 0; i < data.length; i++) {
      query += data[i].name.trim() + " " + data[i].type.trim();
      // TODO: add support for null values

      if (i < data.length - 1) {
        query += ", ";
      }
    }
    query += ");";

    // Run the create table query
    const response = await fetch("/api/update", {
      method: "POST",
      body: JSON.stringify({ query: query, id: authContext.loggedIn }),
    });

    // Failure
    if (!response.ok || response.statusText !== "OK") {
      let text = await response.text();
      handleError(text);
    }
    // Success
    else {
      const updateResult: UpdateResult = await response.json();
      setSuccessMessage(updateResult.message);

      // Close the window after 3 seconds
      setTimeout(function () {
        props.close();
      }, 3000);
    }
  };

  // This allows the table to edit the data in the table based on rowIndex and columnId
  const updateMyData = (
    rowIndex: number,
    columnId: number,
    value: any,
    deleteRow: boolean
  ) => {
    setData((old) => {
      // If we are deleting the row, remove it from the table
      if (deleteRow == true) {
        const newData = old.slice();
        newData.splice(rowIndex, 1);
        return newData;
      }

      // Otherwise, update the value at the column index
      return old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      });
    });
  };

  return authContext.loggedIn ? (
    <Box className={styles.modal}>
      <h1>Create Table</h1>

      <div className="group">
        <label className={styles.createTableLabel}>Table Name: </label>

        <input
          type="text"
          placeholder="Table Name"
          className={styles.createTableNameInput}
          value={tableName}
          onChange={handleTableNameTextChange}
        />
      </div>

      <br />

      <DynamicTable columns={columns} data={data} updateMyData={updateMyData} />

      <Button
        variant="contained"
        className={styles.regularButton}
        sx={{
          color: "white",
          borderColor: "white",
          marginTop: "2vh",
          marginBottom: "2vh",
          fontSize: "large",
          width: "100%",
        }}
        onClick={handleCreateNewRow}
      >
        Create New Attribute
      </Button>

      <p className={styles.createTableErrorText}>{error}</p>
      <p className={styles.createTableSuccessText}>{successMsg}</p>

      <Button
        color="success"
        variant="contained"
        className={styles.regularButton}
        sx={{
          color: "white",
          borderColor: "white",
          marginTop: "2vh",
          marginBottom: "2vh",
          fontSize: "large",
          width: "60%",
        }}
        onClick={handleCreateNewTable}
      >
        Create Table
      </Button>
      <Image src={logo} alt="GQL Logo" height={80} objectFit="contain" />
    </Box>
  ) : (
    <h1>Not Logged In</h1>
  );
}

export default CreateTable;
