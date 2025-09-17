import { useState } from "react";
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
    if (!selectedFile) {
      setError("Please select a file to upload");
      setFile(null);
      setUploadSuccess(false);
      return;
    }

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      setFile(null);
      setUploadSuccess(false);
      return;
    }

    setFile(selectedFile);
    setError("");
    setUploadSuccess(true);
  };

  const convertDate = (dateStr) => {
    const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
      const [_, month, day, year] = match;
      const paddedMonth = month.padStart(2, '0');
      const paddedDay = day.padStart(2, '0');
      return `${year}-${paddedMonth}-${paddedDay}`;
    }
    return dateStr;
  };

  const validateCSV = (csvData) => {
    const requiredFields = [
      "person_code",
      "absence_name",
      "start_date",
      "end_date",
    ];
    const errors = [];
    const convertedData = csvData.map(row => ({
      ...row,
      start_date: convertDate(row.start_date),
      end_date: convertDate(row.end_date)
    }));

    convertedData.forEach((row, index) => {
      requiredFields.forEach((field) => {
        if (!row[field] || row[field].trim() === "") {
          errors.push(`Row ${index + 1} is missing the ${field.replace(/_/g, ' ')}`);
        }
      });

      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.start_date)) {
        errors.push(`Row ${index + 1}: Start date must be in the format MM/DD/YYYY`);
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.end_date)) {
        errors.push(`Row ${index + 1}: End date must be in the format MM/DD/YYYY`);
      }
    });

    if (errors.length === 0) {
      csvData.forEach((row, index) => {
        row.start_date = convertedData[index].start_date;
        row.end_date = convertedData[index].end_date;
      });
    }

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
          setError('Invalid file format. Please make sure your CSV file is properly formatted and contains the required columns.');
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
            console.log("Validation passed");
            setParsedData(results.data);
            onValidationSuccess();
          }
        }
      },
    });
  };

  const handleUpload = async (data) => {
    try {
      if (!token || !baseURL) {
        console.log("Token or baseURL not configured yet");
        return;
      }
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
    setError("");
    setUploadSuccess(false);
    setParsedData([]);
  };

  return (
    <div className="upload-and-button">
      <div className="upload-container">
        {!file ? (
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
        ) : (
          <div>
            <p className="file-uploaded">File uploaded ✓</p>
            <button className="choose-new-button" onClick={clearFile}>
              Different File?
            </button>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </div>

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
