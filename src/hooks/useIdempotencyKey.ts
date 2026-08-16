import { useRef, useCallback } from 'react';
import { generateIdempotencyKey } from '../utils/idempotencyUtils';

/**
 * Provides a stable idempotency key for the lifetime of a component,
 * with a manual reset for starting a new logical "attempt".
 */
export function useIdempotencyKey() {
  const keyRef = useRef<string | undefined>(undefined);
  if (!keyRef.current) {
    keyRef.current = generateIdempotencyKey();
  }

  const reset = useCallback(() => {
    keyRef.current = generateIdempotencyKey();
  }, []);

  return { idempotencyKey: keyRef.current, resetIdempotencyKey: reset } as const;
}