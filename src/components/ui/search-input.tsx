import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { ChangeEvent, ComponentProps, useCallback, useRef } from "react";

import css from "./search-input.module.css";

import { Button } from "./button";

type Props = ComponentProps<"input"> & {
  className?: string;
  inputClassName?: string;
  onChangeValue: (value: string) => void;
  id: string;
  value: string;
};

export function SearchInput({
  className,
  inputClassName,
  id,
  onChangeValue,
  value,
  ...rest
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onClear = useCallback(() => {
    onChangeValue("");
    inputRef.current?.focus();
  }, [onChangeValue]);

  const onChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      onChangeValue(evt.target.value);
    },
    [onChangeValue],
  );

  return (
    <div className={clsx(css["field"], className)}>
      <label htmlFor={id} title="Search cards">
        <MagnifyingGlassIcon className={css["field-icon_search"]} />
      </label>
      <input
        {...rest}
        id={id}
        ref={inputRef}
        className={clsx(css["field-input"], inputClassName)}
        onChange={onChange}
        value={value}
        type="text"
      />
      {!!value && (
        <Button
          className={css["field-icon_clear"]}
          variant="bare"
          onClick={onClear}
        >
          <Cross1Icon />
        </Button>
      )}
    </div>
  );
}
