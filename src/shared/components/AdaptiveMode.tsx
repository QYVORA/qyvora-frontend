import { useEffect } from 'react';
import { useAdaptiveUi } from '../../core/hooks/useAdaptiveUi';

const AdaptiveMode = () => {
  const { constrainedDevice } = useAdaptiveUi();

  useEffect(() => {
    document.body.dataset.performanceMode = constrainedDevice ? 'constrained' : 'standard';
  }, [constrainedDevice]);

  return null;
};

export default AdaptiveMode;
