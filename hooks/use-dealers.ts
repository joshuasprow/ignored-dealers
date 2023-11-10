import uFuzzy from "@leeoniya/ufuzzy";
import { useEffect, useState } from "react";
import { Dealer } from "../lib/dealers";

const uf = new uFuzzy({ intraIns: 1, intraChars: `[a-z\d'\-\.]` });

let dealers: Dealer[] = [];
let queries: string[] = [];

function filter(search: string) {
  if (!search) {
    return dealers;
  }

  if (dealers.length !== queries.length) {
    throw new Error(
      `dealers ${dealers.length} and queries ${queries.length} out of sync`,
    );
  }

  const indices = uf.filter(queries, search);

  if (!indices) {
    return [];
  }

  const next: (typeof dealers)[number][] = [];

  for (const index of indices) {
    next.push(dealers[index]);
  }

  return next;
}

export default function useDealers() {
  const [filtered, setFiltered] = useState<Dealer[]>([]);
  const [search, setSearch] = useState("");

  const init = async (signal: AbortSignal) => {
    const res = await fetch("api/dealers", { signal });
    const json = await res.json();

    dealers = json;
    queries = dealers.map((d) => d.query);

    setFiltered(dealers);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    init(signal);

    return () => {
      controller.abort();
    };
  }, []);

  return {
    dealers: filtered,
    search,
    onSearch: (s: string) => {
      setSearch(s);

      setFiltered(() => {
        if (!s) return dealers;

        return filter(s);
      });
    },
  };
}
