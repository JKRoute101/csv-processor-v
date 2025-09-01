import React from "react";
import StepIndicator from "./components/StepIndicator.jsx";
import FileUpload from "./components/FileUpload.jsx";
import "./App.css";
import ConfigureAPI from "./components/ConfigureAPI.jsx";

function App() {
  const [buId, setBuId] = useState("");

  return (
    <div className="app-container">
      <h1>Route 101 Calabrio Holiday Importer</h1>
      <StepIndicator />
      <ConfigureAPI onBUSelected={setBuId} />
      <FileUpload buId={buId} />
    </div>
  );
}

export default App;
