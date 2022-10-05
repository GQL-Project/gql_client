// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { UpdateResult } from "../proto/connection";
import { connection } from "./connect";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const query: string = JSON.parse(req.body)["query"] as unknown as string;
  const id: string = JSON.parse(req.body)["id"] as unknown as string;
  console.log("Update Request Received: " + query);
  connection().RunUpdate(
    {
      id: id,
      query: query,
    },
    function (err: Error | null, response: UpdateResult) {
      if (err) {
        console.log(err);
        res.status(500).end("RunUpdate: Error running query");
        return;
      }
      console.log("RunUpdate: Update Returned!: ", response);
      res.status(200).json(response);
    }
  );
}
