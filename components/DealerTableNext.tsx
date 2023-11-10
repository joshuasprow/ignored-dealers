import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Dealer } from "../lib/dealers";
import { Term, TermKind } from "../lib/terms";
import ColumnButton from "./ColumnButton";

type Props = {
  dealers: Dealer[];
  terms: Map<string, TermKind>;
  onAddTerms: (terms: Term[]) => void;
  onRemoveTerms: (terms: Term[]) => void;
};

type DealerGroup = {
  kind: "name";
  name: string;
  query: string;
  seller_ids: Set<string>;
  phone_numbers: Set<string>;
};

function groupDealersByName(dealers: Dealer[]) {
  const groups = new Map<string, DealerGroup>();

  for (const dealer of dealers) {
    let group = groups.get(dealer.name);

    if (group) {
      group.seller_ids.add(dealer.seller_id);
      group.phone_numbers.add(dealer.phone_number);
    } else {
      group = {
        kind: "name",
        name: dealer.name,
        query: dealer.query,
        seller_ids: new Set([dealer.seller_id]),
        phone_numbers: new Set([dealer.phone_number]),
      };
    }

    groups.set(dealer.name, group);
  }

  return Array.from(groups.values());
}

export default function DealerTableNext({
  dealers,
  terms,
  onAddTerms,
  onRemoveTerms,
}: Props) {
  const groups = groupDealersByName(dealers);

  const columns: ColumnsType<DealerGroup> = [
    {
      dataIndex: "name",
      title: "Name",
      render: (_, dealer) => (
        <ColumnButton
          hasTitle
          terms={terms}
          term={{ kind: "dealer_name", term: dealer.name }}
          onAddTerms={onAddTerms}
          onRemoveTerms={onRemoveTerms}
        />
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: "34ch",
    },
    {
      dataIndex: "seller_ids",
      title: "IDs",
      render: (_, dealer) =>
        Array.from(dealer.seller_ids).map((seller_id) => (
          <ColumnButton
            key={seller_id}
            terms={terms}
            term={{ kind: "dealer_seller_id", term: seller_id }}
            onAddTerms={onAddTerms}
            onRemoveTerms={onRemoveTerms}
          />
        )),
      width: 64,
    },

    {
      dataIndex: "phone_numbers",
      title: "Phone #s",
      render: (_, dealer) =>
        Array.from(dealer.phone_numbers).map((phone_number) => (
          <ColumnButton
            key={phone_number}
            terms={terms}
            term={{ kind: "dealer_phone_number", term: phone_number }}
            onAddTerms={onAddTerms}
            onRemoveTerms={onRemoveTerms}
          />
        )),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={groups}
      rowKey={(row) => row.query}
      scroll={{ y: "75dvh" }}
      size="small"
      style={{ maxWidth: 600 }}
      pagination={{ pageSize: 50 }}
    />
  );
}
