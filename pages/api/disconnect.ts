// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { serialize } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Empty } from '../../google/protobuf/empty'
import { connection, delCookie } from './connect'


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Disconnect Request Received.");
  if (req.cookies['dbConnectionId']) {
    connection().DisconnectDB({
      id: req.cookies['dbConnectionId']
    }, function (err: Error | null, response: Empty) {
      delCookie(res, 'dbConnectionId');
      if (err) {
        console.log(err);
        res.status(500).end('DisconnectDB: Unable to connect to database');
        return;
      }
      console.log("DisconnectDB: Disconnected from Database!: ", response);
      res.status(200).json({});
    });
  } else {
    console.log("DisconnectDB: Cookie does not exist");
    res.status(404).end('DisconnectDB: Unable to Disconnect, not connected to database');
  }
}
