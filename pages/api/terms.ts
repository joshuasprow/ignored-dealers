import type { NextApiRequest, NextApiResponse } from "next";
import { array, parse } from "valibot";
import db from "../../lib/db";
import { Term } from "../../lib/terms";
import { addTerms, getTerms, removeTerms } from "../../lib/terms.db";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      res.json(getTerms(db));

      return;
    }
    case "POST": {
      const terms = parse(array(Term), JSON.parse(req.body));

      addTerms(db, terms);

      res.json({});

      return;
    }
    case "DELETE": {
      const terms = parse(array(Term), JSON.parse(req.body));

      removeTerms(db, terms);

      res.json({});

      return;
    }
    default: {
      res.status(405).json({ error: `method ${req.method} not allowed` });

      return;
    }
  }
}
