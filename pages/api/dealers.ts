import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import { getDealers } from "../../lib/dealers.db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dealers = getDealers(db);

  res.status(200).json(dealers);
}
