// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ConnectResult, DatabaseConnectionClient } from '../proto/connection';
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "connection.proto";
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: ['pages/proto'],
};
const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).db_connection;

// Function Used to Connect to the Database
export function connection(): DatabaseConnectionClient {
  const DatabaseClient = protoDescriptor.DatabaseConnection;
  const client = new DatabaseClient("localhost:50051", grpc.credentials.createInsecure());
  return client;
}

export const setCookie = (
  res: NextApiResponse,
  value: string,
) => {
  res.setHeader('Set-Cookie', serialize('dbConnectionId', value))
}

export const delCookie = (
  res: NextApiResponse,
) => {
  res.setHeader('Set-Cookie', serialize('dbConnectionId', ''))
}

export const getCookie = (
  req: NextApiRequest,
) => {
  return req.cookies['dbConnectionId'];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Connection Request Received.");
  if (getCookie(req)) {
    // Check if cookie exists
    console.log("ConnectDB: Cookie exists");
    res.status(200).json({ id: getCookie(req)! })
  } else {
    // If cookie does not exist, connect to database and set cookie
    connection().ConnectDB({}, function (err: Error | null, response: ConnectResult) {
      if (err) {
        console.log(err);
        delCookie(res);
        res.status(500).end('ConnectDB: Unable to connect to database');
        return;
      }
      setCookie(res, response.id);
      console.log("ConnectDB: Connected to Database!: ", response.id);
      res.status(200).json({ id: response.id });
    });
  }
}