import { Suspense } from "react";

export type Props = {
  className?: string;
  code?: string;
};

function PackIcon({ code }: Props) {
  const Icon = getPackIcon(code);

  return Icon ? (
    <Suspense
      fallback={
        <span
          style={{ width: "1em", height: "1em", display: "inline-block" }}
        />
      }
    >
      <Icon />
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
      return () => <i className="encounters-core" />;

    case "otr":
    case "ltr":
    case "ptr":
    case "rop":
    case "parallel":
      return () => <i className="encounters-parallel" />;

    case "dwlp":
    case "dwlc":
    case "dwl":
      return () => <i className="encounters-set" />;

    case "ptcp":
    case "ptcc":
    case "ptc":
      return () => <i className="encounters-carcosa" />;

    case "tfap":
    case "tfac":
    case "tfa":
      return () => <i className="encounters-the_forgotten_age" />;

    case "tcuc":
    case "tcup":
    case "tcu":
      return () => <i className="encounters-the_circle_undone" />;

    case "tdep":
    case "tdec":
    case "tde":
      return () => <i className="encounters-dream" />;

    case "tic":
      return () => <i className="encounters-tic" />;

    case "eoe":
    case "eoep":
      return () => <i className="encounters-eoe" />;

    case "eoec":
      return () => <i className="encounters-eoe_campaign" />;

    case "tskc":
      return () => <i className="encounters-tskc" />;

    case "tsk":
    case "tskp":
      return () => <i className="encounters-tsk" />;

    case "fhv":
    case "fhvp":
      return () => <i className="encounters-fhvp" />;

    case "fhvc":
      return () => <i className="encounters-fhvc" />;

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
      return () => <i className="encounters-novella" />;

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
      return SvgBeforeTheBlackThrone;

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
      return () => <i className="encounters-rtnotz" />;

    case "rtdwl":
      return () => <i className="encounters-return_to_the_dunwich_legacy" />;
    case "rtptc":
      return () => <i className="encounters-return_to_the_path_to_carcosa" />;
    case "rttfa":
      return () => <i className="encounters-return_to_the_forgotten_age" />;
    case "rttcu":
      return () => <i className="encounters-rttcu" />;
    case "nat":
      return () => <i className="encounters-nate" />;
    case "har":
      return () => <i className="encounters-harvey" />;
    case "win":
      return () => <i className="encounters-winifred" />;
    case "jac":
      return () => <i className="encounters-jacqueline" />;
    case "ste":
      return () => <i className="encounters-stella" />;

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
      return () => <i className="encounters-rougerauo2" />;
    case "coh":
      return () => <i className="encounters-carnevale" />;
    case "lol":
      return () => <i className="encounters-lol" />;
    case "guardians":
      return () => <i className="encounters-guardians" />;
    case "hotel":
      return () => <i className="encounters-excelsior" />;
    case "blob":
      return () => <i className="encounters-blob_set" />;
    case "wog":
      return () => <i className="encounters-wotog" />;
    case "mtt":
      return () => <i className="encounters-machinations_through_time" />;
    case "fof":
      return () => <i className="encounters-roulette" />;
    case "blbe":
      return null;

    default:
      return null;
  }
}

export default PackIcon;
