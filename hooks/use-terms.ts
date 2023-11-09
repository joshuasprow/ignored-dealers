import { useEffect, useState } from "react";
import { Term, TermKind } from "../lib/terms";

type Terms = Map<string, TermKind>;

export default function useTerms() {
  const [_terms, setTerms] = useState<Terms>(new Map());

  const init = async (signal: AbortSignal) => {
    const res = await fetch("api/terms", { signal });
    const json = await res.json();

    setTerms(() => {
      const terms: Terms = new Map();

      for (const t of json as Term[]) {
        terms.set(t.term, t.kind);
      }

      return terms;
    });
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
    terms: _terms,
    onAddTerms: async (terms: Term[]) => {
      await fetch("api/terms", {
        method: "POST",
        body: JSON.stringify(terms),
      });

      setTerms((prev) => {
        for (const t of terms) {
          prev.set(t.term, t.kind);
        }

        return new Map(prev);
      });
    },
    onRemoveTerms: async (terms: Term[]) => {
      await fetch("api/terms", {
        method: "DELETE",
        body: JSON.stringify(terms),
      });

      setTerms((prev) => {
        for (const t of terms) {
          prev.delete(t.term);
        }

        return new Map(prev);
      });
    },
  };
}
