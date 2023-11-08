import { AutoComplete, Table, Tag, Transfer } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { ColumnsType } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import { TransferProps } from "antd/es/transfer";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useState } from "react";
import type { Dealer } from "../lib/dealers";

export const getStaticProps: GetStaticProps<{
  dealers: Dealer[];
}> = async () => {
  const res = await fetch("http://localhost:3000/api/dealers");
  const dealers = await res.json();

  return { props: { dealers } };
};

type DealerOptionType<O = DefaultOptionType> = O &
  Pick<Dealer, "search_string">;

function DealerOption({ dealer }: { dealer: Dealer }) {
  return (
    <div style={{ fontSize: "0.75rem" }}>
      <p style={{ display: "flex" }}>
        <Tag>{dealer.seller_id}</Tag>
        <Tag>{dealer.name}</Tag>
        <Tag>{dealer.phone_number}</Tag>
        <span>{dealer.location}</span>
      </p>
    </div>
  );
}

function filterOption(inputValue: string, option?: DealerOptionType | Dealer) {
  if (!option) return false;

  return option.search_string.includes(inputValue.toLowerCase());
}

function DealerSearch({ dealers }: { dealers: Dealer[] }) {
  return (
    <AutoComplete<number, DealerOptionType>
      allowClear
      filterOption={filterOption}
      options={dealers.map((d) => ({
        label: <DealerOption dealer={d} />,
        search_string: d.search_string,
        value: d.search_string,
      }))}
      onSelect={(value, option) => {
        console.log(value, option);
      }}
      placeholder="Search"
      showSearch
      style={{ width: "100%" }}
    />
  );
}

function DealerTransfer({ dealers }: { dealers: Dealer[] }) {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  return (
    <Transfer
      dataSource={dealers}
      listStyle={{ width: "90vw", height: "80vh", minHeight: 400 }}
      onChange={(_targetKeys, direction, moveKeys) => {
        console.log({ targetKeys, direction, moveKeys });
        setTargetKeys(_targetKeys);
      }}
      render={(row) => (
        <span
          style={{
            display: "block",
            maxWidth: "40vw",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {`${row.seller_id} - ${row.name} - ${row.phone_number}`}
        </span>
      )}
      rowKey={(row) => row.search_string}
      showSearch
      showSelectAll={false}
      filterOption={filterOption}
      targetKeys={targetKeys}
    />
  );
}

type TableTransferProps = Pick<
  TransferProps<Dealer>,
  "dataSource" | "targetKeys" | "onChange"
> & {
  dataSource: Dealer[];
  leftColumns: ColumnsType<Dealer>;
  rightColumns: ColumnsType<Dealer>;
};

const DealerTableTransfer = ({
  dataSource,
  leftColumns,
  rightColumns,
  targetKeys,
  onChange,
}: TableTransferProps) => (
  <Transfer<Dealer>
    dataSource={dataSource}
    filterOption={(value, option) =>
      option.search_string.includes(value.toLowerCase())
    }
    rowKey={(row) => row.search_string}
    showSearch
    showSelectAll={false}
    onChange={onChange}
    targetKeys={targetKeys}
  >
    {({
      direction,
      filteredItems,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      return (
        <Table
          columns={direction === "left" ? leftColumns : rightColumns}
          dataSource={filteredItems}
          onRow={({ search_string }) => ({
            onClick: () => {
              if (listDisabled) return;

              onItemSelect(
                search_string,
                !listSelectedKeys.includes(search_string),
              );
            },
          })}
          rowKey={(row) => row.search_string}
          rowSelection={{
            hideSelectAll: true,
            getCheckboxProps: (item) => ({
              disabled: listDisabled,
            }),
            onSelect({ search_string }, selected) {
              onItemSelect(search_string, selected);
            },
            selectedRowKeys: listSelectedKeys,
          }}
          scroll={{ x: "auto", y: "400px" }}
          size="small"
          style={{ pointerEvents: listDisabled ? "none" : undefined }}
        />
      );
    }}
  </Transfer>
);

const leftTableColumns: ColumnsType<Dealer> = [
  {
    dataIndex: "seller_id",
    title: "ID",
  },
  {
    dataIndex: "name",
    title: "Name",
    render: (name) => (
      <Tag
        style={{
          maxWidth: "30ch",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
        title={name}
      >
        {name}
      </Tag>
    ),
  },
  {
    dataIndex: "phone_number",
    title: "Phone",
  },
];

const rightTableColumns: ColumnsType<Dealer> = [
  {
    dataIndex: "seller_id",
    title: "ID",
  },
  {
    dataIndex: "name",
    title: "Name",
    render: (name) => (
      <Tag
        style={{
          maxWidth: "30ch",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
        title={name}
      >
        {name}
      </Tag>
    ),
  },
  {
    dataIndex: "phone_number",
    title: "Phone",
  },
];

export default function IndexPage({
  dealers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  const handleChange = (nextTargetKeys: string[]) =>
    setTargetKeys((prev) => {
      console.log({ prev: prev.length, next: nextTargetKeys.length });
      return nextTargetKeys;
    });

  return (
    <DealerTableTransfer
      dataSource={dealers}
      leftColumns={leftTableColumns}
      rightColumns={rightTableColumns}
      targetKeys={targetKeys}
      onChange={handleChange}
    />
  );
}
