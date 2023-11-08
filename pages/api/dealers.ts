import db from "../../lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const two = db.prepare("select 1 + 1 as two").get();

  res.status(200).json({ two });
}
