import css from "./footer.module.css";

export function Footer() {
  return (
    <div className={css["footer"]}>
      <p>
        <a
          href="https://www.fantasyflightgames.com"
          rel="noreferrer"
          target="_blank"
        >
          Arkham Horror: The Card Game
        </a>{" "}
        and all related content &copy;{" "}
        <a
          href="https://www.fantasyflightgames.com"
          rel="noreferrer"
          target="_blank"
        >
          Fantasy Flight Games (FFG)
        </a>
        . This site is not produced by, endorsed by or affiliated with FFG.
      </p>
    </div>
  );
}
