import {
  DeleteOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Badge, Button, Col, Input, Modal, Row, Space, Typography } from "antd";
import { useState } from "react";
import DealerTable from "../components/DealerTable";
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
            allowClear
            placeholder="Filter Dealers"
            type="text"
            onChange={(e) => onSearch(e.currentTarget.value)}
            style={{ minWidth: "50ch" }}
            value={search}
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
        <Space direction="vertical">
          {Array.from(terms.entries()).map(([value, kind]) => (
            <Row key={value} justify="space-between">
              <Col style={{ marginRight: "0.5rem" }}>
                <Button
                  size="small"
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={() => {
                    onSearch(value);
                    setTermsOpen(false);
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
                    onRemoveTerms([{ term: value, kind }]);
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
