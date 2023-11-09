import {
  DeleteOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Badge, Button, Input, List, Modal, Space } from "antd";
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
  const [ignoredTermsOpen, setIgnoredTermsOpen] = useState(false);

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
      <Space direction="vertical">
        <Space>
          <Input
            allowClear
            placeholder="Filter Dealers"
            type="text"
            onChange={(e) => handleQueryChange(e.currentTarget.value)}
            style={{ minWidth: "50ch" }}
            value={query}
          />
          <Badge color="blue" count={ignoredTerms.size}>
            <Button
              disabled={!ignoredTerms.size}
              icon={<UnorderedListOutlined />}
              onClick={() => setIgnoredTermsOpen(true)}
            />
          </Badge>
        </Space>
        <DealerTable
          dealers={filtered}
          ignoredTerms={ignoredTerms}
          onAddTerm={handleAddTerm}
          onRemoveTerm={handleRemoveTerm}
        />
      </Space>

      <Modal
        footer={false}
        open={ignoredTermsOpen}
        onCancel={() => setIgnoredTermsOpen(false)}
        title="All Ignored Terms"
      >
        <List>
          {Array.from(ignoredTerms).map((term) => (
            <List.Item key={term}>
              <Space>
                <Button
                  size="small"
                  icon={<SearchOutlined />}
                  onClick={() => {
                    handleQueryChange(term);
                    setIgnoredTermsOpen(false);
                  }}
                />
                <span>{term}</span>
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    handleRemoveTerm(term);
                  }}
                />
              </Space>
            </List.Item>
          ))}
        </List>
      </Modal>
    </>
  );
}
