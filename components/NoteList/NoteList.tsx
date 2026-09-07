"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";
import toast from "react-hot-toast";
import { deleteNote } from "@/lib/api";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError() {
      toast.error("Couldn't delete the note");
    },
  });

  const handleDelete = (id: string) => {
    mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map((n) => (
        <li key={n.id} className={css.listItem}>
          <h2 className={css.title}>{n.title}</h2>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <Link href={`/notes/${n.id}`} className={css.link}>
              View details
            </Link>
            <button className={css.button} onClick={() => handleDelete(n.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
