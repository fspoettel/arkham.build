import css from "./error-display.module.css";

type Props = {
  children?: React.ReactNode;
  message: string;
  status: number;
};

export function ErrorDisplay({ children, message, status }: Props) {
  return (
    <article className={css["error"]}>
      <div className={css["error-row"]}>
        <header className={css["error-header"]}>
          <h1 className={css["error-status"]}>{status}</h1>
          <h2 className={css["error-message"]}>{message}</h2>
        </header>
        {children}
      </div>
    </article>
  );
}
