import {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Content,
  Item,
  ItemText,
  ItemIndicator,
  Viewport,
  Group,
  Label,
  Separator,
  SelectGroupProps,
  SelectItemProps,
  SelectProps,
} from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { ReactNode } from "react";

import css from "./select.module.css";

type Props = SelectProps & {
  children: ReactNode;
  placeholder?: string;
};

export function Select({ children, placeholder, ...rest }: Props) {
  return (
    <Root {...rest}>
      <Trigger className={clsx(css["select-trigger"])}>
        <Value placeholder={placeholder} />
        <Icon className={css["select-trigger-icon"]}>
          <ChevronDownIcon />
        </Icon>
      </Trigger>
      <Portal>
        <Content className={css["select-content"]}>
          <Viewport className={css["select-viewport"]}>{children}</Viewport>
        </Content>
      </Portal>
    </Root>
  );
}

export const SelectSeparator = Separator;

type GroupProps = SelectGroupProps & {
  label: string;
  className?: string;
};

export function SelectGroup({
  children,
  className,
  label,
  ...rest
}: GroupProps) {
  return (
    <Group {...rest}>
      <Label className={clsx(css["select-group-label"], className)}>
        {label}
      </Label>
      {children}
    </Group>
  );
}

type ItemProps = SelectItemProps & {
  children: ReactNode;
  className?: string;
};

export function SelectItem({ children, className, ...rest }: ItemProps) {
  return (
    <Item {...rest} className={clsx(css["select-item"], className)}>
      <ItemIndicator className={css["select-item-indicator"]}>
        <CheckIcon />
      </ItemIndicator>
      <ItemText>{children}</ItemText>
    </Item>
  );
}
