import { purple } from "@ant-design/colors";
import { ExportOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import usePrices from "../hooks/use-prices";
import { Price } from "../lib/prices";
import { DealerGroup } from "./DealerTable";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
});

const columns: ColumnsType<Price> = [
  {
    dataIndex: "searched_at",
    title: "Searched",
    render: (v) => dateFormatter.format(new Date(v)),
  },
  {
    dataIndex: "part_code",
    title: "Part Code",
  },
  {
    dataIndex: "ic",
    title: "IC",
  },
  {
    dataIndex: "grade",
    title: "Grade",
  },
  {
    dataIndex: "stock_number",
    title: "Stock #",
  },
  {
    dataIndex: "price",
    title: "Price",
  },
];

export default function DealerPrices({ group }: { group: DealerGroup }) {
  const prices = usePrices().get(group.query);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        disabled={!prices?.length}
        size="small"
        style={{
          borderColor: purple.primary,
          color: purple.primary,
          width: "100%",
        }}
        onClick={() => setOpen(true)}
      >
        <Space>
          <ExportOutlined />
          <span>{prices?.length || 0}</span>
        </Space>
      </Button>

      <Modal
        centered
        destroyOnClose
        footer={false}
        open={open}
        onCancel={() => setOpen(false)}
      >
        <Table
          columns={columns}
          dataSource={prices}
          rowKey={(row) => `${row.dealer_query}-${row.stock_number}`}
          size="small"
          pagination={false}
          scroll={{ y: "80vh" }}
        />
      </Modal>
    </>
  );
}
