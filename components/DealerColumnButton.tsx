import { Button } from "antd";
import { Term, TermKind } from "../lib/terms";

type Props = {
  terms: Map<string, TermKind>;
  term: Term;
  hasTitle?: boolean;
  onAddTerms: (terms: Term[]) => void;
  onRemoveTerms: (terms: Term[]) => void;
};

export default function DealerColumnButton({
  terms,
  term,
  hasTitle,
  onAddTerms,
  onRemoveTerms,
}: Props) {
  const ignored = terms.has(term.term);

  return (
    <Button
      size="small"
      style={{ width: "100%" }}
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
