import type {
  TabsProps as RootProps,
  TabsContentProps,
  TabsListProps,
  TabsTriggerProps,
} from "@radix-ui/react-tabs";
import { Content, List, Root, Trigger } from "@radix-ui/react-tabs";
import clsx from "clsx";
import { type ReactNode, useMemo } from "react";

import css from "./tabs.module.css";

import { Button } from "./button";

type TabsProps = RootProps & {
  children: ReactNode;
  length: number;
};

export function Tabs({ children, className, length, ...rest }: TabsProps) {
  const cssVariables: Record<string, string | number> = useMemo(
    () => ({
      "--length": length,
    }),
    [length],
  );

  return (
    <Root
      {...rest}
      className={clsx(css["tabs"], className)}
      style={cssVariables}
    >
      {children}
    </Root>
  );
}

type ListProps = TabsListProps & {
  children: ReactNode;
};

export function TabsList({ children, className, ...rest }: ListProps) {
  return (
    <List className={clsx(css["tabs-list"], className)} {...rest}>
      {children}
    </List>
  );
}

type TriggerProps = TabsTriggerProps & {
  children: ReactNode;
};

export function TabsTrigger({ children, className, ...rest }: TriggerProps) {
  return (
    <Trigger {...rest} asChild>
      <Button className={clsx(css["tabs-trigger"], className)} size="full">
        {children}
      </Button>
    </Trigger>
  );
}

type ContentProps = TabsContentProps & {
  children: ReactNode;
};

export function TabsContent({ children, className, ...rest }: ContentProps) {
  return (
    <Content className={clsx(css["tabs-content"], className)} {...rest}>
      {children}
    </Content>
  );
}
