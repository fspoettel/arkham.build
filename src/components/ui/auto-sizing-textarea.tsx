import { cx } from "@/utils/cx";
import { useCallback, useEffect, useRef } from "react";
import css from "./auto-sizing-textarea.module.css";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function AutoSizingTextarea(props: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (target) {
      target.style.height = "auto";
      target.style.height = `${target.scrollHeight}px`;
    }
  }, []);

  const onValueChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const target = event.target;
      target.style.height = "auto";
      target.style.height = `${target.scrollHeight}px`;
      props.onChange?.(event);
    },
    [props.onChange],
  );

  return (
    <textarea
      {...props}
      className={cx(css["textarea"], props.className)}
      onChange={onValueChange}
      ref={ref}
    />
  );
}
