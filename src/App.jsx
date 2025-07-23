import React from "react";
import StepIndicator from "./components/StepIndicator.jsx";
import FileUpload from "./components/FileUpload.jsx";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <h1>Holiday Checker</h1>
      <StepIndicator />
      <FileUpload />
    </div>
  );
}

export default App;
