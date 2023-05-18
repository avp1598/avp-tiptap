import "../lib/Editor.css";
import CommandList from "../lib/Extensions/SlashCommand/CommandList";
import { SlashCommands } from "../lib/Extensions/SlashCommand/constants";
import "./App.css";
import { Editor } from "../lib";

function App() {
  return (
    <div className="App">
      <Editor
        theme="dark"
        value={``}
        onChange={(value) => console.log(value)}
        onReady={() => console.log("ready")}
        onBlur={() => console.log("blur")}
        onFocus={() => console.log("focus")}
        placeholder="Enter the description in the richest text possible"
        uploadImage={(file) => {
          console.log({ file });
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve("https://picsum.photos/400/600");
            }, 4000);
          });
        }}
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
