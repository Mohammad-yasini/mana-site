"use client";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export function RichPostEditor({ value, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Placeholder.configure({
        placeholder: "متن مطلب را اینجا بنویسید…",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "tiptap-editor-prose",
        dir: "rtl",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  if (!editor) {
    return <p className="text-muted small">در حال بارگذاری ویرایشگر…</p>;
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("آدرس لینک (https://…)", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="blog-rich-editor">
      <div className="btn-group btn-group-sm flex-wrap mb-2" role="toolbar" aria-label="ویرایشگر">
        <button
          type="button"
          className={`btn btn-outline-secondary ${editor.isActive("bold") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          className={`btn btn-outline-secondary ${editor.isActive("italic") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          className={`btn btn-outline-secondary ${editor.isActive("underline") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>
        <button
          type="button"
          className={`btn btn-outline-secondary ${editor.isActive("heading", { level: 2 }) ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={`btn btn-outline-secondary ${editor.isActive("heading", { level: 3 }) ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          type="button"
          className={`btn btn-outline-secondary ${editor.isActive("bulletList") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </button>
        <button
          type="button"
          className={`btn btn-outline-secondary ${editor.isActive("orderedList") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          ۱.
        </button>
        <button
          type="button"
          className={`btn btn-outline-secondary ${editor.isActive("blockquote") ? "active" : ""}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          نقل‌قول
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={setLink}>
          لینک
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          راست
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          وسط
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          هم‌تراز
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          برگردان
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          ازنو
        </button>
      </div>
      <div className="tiptap-editor-content border rounded bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
