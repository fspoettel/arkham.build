import { cx } from "@/utils/cx";
import { useHotkey } from "@/utils/use-hotkey";
import type {
  TabsProps as RootProps,
  TabsContentProps,
  TabsListProps,
  TabsTriggerProps,
} from "@radix-ui/react-tabs";
import { Content, List, Root, Trigger } from "@radix-ui/react-tabs";
import { forwardRef, useCallback } from "react";
import { Button } from "./button";
import { HotkeyTooltip } from "./hotkey";
import css from "./tabs.module.css";

type TabsProps = RootProps & {
  children: React.ReactNode;
};

export const Tabs = forwardRef(function Tabs(
  { children, className, ...rest }: TabsProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <Root {...rest} className={cx(css["tabs"], className)} ref={ref}>
      {children}
    </Root>
  );
});

type ListProps = TabsListProps & {
  children: React.ReactNode;
};

export function TabsList({ children, className, ...rest }: ListProps) {
  return (
    <List
      data-testid="tabs-list"
      className={cx(css["list"], className)}
      {...rest}
    >
      {children}
    </List>
  );
}

type TriggerProps = TabsTriggerProps & {
  children: React.ReactNode;
  hotkey?: string;
  tooltip?: string;
  onTabChange?: (value: string) => void;
};

export const TabsTrigger = forwardRef(function TabsTrigger(
  {
    children,
    className,
    hotkey,
    onTabChange,
    tooltip,
    value,
    ...rest
  }: TriggerProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const inner = (
    <Trigger {...rest} asChild value={value}>
      <Button
        className={cx(css["trigger"], className)}
        ref={ref}
        tooltip={hotkey ? undefined : tooltip}
        variant="bare"
      >
        {children}
      </Button>
    </Trigger>
  );

  const onHotkey = useCallback(() => {
    onTabChange?.(value);
  }, [value, onTabChange]);

  useHotkey(hotkey, onHotkey);

  return hotkey ? (
    <HotkeyTooltip keybind={hotkey} description={tooltip ?? value}>
      {inner}
    </HotkeyTooltip>
  ) : (
    inner
  );
});

type ContentProps = TabsContentProps & {
  children: React.ReactNode;
};

export function TabsContent({
  children,
  className,
  forceMount,
  ...rest
}: ContentProps) {
  return (
    <Content
      className={cx(
        css["content"],
        className,
        forceMount != null && css["mounted"],
      )}
      forceMount={forceMount}
      {...rest}
    >
      {children}
    </Content>
  );
}
