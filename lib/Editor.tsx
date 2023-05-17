import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Commands from "./Extensions/SlashCommand/Commands";
import suggestion from "./Extensions/SlashCommand/Suggestion";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useEffect } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import { ResizableMedia } from "./Extensions/ResizableMedia";
import Gapcursor from "@tiptap/extension-gapcursor";

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  uploadImage: (file: File) => Promise<string>;
  theme?: "light" | "dark";
  onReady?: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
};

export const Editor = ({
  value,
  onChange,
  onReady,
  onBlur,
  onFocus,
  uploadImage,
  placeholder = "Start typing and enter  for commands",
  theme = "light",
}: EditorProps) => {
  const editor = useEditor({
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onCreate: () => {
      onReady && onReady();
    },
    onBlur: () => {
      onBlur && onBlur();
    },
    onFocus: () => {
      onFocus && onFocus();
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
        placeholder: ({ node, editor }) => {
          if (editor.isEmpty) return placeholder;
          if (node.type.name === "heading") {
            return "Heading";
          } else if (node.type.name === "paragraph") {
            return "Enter / to see commands";
          }
          return placeholder;
        },
      }),
      ResizableMedia.configure({
        uploadFn: async (image) => {
          return await uploadImage(image);
        },
      }),
      Gapcursor,
    ],
    editorProps: {
      handlePaste: function (view, event) {
        const items = Array.from(event.clipboardData?.items || []);
        for (const item of items) {
          if (item.type.indexOf("image") === 0) {
            const file = item.getAsFile();
            if (!file) return false;
            let filesize = parseFloat((file.size / 1024 / 1024).toFixed(4)); // get the filesize in MB
            if (filesize < 10) {
              // check image under 10MB
              // check the dimensions
              let _URL = window.URL || window.webkitURL;
              let img = new Image(); /* global Image */
              img.src = _URL.createObjectURL(file);
              img.onload = function () {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (this.width > 5000 || this.height > 5000) {
                  window.alert(
                    "Your images need to be less than 5000 pixels in height and width."
                  ); // display alert
                } else {
                  // valid image so upload to server
                  // uploadImage will be your function to upload the image to the server or s3 bucket somewhere
                  uploadImage(file)
                    .then(function (response) {
                      const { schema } = view.state;
                      if (!schema.nodes.resizableMedia) return;
                      const node = schema.nodes.resizableMedia.create({
                        src: response,
                        "media-type":
                          file.type.indexOf("image") === 0 ? "img" : "video",
                      });

                      const transaction =
                        view.state.tr.replaceSelectionWith(node);
                      view.dispatch(transaction);
                    })
                    .catch(function (error) {
                      if (error) {
                        window.alert(
                          "There was a problem uploading your image, please try again."
                        );
                      }
                    });
                }
              };
            } else {
              window.alert(
                "Images need to be in jpg or png format and less than 10mb in size."
              );
            }
            return true; // handled
          }
        }
        return false; // not handled use default behaviour
      },
      handleDrop: function (view, event, slice, moved) {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          // if dropping external files
          let file = event.dataTransfer.files[0]; // the dropped file
          let filesize = parseFloat((file.size / 1024 / 1024).toFixed(4)); // get the filesize in MB
          if (
            (file.type === "image/jpeg" || file.type === "image/png") &&
            filesize < 10
          ) {
            // check valid image type under 10MB
            // check the dimensions
            let _URL = window.URL || window.webkitURL;
            let img = new Image();
            img.src = _URL.createObjectURL(file);
            img.onload = function () {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              if (this.width > 5000 || this.height > 5000) {
                window.alert(
                  "Your images need to be less than 5000 pixels in height and width."
                ); // display alert
              } else {
                // valid image so upload to server
                // uploadImage will be your function to upload the image to the server or s3 bucket somewhere
                uploadImage?.(file)
                  .then(function (response) {
                    // response is the image url for where it has been saved
                    // pre-load the image before responding so loading indicators can stay
                    // and swaps out smoothly when image is ready
                    let image = new Image();
                    image.src = response;
                    image.onload = function () {
                      // place the now uploaded image in the editor where it was dropped
                      const { schema } = view.state;
                      if (!schema.nodes.resizableMedia) return;
                      const node = schema.nodes.resizableMedia.create({
                        src: response,
                        "media-type":
                          file.type.indexOf("image") === 0 ? "img" : "video",
                      });

                      const transaction =
                        view.state.tr.replaceSelectionWith(node);
                      view.dispatch(transaction);
                    };
                  })
                  .catch(function (error) {
                    if (error) {
                      window.alert(
                        "There was a problem uploading your image, please try again."
                      );
                    }
                  });
              }
            };
          } else {
            window.alert(
              "Images need to be in jpg or png format and less than 10mb in size."
            );
          }
          return true; // handled
        }
        return false; // not handled use default behaviour
      },
    },
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
  }, [theme]);

  if (editor) {
    return <EditorContent editor={editor} />;
  }
  return null;
};
