import React, { Suspense } from "react";

import {
  SvgALightInTheFog,
  SvgAPhantomOfTruth,
  SvgAThousandShapesOfHorror,
  SvgAllOrNothing,
  SvgBadBlood,
  SvgBlackStarsRise,
  SvgBloodOnTheAltar,
  SvgByTheBook,
  SvgDarkSideOfTheMoon,
  SvgDevilReef,
  SvgDimCarcosa,
  SvgEchoesOfThePast,
  SvgEssexCountyExpress,
  SvgForTheGreaterGood,
  SvgHeartOfTheElders,
  SvgHorrorInHighGear,
  SvgInTheClutchesOfChaos,
  SvgInTooDeep,
  SvgIntoTheMaelstrom,
  SvgLostInTimeAndSpace,
  SvgPointOfNoReturn,
  SvgReadOrDie,
  SvgRedTideRising,
  SvgShatteredAeons,
  SvgTheBoundaryBeyond,
  SvgTheCityOfArchives,
  SvgTheDepthsOfYoth,
  SvgTheLairOfDagon,
  SvgTheMiskatonicMuseum,
  SvgThePallidMask,
  SvgTheSearchForKadath,
  SvgTheSecretName,
  SvgTheUnspeakableOath,
  SvgTheWagesOfSin,
  SvgThreadsOfFate,
  SvgUndimensionedAndUnseen,
  SvgUnionAndDisillusion,
  SvgWeaverOfTheCosmos,
  SvgWhereDoomAwaits,
  SvgWhereTheGodsDwell,
} from "./encounter-icon";

export type Props = {
  className?: string;
  code?: string;
};

function PackIcon({ code, className }: Props) {
  const Icon = getPackIcon(code);

  return Icon ? (
    <Suspense
      fallback={
        <span
          style={{ width: "1em", height: "1em", display: "inline-block" }}
        />
      }
    >
      <Icon className={className} />
    </Suspense>
  ) : null;
}

function getPackIcon(code?: string) {
  switch (code) {
    case "side_stories":
    case "investigator":
    case "rcore":
    case "core":
    case "core2":
    case "return":
      return React.lazy(() => import("@/assets/icons/core.svg?react"));

    case "otr":
    case "ltr":
    case "ptr":
    case "rop":
    case "parallel":
      return React.lazy(() => import("@/assets/icons/parallel.svg?react"));

    case "dwlp":
    case "dwlc":
    case "dwl":
      return React.lazy(() => import("@/assets/icons/set.svg?react"));

    case "ptcp":
    case "ptcc":
    case "ptc":
      return React.lazy(() => import("@/assets/icons/carcosa.svg?react"));

    case "tfap":
    case "tfac":
    case "tfa":
      return React.lazy(
        () => import("@/assets/icons/the_forgotten_age.svg?react"),
      );

    case "tcuc":
    case "tcup":
    case "tcu":
      return React.lazy(
        () => import("@/assets/icons/the_circle_undone.svg?react"),
      );

    case "tdep":
    case "tdec":
    case "tde":
      return React.lazy(() => import("@/assets/icons/dream.svg?react"));

    case "tic":
      return React.lazy(() => import("@/assets/icons/tic.svg?react"));

    case "eoe":
    case "eoep":
      return React.lazy(() => import("@/assets/icons/eoe.svg?react"));

    case "eoec":
      return React.lazy(() => import("@/assets/icons/eoe_campaign.svg?react"));

    case "tskc":
      return React.lazy(() => import("@/assets/icons/tskc.svg?react"));

    case "tsk":
    case "tskp":
      return React.lazy(() => import("@/assets/icons/tsk.svg?react"));

    case "fhv":
    case "fhvp":
      return React.lazy(() => import("@/assets/icons/fhvp.svg?react"));

    case "fhvc":
      return React.lazy(() => import("@/assets/icons/fhvc.svg?react"));

    case "promo":
    case "dre":
    case "bob":
    case "tftbw":
    case "tdg":
    case "iotv":
    case "tdor":
    case "books":
    case "hoth":
    case "promotional":
      return React.lazy(() => import("@/assets/icons/novella.svg?react"));

    case "tmm":
      return SvgTheMiskatonicMuseum;
    case "tece":
      return SvgEssexCountyExpress;
    case "bota":
      return SvgBloodOnTheAltar;
    case "uau":
      return SvgUndimensionedAndUnseen;
    case "wda":
      return SvgWhereDoomAwaits;
    case "litas":
      return SvgLostInTimeAndSpace;

    case "eotp":
      return SvgEchoesOfThePast;
    case "tuo":
      return SvgTheUnspeakableOath;
    case "apot":
      return SvgAPhantomOfTruth;
    case "bsr":
      return SvgBlackStarsRise;
    case "dca":
      return SvgDimCarcosa;
    case "tpm":
      return SvgThePallidMask;

    case "tof":
      return SvgThreadsOfFate;
    case "tbb":
      return SvgTheBoundaryBeyond;
    case "hote":
      return SvgHeartOfTheElders;
    case "tcoa":
      return SvgTheCityOfArchives;
    case "tdoy":
      return SvgTheDepthsOfYoth;
    case "sha":
      return SvgShatteredAeons;

    case "tsn":
      return SvgTheSecretName;
    case "wos":
      return SvgTheWagesOfSin;
    case "fgg":
      return SvgForTheGreaterGood;
    case "uad":
      return SvgUnionAndDisillusion;
    case "icc":
      return SvgInTheClutchesOfChaos;
    case "bbt":
      return SvgBlackStarsRise;

    case "sfk":
      return SvgTheSearchForKadath;
    case "tsh":
      return SvgAThousandShapesOfHorror;
    case "dsm":
      return SvgDarkSideOfTheMoon;
    case "pnr":
      return SvgPointOfNoReturn;
    case "wgd":
      return SvgWhereTheGodsDwell;
    case "woc":
      return SvgWeaverOfTheCosmos;

    case "itd":
      return SvgInTooDeep;
    case "def":
      return SvgDevilReef;
    case "hhg":
      return SvgHorrorInHighGear;
    case "lif":
      return SvgALightInTheFog;
    case "lod":
      return SvgTheLairOfDagon;
    case "itm":
      return SvgIntoTheMaelstrom;

    case "rtnotz":
      return React.lazy(() => import("@/assets/icons/rtnotz.svg?react"));
    case "rtdwl":
      return React.lazy(
        () => import("@/assets/icons/return_to_the_dunwich_legacy.svg?react"),
      );
    case "rtptc":
      return React.lazy(
        () => import("@/assets/icons/return_to_the_path_to_carcosa.svg?react"),
      );
    case "rttfa":
      return React.lazy(
        () => import("@/assets/icons/return_to_the_forgotten_age.svg?react"),
      );
    case "rttcu":
      return React.lazy(() => import("@/assets/icons/rttcu.svg?react"));

    case "nat":
      return React.lazy(() => import("@/assets/icons/nate.svg?react"));
    case "har":
      return React.lazy(() => import("@/assets/icons/harvey.svg?react"));
    case "win":
      return React.lazy(() => import("@/assets/icons/winifred.svg?react"));
    case "jac":
      return React.lazy(() => import("@/assets/icons/jacqueline.svg?react"));
    case "ste":
      return React.lazy(() => import("@/assets/icons/stella.svg?react"));

    case "rod":
      return SvgReadOrDie;
    case "aon":
      return SvgAllOrNothing;
    case "bad":
      return SvgBadBlood;
    case "btb":
      return SvgByTheBook;
    case "rtr":
      return SvgRedTideRising;

    case "cotr":
      return React.lazy(() => import("@/assets/icons/rougerauo2.svg?react"));
    case "coh":
      return React.lazy(() => import("@/assets/icons/carnevale.svg?react"));
    case "lol":
      return React.lazy(() => import("@/assets/icons/lol.svg?react"));
    case "guardians":
      return React.lazy(() => import("@/assets/icons/guardians.svg?react"));
    case "hotel":
      return React.lazy(() => import("@/assets/icons/excelsior.svg?react"));
    case "blob":
      return React.lazy(() => import("@/assets/icons/blob_set.svg?react"));
    case "wog":
      return React.lazy(() => import("@/assets/icons/wotog.svg?react"));
    case "mtt":
      return React.lazy(
        () => import("@/assets/icons/machinations_through_time.svg?react"),
      );
    case "fof":
      return React.lazy(() => import("@/assets/icons/roulette.svg?react"));
    case "blbe":
      return null;

    default:
      return null;
  }
}

export default PackIcon;
