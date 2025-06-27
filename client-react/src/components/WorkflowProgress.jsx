import React from 'react';
import * as MUI from '@mui/material';
import { CheckCircle, RadioButtonUnchecked, Error } from '@mui/icons-material';

const steps = [
  { label: 'OPT Receipt', stepOrder: 1 },
  { label: 'OPT EAD', stepOrder: 2 },
  { label: 'I-983', stepOrder: 3 },
  { label: 'I-20', stepOrder: 4 }
];

const WorkflowProgress = ({ workflowData = [] }) => {
  const getStepStatus = (stepOrder) => {
    const stepData = workflowData.find(item => item.stepOrder === stepOrder);
    if (!stepData) return 'not_started';
    return stepData.status;
  };

  const getStepIcon = (stepOrder) => {
    const status = getStepStatus(stepOrder);
    
    switch (status) {
      case 'approved':
        return <CheckCircle color="success" />;
      case 'rejected':
        return <Error color="error" />;
      case 'pending':
        return <RadioButtonUnchecked color="primary" />;
      default:
        return <RadioButtonUnchecked color="disabled" />;
    }
  };

  const getStepColor = (stepOrder) => {
    const status = getStepStatus(stepOrder);
    
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'primary';
      default:
        return 'disabled';
    }
  };

  return (
    <MUI.Box sx={{ width: '100%', mb: 4 }}>
      <MUI.Stepper activeStep={-1} alternativeLabel>
        {steps.map((step) => (
          <MUI.Step key={step.stepOrder}>
            <MUI.StepLabel
              icon={getStepIcon(step.stepOrder)}
              StepIconProps={{
                sx: { color: getStepColor(step.stepOrder) }
              }}
            >
              <MUI.Typography
                variant="body2"
                color={getStepColor(step.stepOrder)}
                sx={{ fontWeight: 'medium' }}
              >
                {step.label}
              </MUI.Typography>
            </MUI.StepLabel>
          </MUI.Step>
        ))}
      </MUI.Stepper>
    </MUI.Box>
  );
};

export default WorkflowProgress; 