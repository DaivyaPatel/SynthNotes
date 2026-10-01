import { useSession } from '../context/SessionContext';
import { PIPELINE_STAGES } from '../utils/constants';

export function usePipelineStatus() {
  const {
    pipelineStage,
    completedStages,
    pipelineProgress,
    pipelineStatusMessage,
    isProcessing,
  } = useSession();

  const stagesWithStatus = PIPELINE_STAGES.map((s) => {
    let status: 'completed' | 'in_progress' | 'pending' = 'pending';
    if (completedStages.includes(s.key)) {
      status = 'completed';
    } else if (pipelineStage === s.key && isProcessing) {
      status = 'in_progress';
    }
    return {
      ...s,
      status,
    };
  });

  return {
    stages: stagesWithStatus,
    currentStage: pipelineStage,
    progress: pipelineProgress,
    statusMessage: pipelineStatusMessage,
    isProcessing,
  };
}
