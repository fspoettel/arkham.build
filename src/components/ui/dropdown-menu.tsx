import clsx from "clsx";
import css from "./dropdown-menu.module.css";

type Props = {
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function DropdownMenu({ className, children, ...rest }: Props) {
  return (
    <nav {...rest} className={clsx(css["dropdown"], className)}>
      {children}
    </nav>
  );
}
