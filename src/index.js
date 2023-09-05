import React from "react";
import { createRoot } from "react-dom/client";
import AudioRecorder from "./App";

function App() {
  return (
    <div>
      <h1> Hi Brendan </h1>
      <AudioRecorder />
    </div>
  );
}

// ReactDOM.render(<App />, document.getElementById("root"));

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<App />);
