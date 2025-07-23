import React, { useState } from 'react'
import './FileUpload.css'

const FileUpload = () => {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile)
      setError('')
    } else {
      setError('Please upload a valid CSV file.')
    }
  }

  const handleValidate = () => {
    if (!file) {
      setError('No file selected.')
      return
    }
    alert(`Validating file: ${file.name}`)
  }

  return (
    <div className="upload-container">
      <label htmlFor="file-upload" className="upload-box">
        <div className="upload-icon">☁️</div>
        <p>Upload CSV File</p>
        <p className="instruction">Drag and drop or click to select a file</p>
        <input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} hidden />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="validate-button" onClick={handleValidate}>Validate and Continue</button>
    </div>
  )
}

export default FileUpload
