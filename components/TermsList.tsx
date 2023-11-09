import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, List, Row, Space, Typography } from "antd";
import type { Term, TermKind } from "../lib/terms";

const { Text } = Typography;

type Props = {
  terms: Map<string, TermKind>;
  onSearch: (search: string) => void;
  onRemove: (term: Term) => void;
};

export default function TermsList({ terms, onSearch, onRemove }: Props) {
  return (
    <List>
      {Array.from(terms.entries()).map(([term, kind]) => (
        <List.Item
          key={term}
          actions={[
            <Button
              size="small"
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => {
                onSearch(term);
              }}
            />,
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                onRemove({ term: term, kind });
              }}
            />,
          ]}
        >
          <div style={{ width: "100%" }}>
            <Text type="secondary" style={{ float: "right" }}>
              {kind.replaceAll("dealer_", "")}
            </Text>
            <Text>{term}</Text>
          </div>
        </List.Item>
      ))}
    </List>
  );
}
