// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { StatusObject } from "@grpc/grpc-js";
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
    function (err: StatusObject | null, response: UpdateResult) {
      if (err) {
        console.log("Update Error: " + err.details);
        res.status(500).send(err.details);
        return;
      }
      response.time_taken = response.time_taken.toFixed(4);
      console.log("RunUpdate: Update Returned!: ", response);
      res.status(200).json(response);
    }
  );
}
