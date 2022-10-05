// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { QueryResult } from "../proto/connection";
import { connection } from "./connect";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query: string = JSON.parse(req.body)["query"] as unknown as string;
  const id: string = JSON.parse(req.body)["id"] as unknown as string;
  console.log("Query Request Received: " + query);
  connection().RunQuery(
    {
      id: id,
      query: query,
    },
    function (err: Error | null, response: QueryResult) {
      if (err) {
        console.log(err);
        res.status(500).end("RunQuery: Error running query");
        return;
      }
      console.log("RunQuery: Query Returned!: ", JSON.stringify(response));
      res.status(200).json(response);
    }
  );
}
