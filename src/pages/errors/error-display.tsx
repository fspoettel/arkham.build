import css from "./error-display.module.css";

type Props = {
  children?: React.ReactNode;
  message: string;
  pre?: React.ReactNode;
  status: number;
};

export function ErrorDisplay(props: Props) {
  return (
    <article className={css["error"]}>
      {props.pre}
      <div className={css["error-row"]}>
        <header className={css["error-header"]}>
          <h1 className={css["error-status"]}>{props.status}</h1>
          <h2 className={css["error-message"]}>{props.message}</h2>
        </header>
        {props.children}
      </div>
    </article>
  );
}
