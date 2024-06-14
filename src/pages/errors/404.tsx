import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import { AppLayout } from "@/layouts/app-layout";

import css from "./errors.module.css";

import { ErrorDisplay } from "./error-display";

export function Error404() {
  return (
    <AppLayout mainClassName={css["main"]} title="Page not found">
      <ErrorDisplay message="This page could not be found." status={404}>
        <Link asChild to="/">
          <Button as="a" variant="bare">
            Home
          </Button>
        </Link>
      </ErrorDisplay>
    </AppLayout>
  );
}
