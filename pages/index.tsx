import { ClearOutlined } from "@ant-design/icons";
import { Button, Input, Space, Tabs } from "antd";
import { useState } from "react";
import DealerTableNext from "../components/DealerTableNext";
import TermsList from "../components/TermsList";
import useDealers from "../hooks/use-dealers";
import useTerms from "../hooks/use-terms";

type Props = ReturnType<typeof useDealers> & ReturnType<typeof useTerms> & {};

export default function IndexPage() {
  const { dealers, search, onSearch } = useDealers();
  const { terms, onAddTerms, onRemoveTerms } = useTerms();

  const [activeKey, setActiveKey] = useState("all-terms");

  const handleSearch = (s: string) => {
    onSearch(s);
    setActiveKey("dealer-terms");
  };

  return (
    <DealerTableNext
      dealers={dealers}
      terms={terms}
      onAddTerms={onAddTerms}
      onRemoveTerms={onRemoveTerms}
    />
  );
}
