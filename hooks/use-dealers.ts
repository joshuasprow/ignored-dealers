import uFuzzy from "@leeoniya/ufuzzy";
import { useEffect, useMemo, useState } from "react";
import { Dealer } from "../lib/dealers";
import { useQuery } from "@tanstack/react-query";

const uf = new uFuzzy({ intraIns: 1, intraChars: `[a-z\d'\-\.]` });

function filter(dealers: Dealer[], queries: string[], search: string) {
  if (!search) {
    return dealers;
  }

  if (dealers.length !== queries.length) {
    throw new Error(
      `dealers ${dealers.length} and queries ${queries.length} out of sync`
    );
  }

  const indices = uf.filter(queries, search);

  if (!indices) {
    return [];
  }

  const next: Dealer[] = [];

  for (const index of indices) {
    next.push(dealers[index]);
  }

  return next;
}

async function getDealers() {
  try {
    const res = await fetch("api/dealers");
    const json = await res.json();

    return json as Dealer[];
  } catch (error) {
    console.error(error);

    return [];
  }
}

export default function useDealers() {
  const { data: dealers } = useQuery<Dealer[]>({
    initialData: [],
    queryFn: getDealers,
    queryKey: ["dealers"],
  });

  const [filtered, setFiltered] = useState(dealers);
  const [search, setSearch] = useState("");

  const queries = useMemo(() => dealers.map((d) => d.query), [dealers]);

  useEffect(() => {
    setFiltered(() => {
      if (!search) return dealers;

      return filter(dealers, queries, search);
    });
  }, [dealers, queries, search]);

  return {
    dealers: filtered,
    search,
    onSearch: setSearch,
  };
}
