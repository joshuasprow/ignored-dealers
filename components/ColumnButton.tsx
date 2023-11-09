import { Button, Table, type TableProps } from "antd";
import { ColumnsType } from "antd/es/table";
import { Dealer } from "../lib/dealers";
import { Term, TermKind } from "../lib/terms";
import RowCheckbox from "./RowCheckbox";

type Props = {
  ignoredTerms: Map<string, TermKind>;
  term: Term;
  hasTitle?: boolean;
  onAddTerms: (terms: Term[]) => void;
  onRemoveTerms: (terms: Term[]) => void;
};

export default function ColumnButton({
  ignoredTerms,
  term,
  hasTitle,
  onAddTerms,
  onRemoveTerms,
}: Props) {
  const ignored = ignoredTerms.has(term.term);

  return (
    <Button
      size="small"
      title={hasTitle ? term.term : undefined}
      type={ignored ? "primary" : undefined}
      onClick={() => (ignored ? onRemoveTerms([term]) : onAddTerms([term]))}
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
