import { ClearOutlined } from "@ant-design/icons";
import { Button, Input, Space, Tabs } from "antd";
import { useState } from "react";
import DealerTable from "../components/DealerTable";
import TermsList from "../components/TermsList";
import useDealers from "../hooks/use-dealers";
import useTerms from "../hooks/use-terms";

type Props = ReturnType<typeof useDealers> & ReturnType<typeof useTerms> & {};

function DealerTerms({
  dealers,
  search,
  terms,
  onSearch,
  onAddTerms,
  onRemoveTerms,
}: Props) {
  return (
    <Space direction="vertical" style={{ padding: "0.5rem 0 0 0" }}>
      <Space>
        <Input
          placeholder="Filter Dealers"
          type="text"
          onChange={(e) => onSearch(e.currentTarget.value)}
          style={{ minWidth: "50ch" }}
          value={search}
        />
        <Button
          disabled={!search}
          icon={<ClearOutlined />}
          onClick={() => onSearch("")}
        />
      </Space>

      <DealerTable
        dealers={dealers}
        ignoredTerms={terms}
        onAddTerms={onAddTerms}
        onRemoveTerms={onRemoveTerms}
      />
    </Space>
  );
}

export default function IndexPage() {
  const { dealers, search, onSearch } = useDealers();
  const { terms, onAddTerms, onRemoveTerms } = useTerms();

  const [activeKey, setActiveKey] = useState("all-terms");

  const handleSearch = (s: string) => {
    onSearch(s);
    setActiveKey("dealer-terms");
  };

  return (
    <Tabs
      animated
      activeKey={activeKey}
      tabPosition="left"
      onChange={setActiveKey}
      tabBarStyle={{ width: "14ch" }}
      items={[
        {
          label: `Ignored (${terms.size})`,
          key: "all-terms",
          children: (
            <TermsList
              terms={terms}
              onRemoveTerms={onRemoveTerms}
              onSearch={handleSearch}
            />
          ),
        },
        {
          label: "Dealers",
          key: "dealer-terms",
          children: (
            <DealerTerms
              dealers={dealers}
              search={search}
              terms={terms}
              onSearch={onSearch}
              onAddTerms={onAddTerms}
              onRemoveTerms={onRemoveTerms}
            />
          ),
        },
      ]}
    />
  );
}
