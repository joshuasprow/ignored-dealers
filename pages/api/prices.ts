import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import { getPrices } from "../../lib/prices.db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const prices = getPrices(db);

  res.status(200).json(prices);
}
