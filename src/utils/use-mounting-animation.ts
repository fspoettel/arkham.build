import { useEffect, useState } from "react";

export function useMountTransition(
  shouldBeInDom: boolean, // Are conditions ready for node to mount
  unmountDelay: number, // How long does the mount/unmount animation take to run in ms
) {
  const [inDom, setInDom] = useState(false); // Is clear of animation duties
  const [animating, setAnimating] = useState(false); // Should class responsible for animations be passed to element
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (shouldBeInDom && timeoutId) {
      // If we had an unmount queued, but we should interrupt that, clear the timeout
      clearTimeout(timeoutId);
      setTimeoutId(undefined);
    }

    if (shouldBeInDom && !inDom && !animating) {
      setInDom(true);
    } else if (shouldBeInDom && inDom && !animating) {
      // after we entred the dom,
      // wait for an empty stack, add animation class
      setTimeout(() => setAnimating(true), 0);
    } else if (!shouldBeInDom && animating) {
      // remove animation class, wait for transition to finish, unmount after timeout
      setAnimating(false);
      const newTimeoutId = setTimeout(() => setInDom(false), unmountDelay);
      setTimeoutId(newTimeoutId);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [unmountDelay, shouldBeInDom, animating, inDom, timeoutId]);

  return [inDom, animating];
}
