import { useCallback, useState } from "react";

import type { Config } from "./confirmation-dialog";
import { ConfirmationDialog } from "./confirmation-dialog";

type Resolver = {
  resolve: (val: boolean) => void;
};

export function useConfirmation() {
  const [config, setConfig] = useState<Config>();
  const [resolver, setResolve] = useState<Resolver>();

  const showConfirmation = useCallback((config: Config) => {
    return new Promise<boolean>((resolve) => {
      setConfig(config);
      setResolve({ resolve });
    });
  }, []);

  const onCancel = useCallback(() => {
    resolver?.resolve(false);
    setConfig(undefined);
    setResolve(undefined);
  }, [resolver]);

  const onConfirm = useCallback(() => {
    resolver?.resolve(true);
    setConfig(undefined);
    setResolve(undefined);
  }, [resolver]);

  const confirmationDialog = config ? (
    <ConfirmationDialog
      config={config}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  ) : null;

  return [confirmationDialog, showConfirmation] as const;
}
