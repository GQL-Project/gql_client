// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { StatusObject } from "@grpc/grpc-js";
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import { ConnectResult, DatabaseConnectionClient } from "../proto/connection";
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "connection.proto";
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: ["pages/proto"],
};
const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const protoDescriptor =
  grpc.loadPackageDefinition(packageDefinition).db_connection;

var address = "localhost";
var port = "50051";

// Function Used to Connect to the Database
export function connection(): DatabaseConnectionClient {
  const DatabaseClient = protoDescriptor.DatabaseConnection;
  const client = new DatabaseClient(
    address + ":" + port,
    grpc.credentials.createInsecure()
  );
  return client;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const _address: string = JSON.parse(req.body)["address"] as unknown as string;
  const _port: string = JSON.parse(req.body)["port"] as unknown as string;

  address = _address;
  port = _port;

  console.log("Connection Request Received.");
  connection().ConnectDB(
    {},
    function (err: StatusObject | null, response: ConnectResult) {
      if (err) {
        console.log("Connect Error: " + err.details);
        res.status(500).send(err.details);
        return;
      }
      console.log("ConnectDB: Connected to Database!: ", response.id);
      res.status(200).json({ id: response.id });
    }
  );
}
