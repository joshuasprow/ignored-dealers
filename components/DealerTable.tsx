import { Button, Checkbox, Table, type TableProps } from "antd";
import { ColumnsType } from "antd/es/table";
import { Dealer } from "../lib/dealers";

type Props = {
  dealers: TableProps<Dealer>["dataSource"];
  ignoredTerms: Set<string>;
  onAddTerm: (term: string) => void;
  onRemoveTerm: (term: string) => void;
};

function ColumnButton({
  hasTitle,
  ignoredTerms,
  value,
  onAddTerm,
  onRemoveTerm,
}: Omit<Props, "dealers"> & {
  hasTitle?: boolean;
  value: Dealer[keyof Dealer];
}) {
  const ignored = ignoredTerms.has(value);
  return (
    <Button
      size="small"
      title={hasTitle ? value : undefined}
      type={ignored ? "primary" : undefined}
      onClick={() => (ignored ? onRemoveTerm(value) : onAddTerm(value))}
    >
      <span
        style={{
          maxWidth: "30ch",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {value}
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
          <Checkbox
            checked={
              ignoredTerms.has(dealer.seller_id) &&
              ignoredTerms.has(dealer.name) &&
              ignoredTerms.has(dealer.phone_number)
            }
            onChange={(e) => {
              if (e.target.checked) {
                onAddTerm(dealer.seller_id);
                onAddTerm(dealer.name);
                onAddTerm(dealer.phone_number);
              } else {
                onRemoveTerm(dealer.seller_id);
                onRemoveTerm(dealer.name);
                onRemoveTerm(dealer.phone_number);
              }
            }}
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
          value={dealer.seller_id}
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
          value={dealer.name}
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
          value={dealer.phone_number}
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
