export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export const NoteTagValues = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export type NoteTag = (typeof NoteTagValues)[number];

export type NoteId = Note["id"];
