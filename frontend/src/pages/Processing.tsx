import React from 'react';
import { PipelineStatus } from '../pipeline/PipelineStatus';

export const Processing: React.FC = () => {
  return (
    <div className="w-full py-6 pb-16">
      <PipelineStatus />
    </div>
  );
};
