import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "valibot";
import { addTerm, getTerms, Term } from "../../lib/terms";

// this is just silly...
const routes = {
  GET(req: NextApiRequest, res: NextApiResponse) {
    res.json(getTerms());
  },
  POST(req: NextApiRequest, res: NextApiResponse) {
    const term = parse(Term, JSON.parse(req.body));

    addTerm(term);

    res.json({});
  },
  DELETE(req: NextApiRequest, res: NextApiResponse) {
    console.log("DELETE");
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
