import { SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Button, Input, List, Space } from "antd";
import Modal from "antd/es/modal/Modal";
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
            placeholder="Filter Dealers"
            type="text"
            onChange={(e) => handleQueryChange(e.currentTarget.value)}
            value={query}
          />
          <Button
            disabled={!ignoredTerms.size}
            icon={<UnorderedListOutlined />}
            onClick={() => setIgnoredTermsOpen(true)}
          />
        </Space>
        <DealerTable
          dealers={filtered}
          ignoredTerms={ignoredTerms}
          onAddTerm={handleAddTerm}
          onRemoveTerm={handleRemoveTerm}
        />
        <code>{JSON.stringify(Array.from(ignoredTerms))}</code>
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
              <Button
                size="small"
                icon={<SearchOutlined />}
                onClick={() => {
                  handleQueryChange(term);
                  setIgnoredTermsOpen(false);
                }}
              />{" "}
              {term}
            </List.Item>
          ))}
        </List>
      </Modal>
    </>
  );
}
