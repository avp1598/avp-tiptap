import { useState } from "react";
import Editor from "../lib/Editor";
import "../lib/Editor.css";
import CommandList from "../lib/Utils/SlashCommand/CommandList";
import { SlashCommands } from "../lib/Utils/SlashCommand/constants";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <div className="App">
      <button
        onClick={() => {
          const root = document.documentElement;

          if (theme === "dark") {
            setTheme("light");
            // change css variables
            root.style.setProperty(
              "--editor-menu-item-text",
              "rgb(25, 25, 25)"
            );
            root.style.setProperty(
              "--editor-menu-item-hover",
              "rgb(235,235,235)"
            );
            root.style.setProperty(
              "--editor-menu-background",
              "rgb(255, 255, 255)"
            );
            root.style.setProperty(
              "--editor-menu-box-shadow",
              "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px"
            );
            root.style.setProperty("--editor-divider", "rgb(0, 0, 0,0.1)");
            root.style.setProperty(
              "--editor-list-checked-text",
              "rgb(170, 170, 170)"
            );
            root.style.setProperty(
              "--editor-code-background",
              "rgb(255, 255, 255)"
            );
            root.style.setProperty("--app-background", "rgb(235, 235, 235)");
            root.style.setProperty("--app-color", "rgb(25, 25, 25)");
          } else {
            setTheme("dark");
            // change css variables
            root.style.setProperty(
              "--editor-menu-item-text",
              "rgb(213, 213, 213)"
            );
            root.style.setProperty(
              "--editor-menu-item-hover",
              "rgb(49, 49, 49)"
            );
            root.style.setProperty(
              "--editor-menu-background",
              "rgb(37, 37, 37)"
            );
            root.style.setProperty(
              "--editor-menu-box-shadow",
              "rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.2) 0px 3px 6px, rgba(15, 15, 15, 0.4) 0px 9px 24px"
            );
            root.style.setProperty(
              "--editor-divider",
              "rgba(255, 255, 255, 0.1)"
            );
            root.style.setProperty(
              "--editor-list-checked-text",
              "rgb(97, 97, 97)"
            );
            root.style.setProperty(
              "--editor-code-background",
              "rgba(97, 97, 97, 0.1)"
            );
            root.style.setProperty("--app-background", "rgb(25, 25, 25)");
            root.style.setProperty("--app-color", "rgba(255, 255, 255, 0.7)");
          }
        }}
      >
        Switch theme
      </button>
      <Editor
        value="<p>hello world</p>"
        onChange={(value) => console.log(value)}
        onReady={() => console.log("ready")}
        onBlur={() => console.log("blur")}
        onFocus={() => console.log("focus")}
      />
      <div
        style={{
          display: "none",
        }}
      >
        <CommandList
          items={SlashCommands[0]?.commands || []}
          command={(item) => item.command()}
        />
      </div>
    </div>
  );
}

export default App;
