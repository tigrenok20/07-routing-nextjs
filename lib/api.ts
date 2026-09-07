import axios from "axios";
import type { Note, NoteId } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

const getHeaders = () => ({
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
});

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const FIRST_PAGE = 1;

export const fetchNotes = async (
  search: string,
  page: number,
  perPage: number = 12,
): Promise<FetchNotesResponse> => {
  const { data } = await axios.get<FetchNotesResponse>("/notes", {
    params: { search, page, perPage },
    headers: getHeaders(),
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await axios.get<Note>(`/notes/${id}`, {
    headers: getHeaders(),
  });

  return data;
};

export const createNote = async (
  note: Pick<Note, "title" | "content" | "tag">,
): Promise<Note> => {
  const { data } = await axios.post<Note>("/notes", note, {
    headers: getHeaders(),
  });

  return data;
};

export const deleteNote = async (id: NoteId): Promise<Note> => {
  const { data } = await axios.delete<Note>(`/notes/${id}`, {
    headers: getHeaders(),
  });

  return data;
};
