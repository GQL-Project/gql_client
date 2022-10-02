// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { UpdateResult } from '../proto/connection';
import { connection, getCookie } from './connect'


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const query: string = JSON.parse(req.body)['query'] as unknown as string;
    console.log("VC Request Received: " + query);
    if (getCookie(req)) {
        connection().RunVersionControlCommand({
            id: getCookie(req)!,
            query: query
        }, function (err: Error | null, response: UpdateResult) {
            if (err) {
                console.log(err);
                res.status(500).end('RunVCS: Error running query');
                return;
            }
            console.log("RunVCS: Update Returned!: ", response);
            res.status(200).json(response);
        });
    } else {
        console.log("RunVCS: Cookie does not exist");
        res.status(404).end('RunVCS: Unable to find User');
    }
}
