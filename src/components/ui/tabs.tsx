import type {
  TabsProps as RootProps,
  TabsContentProps,
  TabsListProps,
  TabsTriggerProps,
} from "@radix-ui/react-tabs";
import { Content, List, Root, Trigger } from "@radix-ui/react-tabs";
import clsx from "clsx";
import { useMemo } from "react";

import css from "./tabs.module.css";

import { Button } from "./button";

type TabsProps = RootProps & {
  children: React.ReactNode;
  length: number;
};

export function Tabs({ children, className, length, ...rest }: TabsProps) {
  const cssVariables = useMemo(
    () => ({
      "--length": length,
    }),
    [length],
  );

  return (
    <Root
      {...rest}
      className={className}
      style={cssVariables as React.CSSProperties}
    >
      {children}
    </Root>
  );
}

type ListProps = TabsListProps & {
  children: React.ReactNode;
};

export function TabsList({ children, className, ...rest }: ListProps) {
  return (
    <List className={clsx(css["list"], className)} {...rest}>
      {children}
    </List>
  );
}

type TriggerProps = TabsTriggerProps & {
  children: React.ReactNode;
};

export function TabsTrigger({ children, className, ...rest }: TriggerProps) {
  return (
    <Trigger {...rest} asChild>
      <Button className={clsx(css["trigger"], className)} size="sm">
        {children}
      </Button>
    </Trigger>
  );
}

type ContentProps = TabsContentProps & {
  children: React.ReactNode;
};

export function TabsContent({ children, className, ...rest }: ContentProps) {
  return (
    <Content className={clsx(css["content"], className)} {...rest}>
      {children}
    </Content>
  );
}
