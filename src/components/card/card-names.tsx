import clsx from "clsx";
import { Link } from "wouter";

import css from "./card-names.module.css";

type Props = {
  code: string;
  isUnique?: boolean;
  linked?: boolean;
  name?: string;
  parallel?: boolean;
  subname?: string;
};

export function CardNames({
  code,
  isUnique,
  linked,
  name,
  parallel,
  subname,
}: Props) {
  const cardName = (
    <>
      {parallel && (
        <i className={clsx(css["parallel"], "encounters-parallel")} />
      )}
      {name} <span>{isUnique && <>&#10040;</>}</span>
    </>
  );

  return (
    <div className={css["names"]}>
      <h1 className={css["name"]}>
        {linked ? (
          <Link href={`/card/${code}`}>
            <a>{cardName}</a>
          </Link>
        ) : (
          cardName
        )}
      </h1>
      {subname && <h2 className={css["sub"]}>{subname}</h2>}
    </div>
  );
}
