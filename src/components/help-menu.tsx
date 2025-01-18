import { useHotkey } from "@/utils/use-hotkey";
import {
  BarChart3Icon,
  BookOpenIcon,
  CircleHelpIcon,
  KeyboardIcon,
} from "lucide-react";
import { Fragment, useCallback, useState } from "react";
import { Link } from "wouter";
import css from "./help-menu.module.css";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import { DropdownButton, DropdownMenu } from "./ui/dropdown-menu";
import { Keybind } from "./ui/hotkey";
import { Modal, ModalContent } from "./ui/modal";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const SHORTCUTS: [string, { keybind: string; description: string }[]][] = [
  [
    "General",
    [
      { keybind: "?", description: "Show keyboard shortcuts" },
      { keybind: "escape", description: "Close modal" },
    ],
  ],
  ["Deck collection", [{ keybind: "n", description: "Create new deck" }]],
  [
    "Deck editor",
    [
      { keybind: "c", description: "Card list" },
      { keybind: "r", description: "Recommendations" },
      { keybind: "t", description: "Deck tools" },
      { keybind: "d", description: "Cycle deck lists" },
      { keybind: "m", description: "Deck meta" },
      { keybind: "cmd+s", description: "Save deck" },
      { keybind: "cmd+shift+s", description: "Save deck (& stay on page)" },
      { keybind: "cmd+backspace", description: "Discard edits" },
      {
        keybind: "cmd+shift+backspace",
        description: "Discard edits (& stay on page)",
      },
    ],
  ],
  [
    "Card list",
    [
      { keybind: "/", description: "Focus search" },
      { keybind: "alt+f", description: "Toggle filters" },
      { keybind: "alt+shift+f", description: "Reset filters" },
      { keybind: "alt+1", description: "Toggle sidebar" },
      { keybind: "alt+2", description: "Toggle filters" },
      { keybind: "alt+p", description: "Show player cards" },
      { keybind: "alt+c", description: "Show campaign cards" },
      { keybind: "alt+u", description: "Show unusable cards" },
      { keybind: "alt+l", description: "Display as list" },
      { keybind: "alt+shift+l", description: "Display as list with card text" },
      { keybind: "alt+d", description: "Display as detailed cards" },
      { keybind: "alt+s", description: "Display as scans" },
    ],
  ],
  [
    "Card list (search focused)",
    [
      { keybind: "arrowup", description: "Move up" },
      { keybind: "arrowdown", description: "Move down" },
      { keybind: "enter", description: "Open card modal (focused card)" },
      { keybind: "cmd+backspace", description: "Clear search" },
      { keybind: "escape", description: "Unfocus search" },
    ],
  ],
  [
    "Card modal",
    [
      { keybind: "a", description: "Edit annotation" },
      { keybind: "arrowright", description: "Increment deck quantity" },
      { keybind: "arrowleft", description: "Decrement deck quantity" },
      {
        keybind: "shift+arrowright",
        description: "Increment side deck quantity",
      },
      {
        keybind: "shift+arrowleft",
        description: "Decrement side deck quantity",
      },
      { keybind: "0..9", description: "Set deck quantity to x" },
      { keybind: "shift+0..9", description: "Set side deck quantity to x" },
    ],
  ],
  [
    "Deck view",
    [
      { keybind: "d", description: "Deck list" },
      { keybind: "n", description: "Deck notes" },
      { keybind: "r", description: "Recommendations" },
      { keybind: "t", description: "Deck tools" },
      { keybind: "h", description: "Upgrade history" },
      { keybind: "e", description: "Edit deck" },
      { keybind: "u", description: "Upgrade deck" },
      { keybind: "cmd+d", description: "Duplicate deck" },
      { keybind: "cmd+shift+j", description: "Export JSON" },
      { keybind: "cmd+shift+t", description: "Export text" },
      { keybind: "cmd+backspace", description: "Delete deck" },
      { keybind: "cmd+shift+backspace", description: "Delete upgrade" },
      { keybind: "cmd+i", description: "Import deck" },
    ],
  ],
  [
    "Upgrade modal",
    [
      { keybind: "cmd+enter", description: "Save upgrade (& edit)" },
      { keybind: "cmd+shift+enter", description: "Save upgrade (& close)" },
    ],
  ],
];

export function HelpMenu() {
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false);

  const toggleKeyboardShortcuts = useCallback(
    () => setKeyboardShortcutsOpen((prev) => !prev),
    [],
  );

  const closeKeyboardShortcuts = useCallback(
    () => setKeyboardShortcutsOpen(false),
    [],
  );

  useHotkey("?", toggleKeyboardShortcuts);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button tooltip="Help" variant="bare">
            <CircleHelpIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <DropdownMenu>
            <Link asChild href="~/about">
              <DropdownButton
                as="a"
                className={css["about"]}
                data-testid="masthead-about"
              >
                <BookOpenIcon /> About this site
              </DropdownButton>
            </Link>
            <Link asChild href="~/collection-stats">
              <DropdownButton as="a" variant="bare" size="full">
                <BarChart3Icon /> Collection stats
              </DropdownButton>
            </Link>
            <DropdownButton
              className={css["action-shortcuts"]}
              hotkey="?"
              onClick={toggleKeyboardShortcuts}
            >
              <KeyboardIcon /> Keyboard shortcuts
            </DropdownButton>
          </DropdownMenu>
        </PopoverContent>
      </Popover>
      <Dialog
        open={keyboardShortcutsOpen}
        onOpenChange={toggleKeyboardShortcuts}
      >
        <DialogContent>
          <Modal
            onClose={closeKeyboardShortcuts}
            open={keyboardShortcutsOpen}
            size="60rem"
          >
            <ModalContent title="Keyboard shortcuts">
              <div className={css["groups"]}>
                {SHORTCUTS.map(([category, shortcuts]) => (
                  <article className={css["group"]} key={category}>
                    <header className={css["group-header"]}>
                      <h2 className={css["group-title"]}>{category}</h2>
                    </header>
                    <dl className={css["shortcuts"]}>
                      {shortcuts.map(({ keybind, description }) => (
                        <Fragment key={keybind}>
                          <dt className={css["shortcut-keybind"]}>
                            <Keybind keybind={keybind} />
                          </dt>
                          <dd className={css["shortcut-description"]}>
                            {description}
                          </dd>
                        </Fragment>
                      ))}
                    </dl>
                  </article>
                ))}
              </div>
            </ModalContent>
          </Modal>
        </DialogContent>
      </Dialog>
    </>
  );
}
