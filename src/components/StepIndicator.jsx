import React from 'react'
import './StepIndicator.css'

function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: 'Upload CSV' },
    { number: 2, label: 'Configure API' },
    { number: 3, label: 'Process Data' },
    { number: 4, label: 'Results' }
  ];

  return (
    <div className="step-indicator">
      {steps.map((step) => (
        <div 
          key={step.number}
          className={`step ${currentStep === step.number ? 'active' : ''}`}
        >
          {step.number}<br />{step.label}
        </div>
      ))}
    </div>
  )
}

export default StepIndicator
