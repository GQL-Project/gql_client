// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Empty } from '../../google/protobuf/empty'
import { QueryResult } from '../proto/connection';
import { connection, delCookie, getCookie } from './connect'


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const query: string = JSON.parse(req.body)['query'] as unknown as string;
    console.log("Query Request Received: " + query);
    if (getCookie(req)) {
        connection().RunQuery({
            id: getCookie(req)!,
            query: query
        }, function (err: Error | null, response: QueryResult) {
            if (err) {
                console.log(err);
                res.status(500).end('RunQuery: Error running query');
                return;
            }
            console.log("RunQuery: Query Returned!: ", response);
            res.status(200).json(response);
        });
    } else {
        console.log("RunQuery: Cookie does not exist");
        res.status(404).end('RunQuery: Unable to find User');
    }
}
