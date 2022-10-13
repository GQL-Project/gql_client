import React, { Component } from 'react'
import styles from "../../styles/Home.module.css";
import { useTable, usePagination, TableInstance } from 'react-table';

type RowType = { index: number };
type ColumnType = { id: string };
export type EditableCellParams = { value: any } & { row: RowType } & { column: ColumnType } & { updateMyData: (rowIndex: number, columnId: string, value: any, deleteRow: boolean) => void };

function DynamicTable(props: { columns: any[], data: any[], updateMyData: (rowIndex: number, columnId: number, value: any, deleteRow: boolean) => void } ) {
    const tableInstance: TableInstance<Object> = useTable(
        {
            columns: props.columns,
            data: props.data,
            autoResetPage: false,
            updateMyData: props.updateMyData,
        },
        usePagination
    );

    const getTableProps = tableInstance.getTableProps;
    const getTableBodyProps = tableInstance.getTableBodyProps;
    const headerGroups = tableInstance.headerGroups;
    const prepareRow = tableInstance.prepareRow;
    const page = tableInstance.page;
  
    // Render the UI for the table
    return (
      <>
        <table {...getTableProps()} className={styles.createTable}>
          <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                    </tr>
                )
            })}
          </tbody>
        </table>
      </>
    )
}

export default DynamicTable