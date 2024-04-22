import { useState, useCallback } from 'react';

import useThrottle from './useThrottle';
import useDebounce from './use_debounce';

export default ({
  autoScroll,
  autoScrollAfterUserScroll,
}: {
  autoScroll: boolean;
  autoScrollAfterUserScroll: number;
}) => {
  const [localAutoScroll, setLocalAutoScroll] = useState(autoScroll);
  const resetLocalAutoScroll = useCallback(
    () => setLocalAutoScroll(autoScroll),
    [autoScroll],
  );

  const resetAutoScrollAfterUserScroll = useDebounce(
    () => setLocalAutoScroll(autoScroll),
    autoScrollAfterUserScroll,
  );

  const onScroll = useThrottle(() => {
    setLocalAutoScroll(false);
    resetAutoScrollAfterUserScroll();
  });

  return { localAutoScroll, resetLocalAutoScroll, onScroll };
};