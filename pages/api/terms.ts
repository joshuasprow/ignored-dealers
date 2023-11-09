import type { NextApiRequest, NextApiResponse } from "next";
import { getTerms } from "../../lib/terms";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const terms = getTerms();

  res.status(200).json(terms);
}
