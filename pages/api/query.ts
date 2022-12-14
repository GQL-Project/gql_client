// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { StatusObject } from "@grpc/grpc-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { CellValue, QueryResult, RowValue } from "../proto/connection";
import { connection } from "./connect";

export interface QueryString {
    column_names: string[];
    values: string[][];
    time_taken: number;
}


function fromTimestamp(t: Timestamp): Date {
    let millis = t.seconds * 1_000;
    millis += t.nanos / 1_000_000;
    return new Date(millis);
  }
  

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const query: string = JSON.parse(req.body)["query"] as unknown as string;
    const id: string = JSON.parse(req.body)["id"] as unknown as string;
    console.log("Query Request Received: " + query);
    connection().RunQuery(
        {
            id: id,
            query: query,
        }, function (err: StatusObject | null, response: QueryResult) {
            if (err) {
                console.log("RunQuery Error: " + err.details);
                res.status(500).send(err.details);
                return;
            }
            // Parse QueryResult into QueryString
            const queryString: QueryString = {
                column_names: response.column_names,
                values: response.row_values.map((row: RowValue) => row.cell_values.map((cell: CellValue) => {
                    if (cell.col_bool !== undefined) {
                        return cell.col_bool.toString();
                    } else if (cell.col_i32 !== undefined) {
                        return cell.col_i32.toString();
                    } else if (cell.col_i64 !== undefined) {
                        return cell.col_i64.toString();
                    } else if (cell.col_double !== undefined) {
                        // floating point three decimal places
                        return cell.col_double.toFixed(4);
                    } else if (cell.col_time !== undefined) {
                        return fromTimestamp(cell.col_time).toISOString();
                    } else if (cell.col_float !== undefined) {
                        // floating point three decimal places
                        return cell.col_float.toFixed(4);
                    } else if (cell.col_string !== undefined) {
                        return cell.col_string;
                    } else if (cell.col_null !== undefined) {
                        return "NULL";
                    } else {
                        return "";
                    }
                })),
                time_taken: response.time_taken.toFixed(4)
            }
            console.log("RunQuery: QueryString: ", queryString);
            res.status(200).json(queryString);
        }
    );
}
