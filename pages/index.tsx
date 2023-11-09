import {
  DeleteOutlined,
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
    fetch("http://localhost:3000/api/terms", { method: "post" }).then((res) =>
      res.json(),
    ),
    fetch("http://localhost:3000/api/terms", { method: "delete" }).then((res) =>
      res.json(),
    ),
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

  const handleQueryChange = (query: string) => {
    setFiltered(() =>
      dealers.filter((d) =>
        d.query.includes(query.toLowerCase().replaceAll(" ", "")),
      ),
    );
    setQuery(query);
  };

  const handleAddTerm = (term: Term) =>
    setIgnoredTerms((prev) => {
      prev.set(term.term, term.kind);
      return new Map(prev);
    });

  const handleRemoveTerm = (term: Term) =>
    setIgnoredTerms((prev) => {
      prev.delete(term.term);
      return new Map(prev);
    });

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
                    handleRemoveTerm({ term: value, kind });
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
