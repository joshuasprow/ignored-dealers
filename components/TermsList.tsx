import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, List, Row, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import type { Term, TermKind } from "../lib/terms";

const { Text } = Typography;

type Props = {
  terms: Map<string, TermKind>;
  onSearch: (search: string) => void;
  onRemoveTerms: (terms: Term[]) => void;
};

export default function TermsList({ terms, onSearch, onRemoveTerms }: Props) {
  const columns: ColumnsType<Term> = [
    {
      dataIndex: "term",
      title: "Term",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.term.localeCompare(b.term),
    },
    {
      dataIndex: "kind",
      title: "Kind",
      render(_, term) {
        return (
          <Text style={{ wordBreak: "keep-all" }} type="secondary">
            {term.kind.replaceAll("dealer_", "")}
          </Text>
        );
      },
      sorter: (a, b) => a.kind.localeCompare(b.kind),
    },
    {
      key: "search",
      render(_, term) {
        return (
          <Button
            size="small"
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => {
              onSearch(term.term);
            }}
          />
        );
      },
    },
    {
      key: "remove",
      render(_, term) {
        return (
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              onRemoveTerms([term]);
            }}
          />
        );
      },
    },
  ];

  return (
    <Table
      dataSource={Array.from(terms.entries()).map<Term>(([term, kind]) => ({
        kind,
        term,
      }))}
      columns={columns}
      size="small"
      pagination={false}
    />
  );
}
