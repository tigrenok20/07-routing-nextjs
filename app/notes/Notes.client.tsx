"use client";

import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes, FIRST_PAGE } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import css from "./Notes.client.module.css";
import NoteList from "@/components/NoteList/NoteList";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

const DEBOUNCE_DELAY_MS = 300;

export default function NotesClient() {
  const [currentPage, setCurrentPage] = useState(FIRST_PAGE);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState<string>("");
  const debounced = useDebouncedCallback((value) => {
    setCurrentPage(FIRST_PAGE);
    setSearch(value);
  }, DEBOUNCE_DELAY_MS);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", search, currentPage],
    queryFn: () => fetchNotes(search, currentPage),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleOpenModal = () => {
    setIsAdding(true);
  };

  const handleCloseModal = () => {
    setIsAdding(false);
  };

  return (
    <>
      <Toaster />
      <section>
        <div className={css.app}>
          <header className={css.toolbar}>
            <SearchBox onChange={debounced} />
            {!!data?.totalPages && data.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={data.totalPages}
              />
            )}
            <button className={css.button} onClick={handleOpenModal}>
              Create note +
            </button>
          </header>
          {isLoading && <Loader />}
          {isError && <ErrorMessage />}
          {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
          {isAdding && (
            <Modal onClose={handleCloseModal}>
              <NoteForm onClose={handleCloseModal} />
            </Modal>
          )}
        </div>
      </section>
    </>
  );
}
