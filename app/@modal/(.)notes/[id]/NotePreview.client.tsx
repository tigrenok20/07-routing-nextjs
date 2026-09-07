"use client";

import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import css from "./NotePreview.page.module.css";

export default function NotePreviewClient() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const close = () => router.back();

  if (isLoading) return <p>Loading, please wait...</p>;

  if (isError || !note) return <p>Something went wrong.</p>;

  return (
    <Modal onClose={close}>
      <div className={css.item}>
        <a href="#" onClick={close}>
          Back
        </a>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{note.createdAt}</p>
      </div>
    </Modal>
  );
}
