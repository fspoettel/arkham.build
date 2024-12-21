import { Button } from "@/components/ui/button";
import { AppLayout } from "@/layouts/app-layout";
import { useResolvedColorTheme } from "@/utils/use-color-theme";
import { Link } from "wouter";
import { ErrorDisplay } from "./error-display";
import css from "./errors.module.css";

export function Error404() {
  const theme = useResolvedColorTheme();

  return (
    <AppLayout mainClassName={css["main"]} title="Page not found">
      <ErrorDisplay
        message="This page could not be found."
        pre={
          <img
            className={css["image"]}
            src={theme === "dark" ? "/404-dark.png" : "/404-light.png"}
            alt="Page not found"
          />
        }
        status={404}
      >
        <Link asChild to="~/">
          <Button as="a" variant="bare">
            Home
          </Button>
        </Link>
      </ErrorDisplay>
    </AppLayout>
  );
}
