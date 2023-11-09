import { ClearOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Badge, Button, Input, Modal, Space, Typography } from "antd";
import { useState } from "react";
import DealerTable from "../components/DealerTable";
import TermsList from "../components/TermsList";
import useDealers from "../hooks/use-dealers";
import useTerms from "../hooks/use-terms";

const { Text } = Typography;

export default function IndexPage() {
  const { dealers, search, onSearch } = useDealers();
  const { terms, onAddTerms, onRemoveTerms } = useTerms();

  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <>
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
          <Badge color="blue" count={terms.size}>
            <Button
              disabled={!terms.size}
              icon={<UnorderedListOutlined />}
              onClick={() => setTermsOpen(true)}
            />
          </Badge>
        </Space>
        <DealerTable
          dealers={dealers}
          ignoredTerms={terms}
          onAddTerms={onAddTerms}
          onRemoveTerms={onRemoveTerms}
        />
      </Space>

      <Modal
        footer={false}
        open={termsOpen}
        onCancel={() => setTermsOpen(false)}
        title="All Ignored Terms"
      >
        <TermsList
          terms={terms}
          onSearch={(search) => {
            onSearch(search);
            setTermsOpen(false);
          }}
          onRemove={(term) => onRemoveTerms([term])}
        />
      </Modal>
    </>
  );
}
