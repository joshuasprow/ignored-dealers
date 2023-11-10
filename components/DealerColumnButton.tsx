import { Button, Tag } from "antd";
import { Term, TermKind } from "../lib/terms";
import { presetPrimaryColors } from "@ant-design/colors";

const { CheckableTag } = Tag;

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
    <CheckableTag
      style={{
        maxWidth: "18ch",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textAlign: "center",
        textOverflow: "ellipsis",
        width: "100%",
      }}
      checked={ignored}
      onClick={() => (ignored ? onRemoveTerms([term]) : onAddTerms([term]))}
    >
      {term.term}
    </CheckableTag>
  );
}
