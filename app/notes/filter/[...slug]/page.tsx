import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes, FIRST_PAGE } from "@/lib/api";

type NotesProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, "", FIRST_PAGE],
    queryFn: () => fetchNotes(tag, "", FIRST_PAGE),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
