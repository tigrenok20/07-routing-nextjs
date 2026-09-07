import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { NoteTagValues, type NoteTag } from "../../types/note";
import { Formik, Form, Field, ErrorMessage } from "formik";
import css from "./NoteForm.module.css";
import toast from "react-hot-toast";
import { createNote } from "@/lib/api";

interface NoteFormProps {
  onClose: () => void;
}

const noteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Name should contain at least 3 letters!")
    .max(50, "Name should contain 50 letters max!")
    .required("Title is required"),
  content: Yup.string().max(500, "Name should contain 500 letters max!"),
  tag: Yup.string().oneOf(NoteTagValues).required(),
});

interface FormValues {
  title: string;
  content: string;
  tag: NoteTag | "";
}

const initialValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
    onError() {
      toast.error("Couldn't create the note");
    },
  });

  const handleSubmit = (formData: FormValues) => {
    mutate({
      title: formData.title,
      content: formData.content,
      tag: formData.tag as NoteTag,
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={noteSchema}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ errors, dirty }) => {
        console.log(errors);
        console.log(dirty);
        return (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field
                type="text"
                name="title"
                id="title"
                className={css.input}
              />
              <ErrorMessage
                name="title"
                className={css.error}
                component="span"
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                as="textarea"
                name="content"
                rows={8}
                id="content"
                className={css.textarea}
              ></Field>
              <ErrorMessage
                name="content"
                className={css.error}
                component="span"
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field as="select" name="tag" id="tag" className={css.input}>
                {NoteTagValues.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="tag" className={css.error} component="span" />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={isPending}
              >
                {isPending ? "Creating" : "Create note"}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
