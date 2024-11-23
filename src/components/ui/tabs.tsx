import { cx } from "@/utils/cx";
import type {
  TabsProps as RootProps,
  TabsContentProps,
  TabsListProps,
  TabsTriggerProps,
} from "@radix-ui/react-tabs";
import { Content, List, Root, Trigger } from "@radix-ui/react-tabs";
import { Button } from "./button";
import css from "./tabs.module.css";

type TabsProps = RootProps & {
  children: React.ReactNode;
  length: number;
};

export function Tabs({ children, className, ...rest }: TabsProps) {
  return (
    <Root {...rest} className={cx(css["tabs"], className)}>
      {children}
    </Root>
  );
}

type ListProps = TabsListProps & {
  children: React.ReactNode;
};

export function TabsList({ children, className, ...rest }: ListProps) {
  return (
    <List className={cx(css["list"], className)} {...rest}>
      {children}
    </List>
  );
}

type TriggerProps = TabsTriggerProps & {
  children: React.ReactNode;
  tooltip?: React.ReactNode;
};

export function TabsTrigger({
  children,
  className,
  tooltip,
  ...rest
}: TriggerProps) {
  return (
    <Trigger {...rest} asChild>
      <Button
        className={cx(css["trigger"], className)}
        variant="bare"
        tooltip={tooltip}
      >
        {children}
      </Button>
    </Trigger>
  );
}

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
