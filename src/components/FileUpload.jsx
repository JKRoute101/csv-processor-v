import React, { useState } from "react";
import "./FileUpload.css";
import Papa from "papaparse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

const FileUpload = ({ token, baseURL, buId, onValidationSuccess }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
      setError("");
      setUploadSuccess(true);
    } else {
      setError("Please upload a valid CSV file.");
      setUploadSuccess(false);
    }
  };

  const validateCSV = (csvData) => {
    const requiredFields = [
      "person_code",
      "absence_name",
      "start_date",
      "end_date",
    ];
    const errors = [];

    csvData.forEach((row, index) => {
      requiredFields.forEach((field) => {
        if (!row[field] || row[field].trim() === "") {
          errors.push(`Row ${index + 1}: Missing value for "${field}".`);
        }
      });

      // Date format check (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.startDate)) {
        errors.push(`Row ${index + 1}: Invalid start date format.`);
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.endDate)) {
        errors.push(`Row ${index + 1}: Invalid end date format.`);
      }
    });

    return errors;
  };

  const handleValidate = () => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        if (results.errors.length > 0) {
          setError(`CSV Parsing Error: ${results.errors[0].message}`);
          setParsedData([]);
        } else {
          const validationErrors = validateCSV(results.data);

          console.log("Parsed data:", results.data);
          console.log("Validation errors:", validationErrors);

          if (validationErrors.length > 0) {
            setError(validationErrors.join("\n"));
            setParsedData([]);
          } else {
            setParsedData(results.data);
            setError("");
            console.log("Validation passed, calling onValidationSuccess");
            handleUpload(results.data);
            onValidationSuccess();
          }
        }
      },
    });
  };

  const handleUpload = async (data) => {
    try {
      const token = "YOUR_AUTH_TOKEN";
      const response = await fetch(
        `https://${baseURL}.teleopticloud.com/wfm/holidays`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      setUploadResult(result);
    } catch (err) {
      setError("Upload failed: " + err.message);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  return (
    <div className="upload-and-button">
      {!file ? (
        <div className="upload-container">
          <label htmlFor="file-upload" className="upload-box">
            <div className="upload-icon">
              <FontAwesomeIcon
                icon={faCloudUploadAlt}
                size="1x"
                color="#59b5ce"
              />
            </div>
            <p>Upload CSV File</p>
            <p className="instruction">
              Drag and drop or click to select a file
            </p>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              hidden
            />
          </label>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div>
          <p className="file-uploaded">File uploaded ✓</p>
          <button className="choose-new-button" onClick={clearFile}>
            choose new file?
          </button>
        </div>
      )}

      <button className="validate-button" onClick={handleValidate}>
        Validate and Continue
      </button>

      {uploadResult && (
        <div className="success-message">
          Upload successful! {JSON.stringify(uploadResult)}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
