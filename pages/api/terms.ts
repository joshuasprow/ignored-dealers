import type { NextApiRequest, NextApiResponse } from "next";
import { array, parse } from "valibot";
import { Term } from "../../lib/terms";
import { addTerms, removeTerms } from "../../lib/terms.db";
import { getTerms } from "../../lib/terms.db";

// this is just silly...
const routes = {
  GET(req: NextApiRequest, res: NextApiResponse) {
    console.log("terms:getting");

    res.json(getTerms());
  },
  POST(req: NextApiRequest, res: NextApiResponse) {
    const terms = parse(array(Term), JSON.parse(req.body));

    console.log("terms:posting", terms);

    addTerms(terms);

    res.json({});
  },
  DELETE(req: NextApiRequest, res: NextApiResponse) {
    const terms = parse(array(Term), JSON.parse(req.body));

    console.log("terms:deleting", terms);

    removeTerms(terms);

    res.json({});
  },
} as const;

function isRoute(method?: string): method is keyof typeof routes {
  return !!method && method in routes;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isRoute(req.method)) {
    res.status(405).json({ error: `method ${req.method} not allowed` });
    return;
  }

  try {
    routes[req.method](req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "something went wrong" });
  }
}
