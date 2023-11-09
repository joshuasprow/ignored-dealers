import { Input } from "antd";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useState } from "react";
import DealerTable from "../components/DealerTable";
import type { Dealer } from "../lib/dealers";

export const getStaticProps: GetStaticProps<{
  dealers: Dealer[];
}> = async () => {
  const res = await fetch("http://localhost:3000/api/dealers");
  const dealers = await res.json();

  return { props: { dealers } };
};

export default function IndexPage({
  dealers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(dealers);
  const [ignoredTerms, setIgnoredTerms] = useState(new Set<string>());

  const handleQueryChange = (query: string) => {
    setFiltered(() =>
      dealers.filter((d) =>
        d.query.includes(query.toLowerCase().replaceAll(" ", "")),
      ),
    );
    setQuery(query);
  };

  const handleAddTerm = (term: string) =>
    setIgnoredTerms((prev) => {
      prev.add(term);
      return new Set(prev);
    });

  const handleRemoveTerm = (term: string) =>
    setIgnoredTerms((prev) => {
      prev.delete(term);
      return new Set(prev);
    });

  return (
    <>
      <Input
        type="text"
        onChange={(e) => handleQueryChange(e.currentTarget.value)}
        value={query}
      />
      <DealerTable
        dealers={filtered}
        ignoredTerms={ignoredTerms}
        onAddTerm={handleAddTerm}
        onRemoveTerm={handleRemoveTerm}
      />
      {JSON.stringify(Array.from(ignoredTerms))}
    </>
  );
}
