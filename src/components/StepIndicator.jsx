import React from 'react'
import './StepIndicator.css'

function StepIndicator() {
  return (
    <div className="step-indicator">
      <div className="step active">1<br />Upload CSV</div>
      <div className="step">2<br />Configure API</div>
      <div className="step">3<br />Process Data</div>
      <div className="step">4<br />Results</div>
    </div>
  )
}

export default StepIndicator
