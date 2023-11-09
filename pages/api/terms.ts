import type { NextApiRequest, NextApiResponse } from "next";
import { array, parse } from "valibot";
import { addTerms, getTerms, removeTerms, Term } from "../../lib/terms";

// this is just silly...
const routes = {
  GET(req: NextApiRequest, res: NextApiResponse) {
    res.json(getTerms());
  },
  POST(req: NextApiRequest, res: NextApiResponse) {
    let terms = parse(array(Term), JSON.parse(req.body));

    console.log(terms.length);

    terms = addTerms(terms);

    console.log(terms.length);

    res.json({});
  },
  DELETE(req: NextApiRequest, res: NextApiResponse) {
    const terms = parse(array(Term), JSON.parse(req.body));

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
