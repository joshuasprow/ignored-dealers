import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Term, Terms } from "../lib/terms";

const ENDPOINT = "api/terms";
const QUERY_KEY = "terms";

async function getTerms(): Promise<Terms> {
  const res = await fetch(ENDPOINT);
  const json = await res.json();

  const terms: Terms = new Map();

  for (const t of json as Term[]) {
    terms.set(t.term, t.kind);
  }

  return terms;
}

async function addTerms(terms: Term[]) {
  await fetch(ENDPOINT, {
    method: "POST",
    body: JSON.stringify(terms),
  });
}

async function removeTerms(terms: Term[]) {
  await fetch(ENDPOINT, {
    method: "DELETE",
    body: JSON.stringify(terms),
  });
}

export default function useTerms() {
  const client = useQueryClient();

  const get = useQuery<Terms>({
    initialData: new Map(),
    queryFn: getTerms,
    queryKey: [QUERY_KEY],
  });

  const onError = (error: Error) => {
    console.error(error);
  };

  const onSuccess = () => {
    client.invalidateQueries({ queryKey: [QUERY_KEY] });
  };

  const add = useMutation({
    mutationKey: [QUERY_KEY],
    mutationFn: addTerms,
    onError,
    onSuccess,
  });

  const remove = useMutation({
    mutationKey: [QUERY_KEY],
    mutationFn: removeTerms,
    onError,
    onSuccess,
  });

  return {
    terms: get.data,
    loading: add.isPending || remove.isPending,
    add: add.mutate,
    remove: remove.mutate,
  };
}
