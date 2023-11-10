import { Space } from "antd";
import DealerSearch from "../components/DealerSearch";
import DealerTable from "../components/DealerTable";
import useDealers from "../hooks/use-dealers";
import useTerms from "../hooks/use-terms";

export default function IndexPage() {
  const { dealers, search, onSearch } = useDealers();
  const { terms, onAddTerms, onRemoveTerms } = useTerms();

  return (
    <Space direction="vertical">
      <DealerSearch search={search} onSearch={onSearch} />
      <DealerTable
        dealers={dealers}
        terms={terms}
        onAddTerms={onAddTerms}
        onRemoveTerms={onRemoveTerms}
      />
    </Space>
  );
}
