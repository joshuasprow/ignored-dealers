import { Tag } from "antd";
import useTerms from "../hooks/use-terms";
import { Term, TermKind } from "../lib/terms";

const { CheckableTag } = Tag;

type Props = {
  terms: Map<string, TermKind>;
  term: Term;
  hasTitle?: boolean;
};

export default function DealerTermToggle({ terms, term }: Props) {
  const { add, remove } = useTerms();

  const ignored = terms.has(term.term);

  const handleClick = () => {
    if (ignored) {
      remove([term]);
    } else {
      add([term]);
    }
  };

  return (
    <CheckableTag
      checked={ignored}
      style={{
        maxWidth: "18ch",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textAlign: "center",
        textOverflow: "ellipsis",
        width: "100%",
      }}
      onClick={handleClick}
    >
      {term.term}
    </CheckableTag>
  );
}
