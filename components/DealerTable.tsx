import { Button, Table, type TableProps } from "antd";
import { ColumnsType } from "antd/es/table";
import { Dealer } from "../lib/dealers";
import { Term, TermKind } from "../lib/terms";
import RowCheckbox from "./RowCheckbox";

type Props = {
  dealers: TableProps<Dealer>["dataSource"];
  ignoredTerms: Map<string, TermKind>;
  onAddTerm: (term: Term) => void;
  onRemoveTerm: (term: Term) => void;
};

function ColumnButton({
  hasTitle,
  ignoredTerms,
  term,
  onAddTerm,
  onRemoveTerm,
}: Omit<Props, "dealers"> & {
  hasTitle?: boolean;
  term: Term;
}) {
  const ignored = ignoredTerms.has(term.term);

  return (
    <Button
      size="small"
      title={hasTitle ? term.term : undefined}
      type={ignored ? "primary" : undefined}
      onClick={() => (ignored ? onRemoveTerm(term) : onAddTerm(term))}
    >
      <span
        style={{
          maxWidth: "30ch",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {term.term}
      </span>
    </Button>
  );
}

export default function DealerTable({
  dealers,
  ignoredTerms,
  onAddTerm,
  onRemoveTerm,
}: Props) {
  const columns: ColumnsType<Dealer> = [
    {
      key: "checkbox",
      render: (_, dealer) => {
        return (
          <RowCheckbox
            dealer={dealer}
            ignoredTerms={ignoredTerms}
            onAddTerm={onAddTerm}
            onRemoveTerm={onRemoveTerm}
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
          onAddTerm={onAddTerm}
          onRemoveTerm={onRemoveTerm}
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
          onAddTerm={onAddTerm}
          onRemoveTerm={onRemoveTerm}
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
          onAddTerm={onAddTerm}
          onRemoveTerm={onRemoveTerm}
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
      scroll={{ y: 400 }}
      size="small"
      style={{ maxWidth: 600 }}
      pagination={{ pageSize: 50 }}
    />
  );
}
