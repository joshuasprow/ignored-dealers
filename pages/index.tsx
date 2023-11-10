import { Space } from "antd";
import DealerSearch from "../components/DealerSearch";
import DealerTableNext from "../components/DealerTableNext";
import useDealers from "../hooks/use-dealers";
import useTerms from "../hooks/use-terms";

export default function IndexPage() {
  const { dealers, search, onSearch } = useDealers();
  const { terms, onAddTerms, onRemoveTerms } = useTerms();

  return (
    <Space direction="vertical">
      <DealerSearch search={search} onSearch={onSearch} />
      <DealerTableNext
        dealers={dealers}
        terms={terms}
        onAddTerms={onAddTerms}
        onRemoveTerms={onRemoveTerms}
      />
    </Space>
  );
}
