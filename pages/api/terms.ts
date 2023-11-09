import type { NextApiRequest, NextApiResponse } from "next";
import { getTerms } from "../../lib/terms";

// this is just silly...
const routes = {
  GET(req: NextApiRequest, res: NextApiResponse) {
    res.json(getTerms());
  },
  POST(req: NextApiRequest, res: NextApiResponse) {
    console.log("POST");
    res.json({ success: true });
  },
  DELETE(req: NextApiRequest, res: NextApiResponse) {
    console.log("DELETE");
    res.json({ success: true });
  },
} as const;

function isRoute(method?: string): method is keyof typeof routes {
  return !!method && method in routes;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isRoute(req.method)) {
    res.status(405).send(`method ${req.method} not allowed`);
    return;
  }

  routes[req.method](req, res);
}
