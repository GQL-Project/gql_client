// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
    function (err: Error | null, response: Empty) {
      if (err) {
        console.log(err);
        res.status(500).end("DisconnectDB: Unable to connect to database");
        return;
      }
      console.log("DisconnectDB: Disconnected from Database!: ", response);
      res.status(200).json({});
    }
  );
}
