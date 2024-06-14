import clsx from "clsx";
import { Search, XIcon } from "lucide-react";
import { forwardRef, useCallback } from "react";

import css from "./search-input.module.css";

import { Button } from "./button";

type Props = React.ComponentProps<"input"> & {
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
      (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target instanceof HTMLInputElement) {
          onChangeValue(evt.target.value);
        }
      },
      [onChangeValue],
    );

    return (
      <div className={clsx(css["search"], className)}>
        <label htmlFor={id} title="Search cards">
          <Search className={css["icon_search"]} />
        </label>
        <input
          {...rest}
          className={clsx(css["input"], inputClassName)}
          id={id}
          onChange={onChange}
          ref={ref}
          type="text"
          value={value}
        />
        {!!value && (
          <Button
            className={css["icon_clear"]}
            onClick={onClear}
            variant="bare"
          >
            <XIcon />
          </Button>
        )}
      </div>
    );
  },
);
