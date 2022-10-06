// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { StatusObject } from "@grpc/grpc-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { Empty } from "../../google/protobuf/empty";
import { connection } from "./connect";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const id: string = JSON.parse(req.body)["id"] as unknown as string;
  console.log("Disconnect Request Received.");
  connection().DisconnectDB(
    {
      id: id,
    },
    function (err: StatusObject | null, response: Empty) {
      if (err) {
        console.log("Disconnect Error: " + err.details);
        res.status(500).send(err.details);
        return;
      }
      console.log("DisconnectDB: Disconnected from Database!: ", response);
      res.status(200).json({});
    }
  );
}
