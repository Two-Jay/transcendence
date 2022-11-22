// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  _: NextApiRequest,
  res: NextApiResponse
) {

/*

*/
  const num = Math.max(1,Math.round(Math.random()) * 2)

  if (num === 1) {
    res.status(200).json({
      data: {
        user: "me",
        login: "me",
        token: "QpwL5tke4Pnpja7X4"
      }
    })
  } else if (num === 2) {
    //res.status(400).json({ error: "Missing password" })

    res.status(400).json({
      data: {
        user: undefined,
        login: undefined,
        token: undefined
      },
      error:"Missing password"
    })


  }
}

//post
//https://stackoverflow.com/questions/66739797/how-to-handle-a-post-request-in-next-js
