import { cx } from "@/utils/cx";
import { SearchIcon, XIcon } from "lucide-react";
import { forwardRef, useCallback } from "react";
import { Button } from "./button";
import css from "./search-input.module.css";

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
      <div className={cx(css["search"], className)}>
        <label htmlFor={id} title="Search cards">
          <SearchIcon className={css["icon_search"]} />
        </label>
        <input
          {...rest}
          className={cx(css["input"], inputClassName)}
          id={id}
          onChange={onChange}
          ref={ref}
          type="text"
          value={value}
        />
        {!!value && (
          <Button
            className={css["icon_clear"]}
            iconOnly
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
