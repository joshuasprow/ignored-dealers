import { Table, type TableProps } from "antd";
import { ColumnsType } from "antd/es/table";
import { Dealer } from "../lib/dealers";
import { Term, TermKind } from "../lib/terms";
import ColumnButton from "./ColumnButton";
import RowCheckbox from "./RowCheckbox";

type Props = {
  dealers: TableProps<Dealer>["dataSource"];
  ignoredTerms: Map<string, TermKind>;
  onAddTerms: (terms: Term[]) => void;
  onRemoveTerms: (terms: Term[]) => void;
};

export default function DealerTable({
  dealers,
  ignoredTerms,
  onAddTerms,
  onRemoveTerms,
}: Props) {
  const columns: ColumnsType<Dealer> = [
    {
      key: "checkbox",
      render: (_, dealer) => {
        return (
          <RowCheckbox
            dealer={dealer}
            ignoredTerms={ignoredTerms}
            onAddTerms={onAddTerms}
            onRemoveTerms={onRemoveTerms}
          />
        );
      },
      width: 36,
    },
    {
      dataIndex: "seller_id",
      title: "ID",
      render: (_, dealer) => (
        <ColumnButton
          ignoredTerms={ignoredTerms}
          term={{ kind: "dealer_seller_id", term: dealer.seller_id }}
          onAddTerms={onAddTerms}
          onRemoveTerms={onRemoveTerms}
        />
      ),
      sorter: (a, b) => a.seller_id.localeCompare(b.seller_id),
      width: 64,
    },
    {
      dataIndex: "name",
      title: "Name",
      render: (_, dealer) => (
        <ColumnButton
          hasTitle
          ignoredTerms={ignoredTerms}
          term={{ kind: "dealer_name", term: dealer.name }}
          onAddTerms={onAddTerms}
          onRemoveTerms={onRemoveTerms}
        />
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: "34ch",
    },
    {
      dataIndex: "phone_number",
      title: "Phone",
      render: (_, dealer) => (
        <ColumnButton
          ignoredTerms={ignoredTerms}
          term={{ kind: "dealer_phone_number", term: dealer.phone_number }}
          onAddTerms={onAddTerms}
          onRemoveTerms={onRemoveTerms}
        />
      ),
      sorter: (a, b) => a.phone_number.localeCompare(b.phone_number),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dealers}
      rowKey={(row) => row.query}
      scroll={{ y: "75dvh" }}
      size="small"
      style={{ maxWidth: 600 }}
      pagination={{ pageSize: 50 }}
    />
  );
}
