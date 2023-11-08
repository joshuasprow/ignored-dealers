import type { NextApiRequest, NextApiResponse } from "next";
import { getDealers } from "../../lib/dealers";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dealers = getDealers();

  res.status(200).json(dealers);
}
