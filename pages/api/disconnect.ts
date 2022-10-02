// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Empty } from '../../google/protobuf/empty'
import { connection, delCookie, getCookie } from './connect'


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Disconnect Request Received.");
  if (getCookie(req)) {
    connection().DisconnectDB({
      id: getCookie(req)!
    }, function (err: Error | null, response: Empty) {
      delCookie(res);
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
