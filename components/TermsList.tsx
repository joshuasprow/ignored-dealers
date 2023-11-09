import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Typography } from "antd";
import type { Term, TermKind } from "../lib/terms";

const { Text } = Typography;

type Props = {
  terms: Map<string, TermKind>;
  onSearch: (search: string) => void;
  onRemove: (term: Term) => void;
};

export default function TermsList({ terms, onSearch, onRemove }: Props) {
  return (
    <Space direction="vertical">
      {Array.from(terms.entries()).map(([term, kind]) => (
        <Row key={term} justify="space-between">
          <Col style={{ marginRight: "0.5rem" }}>
            <Button
              size="small"
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => {
                onSearch(term);
              }}
            />
          </Col>
          <Col style={{ marginRight: "auto" }}>
            <Text>{term}</Text>
          </Col>
          <Col style={{ marginLeft: "0.5rem" }}>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                onRemove({ term: term, kind });
              }}
            />
          </Col>
        </Row>
      ))}
    </Space>
  );
}
