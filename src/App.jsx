import React, { useState } from "react";
import StepIndicator from "./components/StepIndicator.jsx";
import FileUpload from "./components/FileUpload.jsx";
import "./App.css";
import ConfigureAPI from "./components/ConfigureAPI.jsx";

function App() {
  const [step, setStep] = useState(1);
  const [buId, setBuId] = useState("");
  const [token, setToken] = useState("");
  const [baseURL, setBaseURL] = useState("");

  const handleValidationSuccess = () => {
    setStep(2);
  };

  return (
    <div className="app-container">
      <h1>Route 101 Calabrio Holiday Importer</h1>
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <FileUpload
          buId={buId}
          token={token}
          baseURL={baseURL}
          onValidationSuccess={handleValidationSuccess}
        />
      )}

      {step === 2 && (
        <ConfigureAPI
          onBUSelected={setBuId}
          onTokenChange={setToken}
          onBaseURLChange={setBaseURL}
        />
      )}
    </div>
  );
}

export default App;
