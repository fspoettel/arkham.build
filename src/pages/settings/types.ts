import type { SettingsState } from "@/store/slices/settings.types";

export type SettingProps = {
  settings: SettingsState;
  updateSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
};
