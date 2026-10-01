import React from 'react';
import { StepIndicator } from '../components/StepIndicator';
import { usePipelineStatus } from '../hooks/usePipelineStatus';

export const StageIndicator: React.FC = () => {
  const { stages } = usePipelineStatus();
  return <StepIndicator stages={stages} />;
};
