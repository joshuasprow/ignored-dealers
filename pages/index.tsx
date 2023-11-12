import { Space } from "antd";
import { useState } from "react";
import DealerSearch from "../components/DealerSearch";
import DealerTable from "../components/DealerTable";
import useDealers from "../hooks/use-dealers";
import useTerms from "../hooks/use-terms";

export default function IndexPage() {
  const { dealers, search, onSearch } = useDealers();
  const { terms } = useTerms();

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
      <DealerTable
        dealers={showIgnored ? ignored : dealers}
        showIgnored={showIgnored}
        terms={terms}
      />
    </Space>
  );
}
