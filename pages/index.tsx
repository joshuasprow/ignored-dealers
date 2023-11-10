import { useQuery } from "@tanstack/react-query";
import { Space } from "antd";
import { useState } from "react";
import DealerSearch from "../components/DealerSearch";
import DealerTable from "../components/DealerTable";
import useDealers from "../hooks/use-dealers";
import { Term, Terms } from "../lib/terms";

async function getTerms(): Promise<Terms> {
  const res = await fetch("api/terms");
  const json = await res.json();

  const terms: Terms = new Map();

  for (const t of json as Term[]) {
    terms.set(t.term, t.kind);
  }

  return terms;
}

export default function IndexPage() {
  const { dealers, search, onSearch } = useDealers();

  const { data: terms } = useQuery<Terms>({
    initialData: new Map(),
    queryFn: getTerms,
    queryKey: ["terms"],
  });

  const [showIgnored, setShowIgnored] = useState(false);

  const ignored = dealers.filter(
    (d) =>
      terms.has(d.name) || terms.has(d.seller_id) || terms.has(d.phone_number)
  );

  return (
    <Space direction="vertical">
      <DealerSearch
        search={search}
        showIgnored={showIgnored}
        onSearch={onSearch}
        onShowIgnored={setShowIgnored}
      />
      <DealerTable dealers={showIgnored ? ignored : dealers} terms={terms} />
    </Space>
  );
}
