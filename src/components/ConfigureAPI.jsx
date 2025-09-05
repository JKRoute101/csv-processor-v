import React, { useState } from "react";
import "./ConfigureAPI.css";

const ConfigAPI = ({ onBUSelected, onTokenChange, onBaseURLChange }) => {
  const [baseURL, setBaseURL] = useState("");
  const [token, setToken] = useState("");
  const [businessUnits, setBusinessUnits] = useState([]);
  const [selectedBU, setSelectedBU] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://${baseURL}.teleopticloud.com/api/query/BusinessUnit/AllBusinessUnits`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.Result && data.Result.length > 0) {
        setBusinessUnits(data.Result);
        if (data.Result.length === 1) {
          setSelectedBU(data.Result[0].Id);
          onBUSelected(data.Result[0].Id);
        }
      } else {
        setError("No Business Units found.");
      }
    } catch (err) {
      setError("Connection failed. Please check your URL and token.");
    }

    setLoading(false);
  };

  const handleBUChange = (e) => {
    setSelectedBU(e.target.value);
    onBUSelected(e.target.value);
  };

  const handleBaseURLChange = (e) => {
    setBaseURL(e.target.value);
    onBaseURLChange(e.target.value);
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value);
    onTokenChange(e.target.value);
  };

  return (
    <div className="config-api-container">
      <h2>Configure Calabrio API</h2>
      <label>
        WFM Base URL:
        <input
          type="text"
          value={baseURL}
          onChange={handleBaseURLChange}
          placeholder="e.g. mtukso01-30m"
        />
      </label>
      <label>
        Bearer Token:
        <input
          type="text"
          value={token}
          onChange={handleTokenChange}
          placeholder="Paste your token here"
        />
      </label>
      <button onClick={handleTestConnection} disabled={loading}>
        {loading ? "Testing..." : "Test Connection"}
      </button>

      {error && <p className="error">{error}</p>}

      {businessUnits.length > 1 && (
        <div>
          <label>Select Business Unit:</label>
          <select value={selectedBU} onChange={handleBUChange}>
            <option value="">-- Select BU --</option>
            {businessUnits.map((bu) => (
              <option key={bu.Id} value={bu.Id}>
                {bu.Name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ConfigAPI;
