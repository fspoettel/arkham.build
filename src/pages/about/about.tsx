import { Button } from "@/components/ui/button";
import { AppLayout } from "@/layouts/app-layout";
import { cx } from "@/utils/cx";
import { useGoBack } from "@/utils/use-go-back";
import { ChevronLeftIcon } from "lucide-react";
import css from "./about.module.css";

function About() {
  const goBack = useGoBack();

  return (
    <AppLayout title="About">
      <div className={cx("longform", css["about"])}>
        <Button onClick={goBack} variant="bare">
          <ChevronLeftIcon /> Back
        </Button>
        <h1>About</h1>
        <p>
          The information presented in this app about{" "}
          <a
            href="https://www.fantasyflightgames.com/en/products/arkham-horror-the-card-game/"
            rel="noreferrer"
            target="_blank"
          >
            Arkham Horror: The Card Game™
          </a>
          , both textual and graphical, is © Fantasy Flight Games{" "}
          {new Date().getUTCFullYear()}. This app is a fan project and is not
          produced, endorsed, or supported by, or affiliated with Fantasy Flight
          Games.
        </p>
        <p>
          This application was created by{" "}
          <a href="https://spoettel.dev" rel="noreferrer" target="_blank">
            Felix
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/fspoettel/arkham.build/graphs/contributors"
            rel="noreferrer"
            target="_blank"
          >
            contributors
          </a>{" "}
          to support the Arkham Horror: The Card Game community. The source code
          of this project is available at{" "}
          <a
            href="https://github.com/fspoettel/arkham.build"
            rel="noreferrer"
            target="_blank"
          >
            Github
          </a>
          . Feedback and bug reports are welcome via Github issues or the
          dedicated channel on the Mythos Busters discord server.
        </p>
        <p>
          All artwork and illustrations are the intellectual property of their
          respective creators. All Arkham Horror: The Card Game™ images and
          graphics are copyrighted by Fantasy Flight Games.
        </p>
        <h2>Thanks 🌟</h2>
        <ul>
          <li>
            <strong>@zzorba:</strong> Access to the ArkhamCards API and icons,
            assistance with questions and inspiration for the deckbuilder.
            Without you this project would not have been possible. 🙇‍♂️
          </li>
          <li>
            <strong>@kamalisk &amp; ArkhamDB crew:</strong> Structured card data
            and images and many years of being the backbone of the community.
          </li>
          <li>
            <strong>@Chr1Z</strong>, <strong>@Butermelse</strong>,{" "}
            <strong>@5argon</strong>: Patient feedback and testing during
            development of the initial version.
          </li>
          <li>
            <strong>@blu</strong>: Significant contributions to the codebase.
          </li>
        </ul>
        <h2>Icon credits</h2>
        <ul>
          <li>
            <strong>Card icons:</strong> Fantasy Flight Games
          </li>
          <li>
            <strong>Logo design:</strong> Buteremelse
          </li>
          <li>
            <strong>Re-used ArkhamCards icons:</strong> Eugene Sarnetsky
          </li>
          <li>
            <strong>404 illustration (edit):</strong> FFG & 5argon
          </li>
          <li>
            <strong>Other icons</strong>: lucide.dev
          </li>
        </ul>
      </div>
    </AppLayout>
  );
}

export default About;
