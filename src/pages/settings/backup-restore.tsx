import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";
import { useToast } from "@/components/ui/toast.hooks";
import { useStore } from "@/store";
import { assert } from "@/utils/assert";
import { AlertTriangleIcon } from "lucide-react";
import { useCallback } from "react";
import css from "./backup-restore.module.css";

export function BackupRestore() {
  const toast = useToast();
  const backup = useStore((state) => state.backup);
  const restore = useStore((state) => state.restore);

  const onRestore = useCallback(
    async (evt: React.ChangeEvent<HTMLInputElement>) => {
      const confirmed = confirm(
        "Are you sure you want to restore this backup? Any existing data will be overwritten.",
      );

      if (!confirmed) {
        return;
      }

      try {
        const file = evt.target.files?.[0];
        assert(file, "No file selected");
        await restore(file);
        toast.show({
          duration: 3000,
          children: "Backup restore successful.",
          variant: "success",
        });
      } catch (err) {
        toast.show({
          children: `Could not restore backup: ${(err as Error).message}`,
          variant: "error",
        });
      }
    },
    [restore, toast],
  );

  return (
    <Field
      bordered
      helpText={
        <>
          <p>
            Create a backup of your settings, decks and card collection as a
            JSON file. You can use this file to restore your data on this device
            or another device.
          </p>
          <p>
            <AlertTriangleIcon className="icon-inline" /> When a backup is
            restored, <strong>any existing data will be overwritten.</strong>
          </p>
        </>
      }
    >
      <div className={css["actions"]}>
        <Button onClick={backup} type="button">
          Create backup
        </Button>
        <FileInput
          accept="application/json"
          id="settings-restore"
          onChange={onRestore}
        >
          Restore backup
        </FileInput>
      </div>
    </Field>
  );
}
