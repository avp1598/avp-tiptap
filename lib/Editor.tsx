import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Commands from "./Utils/SlashCommand/Commands";
import suggestion from "./Utils/SlashCommand/Suggestion";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect } from "react";
import Placeholder from "@tiptap/extension-placeholder";

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme?: "light" | "dark";
  onReady?: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
};

export default ({
  value,
  onChange,
  onReady,
  onBlur,
  onFocus,
  placeholder = "Start typing and enter  for commands",
  theme = "light",
}: EditorProps) => {
  const editor = useEditor({
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
      onChange(editor.getHTML());
    },
    onCreate: () => {
      console.log("editor is ready to use");
      onReady!();
    },
    onBlur: () => {
      console.log("editor lost focus");
      onBlur!();
    },
    onFocus: () => {
      console.log("editor focused");
      onFocus!();
    },
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Commands.configure({
        suggestion,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      // change css variables
      root.style.setProperty("--editor-menu-item-text", "rgb(25, 25, 25)");
      root.style.setProperty("--editor-menu-item-hover", "rgb(235,235,235)");
      root.style.setProperty("--editor-menu-background", "rgb(255, 255, 255)");
      root.style.setProperty(
        "--editor-menu-box-shadow",
        "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px"
      );
      root.style.setProperty("--editor-divider", "rgb(0, 0, 0,0.1)");
      root.style.setProperty(
        "--editor-list-checked-text",
        "rgb(170, 170, 170)"
      );
      root.style.setProperty("--editor-code-background", "rgb(255, 255, 255)");
      root.style.setProperty("--app-background", "rgb(235, 235, 235)");
      root.style.setProperty("--app-color", "rgb(25, 25, 25)");
    } else {
      // change css variables
      root.style.setProperty("--editor-menu-item-text", "rgb(213, 213, 213)");
      root.style.setProperty("--editor-menu-item-hover", "rgb(49, 49, 49)");
      root.style.setProperty("--editor-menu-background", "rgb(37, 37, 37)");
      root.style.setProperty(
        "--editor-menu-box-shadow",
        "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 3px 6px, rgba(15, 15, 15, 0.4) 0px 9px 24px"
      );
      root.style.setProperty("--editor-divider", "rgba(255, 255, 255, 0.1)");
      root.style.setProperty("--editor-list-checked-text", "rgb(97, 97, 97)");
      root.style.setProperty(
        "--editor-code-background",
        "rgba(97, 97, 97, 0.1)"
      );
      root.style.setProperty("--app-background", "rgb(25, 25, 25)");
      root.style.setProperty("--app-color", "rgba(255, 255, 255, 0.7)");
    }
  }, []);

  if (editor) {
    return <EditorContent editor={editor} />;
  }
  return null;
};
