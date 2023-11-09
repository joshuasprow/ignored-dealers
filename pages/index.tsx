import {
  DeleteOutlined,
  LoadingOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Badge, Button, Col, Input, Modal, Row, Space, Typography } from "antd";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useState } from "react";
import DealerTable from "../components/DealerTable";
import type { Dealer } from "../lib/dealers";
import { Term, TermKind } from "../lib/terms";

const { Text } = Typography;

export const getStaticProps: GetStaticProps<{
  dealers: Dealer[];
  terms: Term[];
}> = async () => {
  const [dealers, terms] = await Promise.all([
    fetch("http://localhost:3000/api/dealers").then((res) => res.json()),
    fetch("http://localhost:3000/api/terms").then((res) => res.json()),
  ]);

  return { props: { dealers, terms } };
};

export default function IndexPage({
  dealers,
  terms,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(dealers);
  const [ignoredTerms, setIgnoredTerms] = useState<Map<string, TermKind>>(
    new Map(terms.map(({ term: value, kind }) => [value, kind])),
  );
  const [ignoredTermsOpen, setIgnoredTermsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQueryChange = (query: string) => {
    setFiltered(() =>
      dealers.filter((d) =>
        d.query.includes(query.toLowerCase().replaceAll(" ", "")),
      ),
    );
    setQuery(query);
  };

  const handleAddTerms = async (terms: Term[]) => {
    setLoading(true);

    const res = await fetch("api/terms", {
      method: "POST",
      body: JSON.stringify(terms),
    });
    const json = await res.json();

    console.log("add term:", json);

    setIgnoredTerms((prev) => {
      for (const term of terms) {
        prev.set(term.term, term.kind);
      }
      return new Map(prev);
    });

    setLoading(false);
  };

  const handleRemoveTerms = async (terms: Term[]) => {
    setLoading(true);

    const res = await fetch("api/terms", {
      method: "POST",
      body: JSON.stringify(terms),
    });
    const json = await res.json();

    console.log("remove term:", json);

    setIgnoredTerms((prev) => {
      for (const term of terms) {
        prev.delete(term.term);
      }
      return new Map(prev);
    });

    setLoading(false);
  };

  return (
    <>
      <Space direction="vertical" style={{ padding: "0.5rem 0 0 0" }}>
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
          <LoadingOutlined
            style={{ visibility: loading ? undefined : "hidden" }}
          />
        </Space>
        <DealerTable
          dealers={filtered}
          ignoredTerms={ignoredTerms}
          onAddTerms={handleAddTerms}
          onRemoveTerms={handleRemoveTerms}
        />
      </Space>

      <Modal
        footer={false}
        open={ignoredTermsOpen}
        onCancel={() => setIgnoredTermsOpen(false)}
        title="All Ignored Terms"
      >
        <Space direction="vertical">
          {Array.from(ignoredTerms.entries()).map(([value, kind]) => (
            <Row key={value} justify="space-between">
              <Col style={{ marginRight: "0.5rem" }}>
                <Button
                  size="small"
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => {
                    handleQueryChange(value);
                    setIgnoredTermsOpen(false);
                  }}
                />
              </Col>
              <Col style={{ marginRight: "auto" }}>
                <Text>{value}</Text>
              </Col>
              <Col style={{ marginLeft: "0.5rem" }}>
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    handleRemoveTerms([{ term: value, kind }]);
                  }}
                />
              </Col>
            </Row>
          ))}
        </Space>
      </Modal>
    </>
  );
}
