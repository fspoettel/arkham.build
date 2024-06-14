import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import type { ChangeEvent, ComponentProps } from "react";
import { forwardRef, useCallback } from "react";

import css from "./search-input.module.css";

import { Button } from "./button";

type Props = ComponentProps<"input"> & {
  className?: string;
  inputClassName?: string;
  onChangeValue: (value: string) => void;
  id: string;
  value: string;
};

export const SearchInput = forwardRef<HTMLInputElement, Props>(
  function SearchInput(
    { className, inputClassName, id, onChangeValue, value, ...rest },
    ref,
  ) {
    const onClear = useCallback(() => {
      onChangeValue("");
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
          className={clsx(css["field-input"], inputClassName)}
          id={id}
          onChange={onChange}
          ref={ref}
          type="text"
          value={value}
        />
        {!!value && (
          <Button
            className={css["field-icon_clear"]}
            onClick={onClear}
            variant="bare"
          >
            <Cross1Icon />
          </Button>
        )}
      </div>
    );
  },
);
