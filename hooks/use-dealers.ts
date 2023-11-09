import { useEffect, useState } from "react";
import { Dealer } from "../lib/dealers";

let dealers: Dealer[] = [];

export default function useDealers() {
  const [filtered, setFiltered] = useState<Dealer[]>([]);
  const [search, setSearch] = useState("");

  const init = async (signal: AbortSignal) => {
    const res = await fetch("http://localhost:3000/api/dealers", { signal });
    const json = await res.json();

    dealers = json;

    setFiltered(dealers);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    init(signal)

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
        if (s) {
          return dealers.filter((d) =>
            d.query
              .toLowerCase()
              .replaceAll(" ", "")
              .includes(s.toLowerCase().replaceAll(" ", "")),
          );
        }

        return dealers;
      });
    },
  };
}
