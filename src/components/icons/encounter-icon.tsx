import React, { Suspense } from "react";

export type Props = {
  className?: string;
  code?: string;
};

function EncounterIcon({ code, className }: Props) {
  const Icon = getEncounterIcon(code);
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

// BEWARE! EVERYTHING BELOW WAS GENERATED WITH COPILOT AND SOME MANUAL FIXUPS.
const SvgMidnightMasks = React.lazy(
  () => import("@/assets/icons/midnight_masks.svg?react"),
);

const SvgTheGathering = React.lazy(
  () => import("@/assets/icons/the_gathering.svg?react"),
);
const SvgCultists = React.lazy(
  () => import("@/assets/icons/cult_of_umordoth.svg?react"),
);
const SvgRats = React.lazy(() => import("@/assets/icons/rats.svg?react"));
const SvgGhouls = React.lazy(() => import("@/assets/icons/ghouls.svg?react"));
const SvgStrikingFear = React.lazy(
  () => import("@/assets/icons/striking_fear.svg?react"),
);
const SvgAncientEvils = React.lazy(
  () => import("@/assets/icons/ancient_evils.svg?react"),
);
const SvgChillingCold = React.lazy(
  () => import("@/assets/icons/chilling_cold.svg?react"),
);
const SvgPentagram = React.lazy(
  () => import("@/assets/icons/dark_cult.svg?react"),
);
const SvgNightgaunts = React.lazy(
  () => import("@/assets/icons/nightgaunts.svg?react"),
);
const SvgLockedDoors = React.lazy(
  () => import("@/assets/icons/locked_doors.svg?react"),
);
const SvgAgentsOfHastur = React.lazy(
  () => import("@/assets/icons/agents_of_hastur.svg?react"),
);
const SvgAgentsOfYog = React.lazy(
  () => import("@/assets/icons/agents_of_yog.svg?react"),
);
const SvgAgentsOfShub = React.lazy(
  () => import("@/assets/icons/agents_of_shub.svg?react"),
);
const SvgAgentsOfCthulhu = React.lazy(
  () => import("@/assets/icons/agents_of_cthulhu.svg?react.svg?react"),
);
const SvgVenice = React.lazy(() => import("@/assets/icons/venice.svg?react"));
const SvgArmitagesFate = React.lazy(
  () => import("@/assets/icons/armitages_fate.svg?react"),
);
const SvgBishopsThralls = React.lazy(
  () => import("@/assets/icons/bishops_thralls.svg?react"),
);
const SvgBeastThralls = React.lazy(
  () => import("@/assets/icons/beast_thralls.svg?react"),
);
const SvgNaomisCrew = React.lazy(
  () => import("@/assets/icons/naomis_crew.svg?react"),
);
const SvgExtracurricularActivity = React.lazy(
  () => import("@/assets/icons/extracurricular_activity.svg?react.svg?react"),
);
const SvgTheHouseAlwaysWins = React.lazy(
  () => import("@/assets/icons/the_house_always_wins.svg?react.svg?react"),
);
const SvgSorcery = React.lazy(() => import("@/assets/icons/sorcery.svg?react"));
const SvgDunwich = React.lazy(() => import("@/assets/icons/dunwich.svg?react"));
const SvgWhippoorwills = React.lazy(
  () => import("@/assets/icons/whippoorwills.svg?react"),
);
const SvgBadLuck = React.lazy(
  () => import("@/assets/icons/bad_luck.svg?react"),
);
const SvgTheBeyond = React.lazy(
  () => import("@/assets/icons/the_beyond.svg?react"),
);
const SvgHideousAbominations = React.lazy(
  () => import("@/assets/icons/hideous_abominations.svg?react.svg?react"),
);
const SvgTheMiskatonicMuseum = React.lazy(
  () => import("@/assets/icons/the_miskatonic_museum.svg?react.svg?react"),
);
const SvgEssexCountyExpress = React.lazy(
  () => import("@/assets/icons/the_essex_county_express.svg?react.svg?react"),
);
const SvgBloodOnTheAltar = React.lazy(
  () => import("@/assets/icons/blood_on_the_altar.svg?react.svg?react"),
);
const SvgUndimensionedAndUnseen = React.lazy(
  () => import("@/assets/icons/undimensioned_and_unseen.svg?react.svg?react"),
);
const SvgWhereDoomAwaits = React.lazy(
  () => import("@/assets/icons/where_doom_awaits.svg?react.svg?react"),
);
const SvgLostInTimeAndSpace = React.lazy(
  () => import("@/assets/icons/lost_in_time_and_space.svg?react.svg?react"),
);
const SvgCurtainCall = React.lazy(
  () => import("@/assets/icons/curtain_call.svg?react"),
);
const SvgTheLastKing = React.lazy(
  () => import("@/assets/icons/the_last_king.svg?react"),
);
const SvgDelusions = React.lazy(
  () => import("@/assets/icons/delusions.svg?react"),
);
const SvgByakhee = React.lazy(() => import("@/assets/icons/byakhee.svg?react"));
const SvgInhabitantsOfCarcosa = React.lazy(
  () => import("@/assets/icons/inhabitants_of_carcosa.svg?react.svg?react"),
);
const SvgEvilPortents = React.lazy(
  () => import("@/assets/icons/evil_portents.svg?react"),
);
const SvgHauntings = React.lazy(
  () => import("@/assets/icons/hauntings.svg?react"),
);
const SvgHastursGift = React.lazy(
  () => import("@/assets/icons/hasturs_gift.svg?react"),
);
const SvgCultOfTheYellowSign = React.lazy(
  () => import("@/assets/icons/cult_of_the_yellow_sign.svg?react.svg?react"),
);
const SvgDecay = React.lazy(
  () => import("@/assets/icons/decay_and_filth.svg?react"),
);
const SvgEchoesOfThePast = React.lazy(
  () => import("@/assets/icons/echoes_of_the_past.svg?react.svg?react"),
);
const SvgTheUnspeakableOath = React.lazy(
  () => import("@/assets/icons/the_unspeakable_oath.svg?react.svg?react"),
);
const SvgAPhantomOfTruth = React.lazy(
  () => import("@/assets/icons/a_phantom_of_truth.svg?react.svg?react"),
);
const SvgThePallidMask = React.lazy(
  () => import("@/assets/icons/the_pallid_mask.svg?react"),
);
const SvgBlackStarsRise = React.lazy(
  () => import("@/assets/icons/black_stars_rise.svg?react"),
);
const SvgFlood = React.lazy(
  () => import("@/assets/icons/the_flood_below.svg?react"),
);
const SvgVortex = React.lazy(
  () => import("@/assets/icons/the_vortex_above.svg?react"),
);
const SvgDimCarcosa = React.lazy(
  () => import("@/assets/icons/dim_carcosa.svg?react"),
);
const SvgAgentsOfYig = React.lazy(
  () => import("@/assets/icons/agents_of_yig.svg?react"),
);
const SvgExpedition = React.lazy(
  () => import("@/assets/icons/expedition.svg?react"),
);
const SvgGuardiansOfTime = React.lazy(
  () => import("@/assets/icons/guardians_of_time.svg?react.svg?react"),
);
const SvgPnakoticBrotherhood = React.lazy(
  () => import("@/assets/icons/pnakotic_brotherhood.svg?react.svg?react"),
);
const SvgPoison = React.lazy(() => import("@/assets/icons/poison.svg?react"));
const SvgRainforest = React.lazy(
  () => import("@/assets/icons/rainforest.svg?react"),
);
const SvgSerpents = React.lazy(
  () => import("@/assets/icons/serpents.svg?react"),
);
const SvgThreadsOfFate = React.lazy(
  () => import("@/assets/icons/threads_of_fate.svg?react"),
);
const SvgTheBoundaryBeyond = React.lazy(
  () => import("@/assets/icons/the_boundary_beyond.svg?react.svg?react"),
);
const SvgHeartOfTheElders = React.lazy(
  () => import("@/assets/icons/heart_of_the_elders.svg?react.svg?react"),
);
const SvgPillarsOfJudgment = React.lazy(
  () => import("@/assets/icons/pillars_of_judgement.svg?react.svg?react"),
);
const SvgKnyan = React.lazy(() => import("@/assets/icons/knyan.svg?react"));
const SvgTheCityOfArchives = React.lazy(
  () => import("@/assets/icons/city_of_archives.svg?react.svg?react"),
);
const SvgTheDepthsOfYoth = React.lazy(
  () => import("@/assets/icons/the_depths_of_yoth.svg?react.svg?react"),
);
const SvgShatteredAeons = React.lazy(
  () => import("@/assets/icons/shattered_aeons.svg?react"),
);
const SvgTurnBackTime = React.lazy(
  () => import("@/assets/icons/turn_back_time.svg?react"),
);
const SvgAgentsOfAzathoth = React.lazy(
  () => import("@/assets/icons/agents_of_azathoth.svg?react.svg?react"),
);
const SvgAnettesCoven = React.lazy(
  () => import("@/assets/icons/anettes_coven.svg?react"),
);
const SvgAtDeathsDoorstep = React.lazy(
  () => import("@/assets/icons/at_deaths_doorstep.svg?react.svg?react"),
);
const SvgCityOfSins = React.lazy(
  () => import("@/assets/icons/city_of_sins.svg?react"),
);
const SvgDisappearanceAtTheTwilightEstate = React.lazy(
  () =>
    import(
      "@/assets/icons/disappearance_at_the_twilight_estate.svg?react.svg?react"
    ),
);
const SvgInexorableFate = React.lazy(
  () => import("@/assets/icons/inexorable_fate.svg?react"),
);
const SvgRealmOfDeath = React.lazy(
  () => import("@/assets/icons/realm_of_death.svg?react"),
);
const SvgSilverTwilightLodge = React.lazy(
  () => import("@/assets/icons/silver_twilight_lodge.svg?react.svg?react"),
);
const SvgSpectralPredators = React.lazy(
  () => import("@/assets/icons/spectral_predators.svg?react.svg?react"),
);
const SvgTheWatcher = React.lazy(
  () => import("@/assets/icons/the_watcher.svg?react"),
);
const SvgTheWitchingHour = React.lazy(
  () => import("@/assets/icons/the_witching_hour.svg?react.svg?react"),
);
const SvgTrappedSpirits = React.lazy(
  () => import("@/assets/icons/trapped_spirits.svg?react"),
);
const SvgWitchcraft = React.lazy(
  () => import("@/assets/icons/witchcraft.svg?react"),
);
const SvgTheSecretName = React.lazy(
  () => import("@/assets/icons/the_secret_name.svg?react"),
);
const SvgTheWagesOfSin = React.lazy(
  () => import("@/assets/icons/the_wages_of_sin.svg?react"),
);
const SvgForTheGreaterGood = React.lazy(
  () => import("@/assets/icons/for_the_greater_good.svg?react.svg?react"),
);
const SvgUnionAndDisillusion = React.lazy(
  () => import("@/assets/icons/union_and_disillusion.svg?react.svg?react"),
);
const SvgInTheClutchesOfChaos = React.lazy(
  () => import("@/assets/icons/in_the_clutches_of_chaos.svg?react.svg?react"),
);
const SvgMusicOfTheDamned = React.lazy(
  () => import("@/assets/icons/music_of_the_damned.svg?react.svg?react"),
);
const SvgSecretsOfTheUniverse = React.lazy(
  () => import("@/assets/icons/secrets_of_the_universe.svg?react.svg?react"),
);
const SvgBeforeTheBlackThrone = React.lazy(
  () => import("@/assets/icons/before_the_black_throne.svg?react.svg?react"),
);
const SvgAgentsOfAtlachNacha = React.lazy(
  () => import("@/assets/icons/agents_of_atlach_nacha.svg?react.svg?react"),
);
const SvgAgentsOfNyarlathotep = React.lazy(
  () => import("@/assets/icons/agents_of_nyarlathotep.svg?react.svg?react"),
);
const SvgCorsairs = React.lazy(
  () => import("@/assets/icons/corsairs.svg?react"),
);
const SvgCreaturesOfTheUnderworld = React.lazy(
  () =>
    import("@/assets/icons/creatures_of_the_underworld.svg?react.svg?react"),
);
const SvgDreamersCurse = React.lazy(
  () => import("@/assets/icons/dreamers_curse.svg?react"),
);
const SvgDreamlands = React.lazy(
  () => import("@/assets/icons/dreamlands.svg?react"),
);
const SvgMergingRealities = React.lazy(
  () => import("@/assets/icons/merging_realities.svg?react.svg?react"),
);
const SvgSpiders = React.lazy(() => import("@/assets/icons/spiders.svg?react"));
const SvgWhispersOfHypnos = React.lazy(
  () => import("@/assets/icons/whispers_of_hypnos.svg?react.svg?react"),
);
const SvgZoogs = React.lazy(() => import("@/assets/icons/zoogs.svg?react"));
const SvgInTheLabyrinthsOfLunacy = React.lazy(
  () =>
    import("@/assets/icons/in_the_labyrinths_of_lunacy.svg?react.svg?react"),
);
const SvgEpicMultiplayer = React.lazy(
  () => import("@/assets/icons/epic_multiplayer.svg?react.svg?react"),
);
const SvgSingleGroup = React.lazy(
  () => import("@/assets/icons/single_group.svg?react"),
);
const SvgAbyssalGifts = React.lazy(
  () => import("@/assets/icons/abyssal_gifts.svg?react"),
);
const SvgAbyssalTribute = React.lazy(
  () => import("@/assets/icons/abyssal_tribute.svg?react"),
);
const SvgBrotherhoodOfTheBeast = React.lazy(
  () => import("@/assets/icons/brotherhood_of_the_beast.svg?react.svg?react"),
);
const SvgSandsOfEgypt = React.lazy(
  () => import("@/assets/icons/sands_of_egypt.svg?react"),
);
const SvgTheEternalSlumber = React.lazy(
  () => import("@/assets/icons/eternal_slumber.svg?react.svg?react"),
);
const SvgTheNightsUsurper = React.lazy(
  () => import("@/assets/icons/nights_usurper.svg?react"),
);
const SvgReturnToTheGathering = React.lazy(
  () => import("@/assets/icons/return_to_the_gathering.svg?react.svg?react"),
);
const SvgReturnToTheMidnightMasks = React.lazy(
  () =>
    import("@/assets/icons/return_to_the_midnight_masks.svg?react.svg?react"),
);
const SvgReturnToTheDevourerBelow = React.lazy(
  () =>
    import("@/assets/icons/return_to_the_devourer_below.svg?react.svg?react"),
);
const SvgGhoulsOfUmordhoth = React.lazy(
  () => import("@/assets/icons/ghouls_of_umrdhoth.svg?react.svg?react"),
);
const SvgTheDevourersCult = React.lazy(
  () => import("@/assets/icons/the_devourers_cult.svg?react.svg?react"),
);
const SvgReturnCult = React.lazy(
  () => import("@/assets/icons/return_cult.svg?react"),
);
const SvgReturnToExtracurricularActivities = React.lazy(
  () =>
    import(
      "@/assets/icons/return_to_extracurricular_activities.svg?react.svg?react"
    ),
);
const SvgReturnToTheHouseAlwaysWins = React.lazy(
  () =>
    import(
      "@/assets/icons/return_to_the_house_always_wins.svg?react.svg?react"
    ),
);
const SvgReturnToTheMiskatonicMuseum = React.lazy(
  () =>
    import(
      "@/assets/icons/return_to_the_miskatonic_museum.svg?react.svg?react"
    ),
);
const SvgReturnToTheEssexCountyExpress = React.lazy(
  () =>
    import(
      "@/assets/icons/return_to_the_essex_county_express.svg?react.svg?react"
    ),
);
const SvgReturnToBloodOnTheAltar = React.lazy(
  () =>
    import("@/assets/icons/return_to_blood_on_the_altar.svg?react.svg?react"),
);
const SvgReturnToUndimensionedAndUnseen = React.lazy(
  () =>
    import(
      "@/assets/icons/return_to_undimensioned_and_unseen.svg?react.svg?react"
    ),
);
const SvgReturnToWhereDoomAwaits = React.lazy(
  () =>
    import("@/assets/icons/return_to_where_doom_awaits.svg?react.svg?react"),
);
const SvgReturnToLostInTimeAndSpace = React.lazy(
  () =>
    import(
      "@/assets/icons/return_to_lost_in_time_and_space.svg?react.svg?react"
    ),
);
const SvgResurgentEvils = React.lazy(
  () => import("@/assets/icons/resurgent_evils.svg?react"),
);
const SvgErraticFear = React.lazy(
  () => import("@/assets/icons/erratic_fear.svg?react"),
);
const SvgCreepingCold = React.lazy(
  () => import("@/assets/icons/creeping_cold.svg?react"),
);
const SvgSecretDoors = React.lazy(
  () => import("@/assets/icons/secret_doors.svg?react"),
);
const SvgYogSothothsEmissaries = React.lazy(
  () => import("@/assets/icons/yog_sothoths_emissaries.svg?react.svg?react"),
);
const SvgBeyondTheThreshold = React.lazy(
  () => import("@/assets/icons/beyond_the_threshold.svg?react"),
);
const SvgReturnToCurtainCall = React.lazy(
  () => import("@/assets/icons/return_to_curtain_call.svg?react"),
);
const SvgReturnToTheLastKing = React.lazy(
  () => import("@/assets/icons/return_to_the_last_king.svg?react"),
);
const SvgReturnToEchoesOfThePast = React.lazy(
  () => import("@/assets/icons/return_to_echoes_of_the_past.svg?react"),
);
const SvgReturnToTheUnspeakableOath = React.lazy(
  () => import("@/assets/icons/return_to_the_unspeakable_oath.svg?react"),
);
const SvgReturnToAPhantomOfTruth = React.lazy(
  () => import("@/assets/icons/return_to_the_phantom_of_truth.svg?react"),
);
const SvgReturnToThePallidMask = React.lazy(
  () => import("@/assets/icons/return_to_the_pallid_mask.svg?react"),
);
const SvgReturnToBlackStarsRise = React.lazy(
  () => import("@/assets/icons/return_to_black_stars_rise.svg?react"),
);
const SvgReturnToDimCarcosa = React.lazy(
  () => import("@/assets/icons/return_to_dim_carcosa.svg?react"),
);
const SvgDelusoryEvils = React.lazy(
  () => import("@/assets/icons/delusory_evils.svg?react"),
);
const SvgNeuroticFear = React.lazy(
  () => import("@/assets/icons/neurotic_fear.svg?react"),
);
const SvgHastursEnvoys = React.lazy(
  () => import("@/assets/icons/hasturs_envoys.svg?react"),
);
const SvgDecayingReality = React.lazy(
  () => import("@/assets/icons/decaying_reality.svg?react"),
);
const SvgMaddeningDelusions = React.lazy(
  () => import("@/assets/icons/maddening_delusions.svg?react"),
);
const SvgBeyondTheGatesOfSleep = React.lazy(
  () => import("@/assets/icons/beyond_the_gates_of_sleep.svg?react"),
);
const SvgWakingNightmare = React.lazy(
  () => import("@/assets/icons/waking_nightmare.svg?react"),
);
const SvgAThousandShapesOfHorror = React.lazy(
  () => import("@/assets/icons/a_thousand_shapes_of_horror.svg?react"),
);
const SvgTheSearchForKadath = React.lazy(
  () => import("@/assets/icons/the_search_for_kadath.svg?react"),
);
const SvgDarkSideOfTheMoon = React.lazy(
  () => import("@/assets/icons/dark_side_of_the_moon.svg?react"),
);
const SvgPointOfNoReturn = React.lazy(
  () => import("@/assets/icons/point_of_no_return.svg?react"),
);
const SvgWhereTheGodsDwell = React.lazy(
  () => import("@/assets/icons/where_gods_dwell.svg?react"),
);
const SvgWeaverOfTheCosmos = React.lazy(
  () => import("@/assets/icons/weaver_of_the_cosmos.svg?react"),
);
const SvgTerrorOfTheVale = React.lazy(
  () => import("@/assets/icons/terror_of_the_vale.svg?react"),
);
const SvgDescentIntoThePitch = React.lazy(
  () => import("@/assets/icons/descent_into_the_pitch.svg?react"),
);
const SvgMurderAtTheExcelsiorHotel = React.lazy(
  () => import("@/assets/icons/murder_at_the_excelsior_hotel.svg?react"),
);
const SvgAlienInterference = React.lazy(
  () => import("@/assets/icons/alien_interference.svg?react"),
);
const SvgDarkRituals = React.lazy(
  () => import("@/assets/icons/dark_rituals.svg?react"),
);
const SvgExcelsiorManagement = React.lazy(
  () => import("@/assets/icons/excelsior_management.svg?react"),
);
const SvgSinsOfThePast = React.lazy(
  () => import("@/assets/icons/sins_of_the_past.svg?react"),
);
const SvgVileExperiments = React.lazy(
  () => import("@/assets/icons/vile_experiments.svg?react"),
);
const SvgBlob = React.lazy(() => import("@/assets/icons/blob.svg?react"));
const SvgBlobEpicMultiplayer = React.lazy(
  () => import("@/assets/icons/epic_multiplayer.svg?react"),
);
const SvgBlobSingleGroup = React.lazy(
  () => import("@/assets/icons/single_group.svg?react"),
);
const SvgMigoIncursion = React.lazy(
  () => import("@/assets/icons/migo.svg?react"),
);
const SvgReadOrDie = React.lazy(
  () => import("@/assets/icons/read_or_die.svg?react"),
);
const SvgAllOrNothing = React.lazy(
  () => import("@/assets/icons/all_or_nothing.svg?react"),
);
const SvgBadBlood = React.lazy(
  () => import("@/assets/icons/bad_blood.svg?react"),
);
const SvgByTheBook = React.lazy(
  () => import("@/assets/icons/by_the_book.svg?react"),
);
const SvgRedTideRising = React.lazy(
  () => import("@/assets/icons/red_tide_rising.svg?react"),
);
const SvgReturnToTheUntamedWilds = React.lazy(
  () => import("@/assets/icons/return_to_the_untamed_wilds.svg?react"),
);
const SvgReturnToTheDoomOfEztli = React.lazy(
  () => import("@/assets/icons/return_to_the_doom_of_eztli.svg?react"),
);
const SvgReturnToThreadsOfFate = React.lazy(
  () => import("@/assets/icons/return_to_threads_of_fate.svg?react"),
);
const SvgReturnToTheBoundaryBeyond = React.lazy(
  () => import("@/assets/icons/return_to_the_boundary_beyond.svg?react"),
);
const SvgReturnToHeartOfTheElders = React.lazy(
  () => import("@/assets/icons/return_to_the_heart_of_the_elders.svg?react"),
);
const SvgReturnToPillarsOfJudgment = React.lazy(
  () => import("@/assets/icons/return_to_pillars_of_judgement.svg?react"),
);
const SvgReturnToKnyan = React.lazy(
  () => import("@/assets/icons/return_to_knyan.svg?react"),
);
const SvgReturnToTheCityOfArchives = React.lazy(
  () => import("@/assets/icons/return_to_city_of_archives.svg?react"),
);
const SvgReturnToTheDepthsOfYoth = React.lazy(
  () => import("@/assets/icons/return_to_the_depths_of_yoth.svg?react"),
);
const SvgReturnToShatteredAeons = React.lazy(
  () => import("@/assets/icons/return_to_shattered_aeons.svg?react"),
);
const SvgReturnToTurnBackTime = React.lazy(
  () => import("@/assets/icons/return_to_turn_back_time.svg?react"),
);
const SvgReturnToTheRainforest = React.lazy(
  () => import("@/assets/icons/return_to_the_rainforest.svg?react"),
);
const SvgCultOfPnakotus = React.lazy(
  () => import("@/assets/icons/cult_of_pnakotus.svg?react"),
);
const SvgDoomedExpedition = React.lazy(
  () => import("@/assets/icons/doomed_expedition.svg?react"),
);
const SvgTemporalHunters = React.lazy(
  () => import("@/assets/icons/temporal_hunters.svg?react"),
);
const SvgVenomousHate = React.lazy(
  () => import("@/assets/icons/venomous_hate.svg?react"),
);
const SvgThePitOfDespair = React.lazy(
  () => import("@/assets/icons/grotto_of_despair.svg?react"),
);
const SvgCreaturesOfTheDeep = React.lazy(
  () => import("@/assets/icons/creatures_from_below.svg?react"),
);
const SvgFloodedCaverns = React.lazy(
  () => import("@/assets/icons/flooded_caves.svg?react"),
);
const SvgRisingTide = React.lazy(
  () => import("@/assets/icons/rising_tide.svg?react"),
);
const SvgShatteredMemories = React.lazy(
  () => import("@/assets/icons/shattered_memories.svg?react"),
);
const SvgAgentsOfDagon = React.lazy(
  () => import("@/assets/icons/agents_of_dagon.svg?react"),
);
const SvgAgentsOfHydra = React.lazy(
  () => import("@/assets/icons/agents_of_hydra.svg?react"),
);
const SvgTheLocals = React.lazy(
  () => import("@/assets/icons/locals.svg?react"),
);
const SvgFogOverInnsmouth = React.lazy(
  () => import("@/assets/icons/fog_over_innsmouth.svg?react"),
);
const SvgTheVanishingOfElinaHarper = React.lazy(
  () => import("@/assets/icons/disappearance_of_elina_harper.svg?react"),
);
const SvgSyzygy = React.lazy(() => import("@/assets/icons/syzygy.svg?react"));
const SvgMalfunction = React.lazy(
  () => import("@/assets/icons/malfunction.svg?react"),
);
const SvgInTooDeep = React.lazy(
  () => import("@/assets/icons/in_too_deep.svg?react"),
);
const SvgDevilReef = React.lazy(
  () => import("@/assets/icons/devil_reef.svg?react"),
);
const SvgHorrorInHighGear = React.lazy(
  () => import("@/assets/icons/horror_in_high_gear.svg?react"),
);
const SvgALightInTheFog = React.lazy(
  () => import("@/assets/icons/a_light_in_the_fog.svg?react"),
);
const SvgTheLairOfDagon = React.lazy(
  () => import("@/assets/icons/lair_of_dagon.svg?react"),
);
const SvgIntoTheMaelstrom = React.lazy(
  () => import("@/assets/icons/into_the_maelstrom.svg?react"),
);
const SvgWarOfTheOuterGods = React.lazy(
  () => import("@/assets/icons/war_of_the_outer_gods.svg?react"),
);
const SvgDeathOfStars = React.lazy(
  () => import("@/assets/icons/death_of_the_stars.svg?react"),
);
const SvgChildrenOfParadise = React.lazy(
  () => import("@/assets/icons/children_of_paradise.svg?react"),
);
const SvgSwarmOfAssimilation = React.lazy(
  () => import("@/assets/icons/assimilating_swarm.svg?react"),
);
const SvgMachinationsThroughTime = React.lazy(
  () => import("@/assets/icons/machinations_through_time.svg?react"),
);
const SvgReturnToDisappearanceAtTheTwilightEstate = React.lazy(
  () =>
    import(
      "@/assets/icons/return_to_disappearance_at_the_twilight_estate.svg?react"
    ),
);
const SvgReturnToTheWitchingHour = React.lazy(
  () => import("@/assets/icons/return_to_the_witching_hour.svg?react"),
);
const SvgReturnToAtDeathsDoorstep = React.lazy(
  () => import("@/assets/icons/return_to_at_deaths_doorstep.svg?react"),
);
const SvgReturnToTheSecretName = React.lazy(
  () => import("@/assets/icons/return_to_the_secret_name.svg?react"),
);
const SvgReturnToTheWagesOfSin = React.lazy(
  () => import("@/assets/icons/return_to_the_wages_of_sin.svg?react"),
);
const SvgReturnToForTheGreaterGood = React.lazy(
  () => import("@/assets/icons/return_to_for_the_greater_good.svg?react"),
);
const SvgReturnToUnionAndDisillusion = React.lazy(
  () => import("@/assets/icons/return_to_union_and_disillusion.svg?react"),
);
const SvgReturnToInTheClutchesOfChaos = React.lazy(
  () => import("@/assets/icons/return_to_in_the_clutches_of_chaos.svg?react"),
);
const SvgReturnToBeforeTheBlackThrone = React.lazy(
  () => import("@/assets/icons/return_to_before_the_black_throne.svg?react"),
);
const SvgBloodthirstySpirits = React.lazy(
  () => import("@/assets/icons/bloodthirsty_spirits.svg?react"),
);
const SvgUnspeakableFate = React.lazy(
  () => import("@/assets/icons/unspeakable_fate.svg?react"),
);
const SvgCityOfTheDamned = React.lazy(
  () => import("@/assets/icons/city_of_the_damned.svg?react"),
);
const SvgIceAndDeath = React.lazy(
  () => import("@/assets/icons/ice_and_death.svg?react"),
);
const SvgTheCrash = React.lazy(
  () => import("@/assets/icons/the_crash.svg?react"),
);
const SvgCreaturesInTheIce = React.lazy(
  () => import("@/assets/icons/creatures_in_the_ice.svg?react"),
);
const SvgDeadlyWeather = React.lazy(
  () => import("@/assets/icons/deadly_weather.svg?react"),
);
const SvgHazardsOfAntarctica = React.lazy(
  () => import("@/assets/icons/hazards_of_antarctica.svg?react"),
);
const SvgSilenceAndMystery = React.lazy(
  () => import("@/assets/icons/silence_and_mystery.svg?react"),
);
const SvgToTheForbiddenPeaks = React.lazy(
  () => import("@/assets/icons/to_the_forbidden_peaks.svg?react"),
);
const SvgTheGreatSeal = React.lazy(
  () => import("@/assets/icons/the_great_seal.svg?react"),
);
const SvgCityOfTheElderThings = React.lazy(
  () => import("@/assets/icons/city_of_the_elder_things.svg?react"),
);
const SvgSleepingNightmares = React.lazy(
  () => import("@/assets/icons/sleeping_nightmares.svg?react"),
);
const SvgNamelessHorrors = React.lazy(
  () => import("@/assets/icons/nameless_horrors.svg?react"),
);
const SvgMemorialsOfTheLost = React.lazy(
  () => import("@/assets/icons/memorials_of_the_lost.svg?react"),
);
const SvgFatalMirage = React.lazy(
  () => import("@/assets/icons/fatal_mirage.svg?react"),
);
const SvgElderThings = React.lazy(
  () => import("@/assets/icons/elder_things.svg?react"),
);
const SvgTheHeartOfMadness = React.lazy(
  () => import("@/assets/icons/the_heart_of_madness.svg?react"),
);
const SvgStirringInTheDeep = React.lazy(
  () => import("@/assets/icons/stirring_in_the_deep.svg?react"),
);
const SvgShoggoths = React.lazy(
  () => import("@/assets/icons/shoggoths.svg?react"),
);
const SvgPenguins = React.lazy(
  () => import("@/assets/icons/penguins.svg?react"),
);
const SvgMiasma = React.lazy(() => import("@/assets/icons/miasma.svg?react"));
const SvgLostInTheNight = React.lazy(
  () => import("@/assets/icons/lost_in_the_night.svg?react"),
);
const SvgLeftBehind = React.lazy(
  () => import("@/assets/icons/left_behind.svg?react"),
);
const SvgExpeditionTeam = React.lazy(
  () => import("@/assets/icons/expedition_team.svg?react"),
);
const SvgAgentsOfTheUnknown = React.lazy(
  () => import("@/assets/icons/agents_of_the_unknown.svg?react"),
);
const SvgTekelili = React.lazy(
  () => import("@/assets/icons/tekeli_li.svg?react"),
);
const SvgRiddlesAndRain = React.lazy(
  () => import("@/assets/icons/riddles_and_rain.svg?react"),
);
const SvgMysteriesAbound = React.lazy(
  () => import("@/assets/icons/mysteries_abound.svg?react"),
);
const SvgShadesOfSuffering = React.lazy(
  () => import("@/assets/icons/shades_of_sorrow.svg?react"),
);
const SvgAgentsOfTheOutside = React.lazy(
  () => import("@/assets/icons/agents_of_the_outside.svg?react"),
);
const SvgBeyondTheBeyond = React.lazy(
  () => import("@/assets/icons/beyond_the_beyond.svg?react"),
);
const SvgCongressOfTheKeys = React.lazy(
  () => import("@/assets/icons/congress_of_the_keys.svg?react"),
);
const SvgDancingMad = React.lazy(
  () => import("@/assets/icons/dancing_mad.svg?react"),
);
const SvgDeadHeat = React.lazy(
  () => import("@/assets/icons/dead_heat.svg?react"),
);
const SvgDogsOfWar = React.lazy(
  () => import("@/assets/icons/dogs_of_war.svg?react"),
);
const SvgOutsiders = React.lazy(
  () => import("@/assets/icons/outsiders.svg?react"),
);
const SvgScarletSorcery = React.lazy(
  () => import("@/assets/icons/scarlet_sorcery.svg?react"),
);
const SvgSpatialAnomaly = React.lazy(
  () => import("@/assets/icons/spatial_anomaly.svg?react"),
);
const SvgStrangeHappenings = React.lazy(
  () => import("@/assets/icons/strange_happenings.svg?react"),
);
const SvgSecretWar = React.lazy(
  () => import("@/assets/icons/secret_war.svg?react"),
);
const SvgShadowOfADoubt = React.lazy(
  () => import("@/assets/icons/shadow_of_a_doubt.svg?react"),
);
const SvgWithoutATrace = React.lazy(
  () => import("@/assets/icons/without_a_trace.svg?react"),
);
const SvgAgentsOfYuggoth = React.lazy(
  () => import("@/assets/icons/agents_of_yuggoth.svg?react"),
);
const SvgCleanupCrew = React.lazy(
  () => import("@/assets/icons/cleanup_crew.svg?react"),
);
const SvgCrimsonConspiracy = React.lazy(
  () => import("@/assets/icons/crimson_conspiracy.svg?react"),
);
const SvgDarkVeiling = React.lazy(
  () => import("@/assets/icons/dark_veiling.svg?react"),
);
const SvgDealingsInTheDark = React.lazy(
  () => import("@/assets/icons/dealings_in_the_dark.svg?react"),
);
const SvgGlobetrotting = React.lazy(
  () => import("@/assets/icons/globetrotting.svg?react"),
);
const SvgOnThinIce = React.lazy(
  () => import("@/assets/icons/on_thin_ice.svg?react"),
);
const SvgRedCoterie = React.lazy(
  () => import("@/assets/icons/red_coterie.svg?react"),
);
const SvgSanguineShadows = React.lazy(
  () => import("@/assets/icons/sanguine_shadows.svg?react"),
);
const SvgSpreadingCorruption = React.lazy(
  () => import("@/assets/icons/spreading_corruption.svg?react"),
);
const SvgFortuneAndFolly = React.lazy(
  () => import("@/assets/icons/fortune_and_folly.svg?react"),
);
const SvgFortunesChosen = React.lazy(
  () => import("@/assets/icons/fortunes_chosen.svg?react"),
);
const SvgPlanInShambles = React.lazy(
  () => import("@/assets/icons/plan_in_shambles.svg?react"),
);
const SvgTheDevourerBelow = React.lazy(
  () => import("@/assets/icons/the_devourer_below.svg?react"),
);
const SvgCurseOfTheRougarou = React.lazy(
  () => import("@/assets/icons/curse_of_the_rougarou.svg?react"),
);
const SvgTheBayou = React.lazy(
  () => import("@/assets/icons/the_bayou.svg?react"),
);
const SvgTheStranger = React.lazy(
  () => import("@/assets/icons/the_stranger.svg?react"),
);
const SvgForgottenRuins = React.lazy(
  () => import("@/assets/icons/forgotten_ruins.svg?react"),
);
const SvgDeadlyTraps = React.lazy(
  () => import("@/assets/icons/deadly_traps.svg?react"),
);
const SvgTheDoomOfEztli = React.lazy(
  () => import("@/assets/icons/the_doom_of_eztli.svg?react"),
);
const SvgTheUntamedWilds = React.lazy(
  () => import("@/assets/icons/the_untamed_wilds.svg?react"),
);
const SvgYigsVenom = React.lazy(
  () => import("@/assets/icons/yigs_venom.svg?react"),
);
const SvgTemporalFlux = React.lazy(
  () => import("@/assets/icons/temporal_flux.svg?react"),
);
const SvgColdFog = React.lazy(
  () => import("@/assets/icons/cold_fog.svg?react"),
);
const SvgThreateningEvil = React.lazy(
  () => import("@/assets/icons/threatening_evil.svg?react"),
);
const SvgWitchwork = React.lazy(
  () => import("@/assets/icons/witchwork.svg?react"),
);
const SvgSpectralRealm = React.lazy(
  () => import("@/assets/icons/spectral_realm.svg?react"),
);

// these are not available yet:
// _ "../icons/blob_that_ate_everything_else"
// _ "../icons/migo1"
// _ "../icons/laid_to_rest"
// _ "../icons/relics_of_the_past"

function getEncounterIcon(code?: string) {
  switch (code) {
    case "torch":
      return SvgTheGathering;
    case "arkham":
      return SvgMidnightMasks;
    case "cultists":
      return SvgCultists;
    case "tentacles":
      return SvgTheDevourerBelow;
    case "rats":
      return SvgRats;
    case "ghouls":
      return SvgGhouls;
    case "striking_fear":
      return SvgStrikingFear;
    case "ancient_evils":
      return SvgAncientEvils;
    case "chilling_cold":
      return SvgChillingCold;
    case "pentagram":
      return SvgPentagram;
    case "nightgaunts":
      return SvgNightgaunts;
    case "locked_doors":
      return SvgLockedDoors;
    case "agents_of_hastur":
      return SvgAgentsOfHastur;
    case "agents_of_yog":
      return SvgAgentsOfYog;
    case "agents_of_shub":
      return SvgAgentsOfShub;
    case "agents_of_cthulhu":
      return SvgAgentsOfCthulhu;
    case "bayou":
      return SvgTheBayou;
    case "rougarou":
      return SvgCurseOfTheRougarou;
    case "venice":
      return SvgVenice;
    case "armitages_fate":
      return SvgArmitagesFate;
    case "bishops_thralls":
      return SvgBishopsThralls;
    case "beast_thralls":
      return SvgBeastThralls;
    case "naomis_crew":
      return SvgNaomisCrew;
    case "extracurricular_activity":
      return SvgExtracurricularActivity;
    case "the_house_always_wins":
      return SvgTheHouseAlwaysWins;
    case "sorcery":
      return SvgSorcery;
    case "dunwich":
      return SvgDunwich;
    case "whippoorwills":
      return SvgWhippoorwills;
    case "bad_luck":
      return SvgBadLuck;
    case "the_beyond":
      return SvgTheBeyond;
    case "hideous_abominations":
      return SvgHideousAbominations;
    case "the_miskatonic_museum":
      return SvgTheMiskatonicMuseum;
    case "essex_county_express":
      return SvgEssexCountyExpress;
    case "blood_on_the_altar":
      return SvgBloodOnTheAltar;
    case "undimensioned_and_unseen":
      return SvgUndimensionedAndUnseen;
    case "where_doom_awaits":
      return SvgWhereDoomAwaits;
    case "lost_in_time_and_space":
      return SvgLostInTimeAndSpace;
    case "curtain_call":
      return SvgCurtainCall;
    case "the_last_king":
      return SvgTheLastKing;
    case "delusions":
      return SvgDelusions;
    case "byakhee":
      return SvgByakhee;
    case "inhabitants_of_carcosa":
      return SvgInhabitantsOfCarcosa;
    case "evil_portents":
      return SvgEvilPortents;
    case "hauntings":
      return SvgHauntings;
    case "hasturs_gift":
      return SvgHastursGift;
    case "cult_of_the_yellow_sign":
      return SvgCultOfTheYellowSign;
    case "decay":
      return SvgDecay;
    case "stranger":
      return SvgTheStranger;
    case "echoes_of_the_past":
      return SvgEchoesOfThePast;
    case "the_unspeakable_oath":
      return SvgTheUnspeakableOath;
    case "a_phantom_of_truth":
      return SvgAPhantomOfTruth;
    case "the_pallid_mask":
      return SvgThePallidMask;
    case "black_stars_rise":
      return SvgBlackStarsRise;
    case "flood":
      return SvgFlood;
    case "vortex":
      return SvgVortex;
    case "dim_carcosa":
      return SvgDimCarcosa;
    case "agents_of_yig":
      return SvgAgentsOfYig;
    case "traps":
      return SvgDeadlyTraps;
    case "expedition":
      return SvgExpedition;
    case "ruins":
      return SvgForgottenRuins;
    case "guardians_of_time":
      return SvgGuardiansOfTime;
    case "pnakotic_brotherhood":
      return SvgPnakoticBrotherhood;
    case "poison":
      return SvgPoison;
    case "rainforest":
      return SvgRainforest;
    case "serpents":
      return SvgSerpents;
    case "flux":
      return SvgTemporalFlux;
    case "eztli":
      return SvgTheDoomOfEztli;
    case "wilds":
      return SvgTheUntamedWilds;
    case "venom":
      return SvgYigsVenom;
    case "threads_of_fate":
      return SvgThreadsOfFate;
    case "the_boundary_beyond":
      return SvgTheBoundaryBeyond;
    case "heart_of_the_elders":
      return SvgHeartOfTheElders;
    case "pillars_of_judgment":
      return SvgPillarsOfJudgment;
    case "knyan":
      return SvgKnyan;
    case "the_city_of_archives":
      return SvgTheCityOfArchives;
    case "the_depths_of_yoth":
      return SvgTheDepthsOfYoth;
    case "shattered_aeons":
      return SvgShatteredAeons;
    case "turn_back_time":
      return SvgTurnBackTime;
    case "agents_of_azathoth":
      return SvgAgentsOfAzathoth;
    case "anettes_coven":
      return SvgAnettesCoven;
    case "at_deaths_doorstep":
      return SvgAtDeathsDoorstep;
    case "city_of_sins":
      return SvgCityOfSins;
    case "disappearance_at_the_twilight_estate":
      return SvgDisappearanceAtTheTwilightEstate;
    case "inexorable_fate":
      return SvgInexorableFate;
    case "realm_of_death":
      return SvgRealmOfDeath;
    case "silver_twilight_lodge":
      return SvgSilverTwilightLodge;
    case "spectral_predators":
      return SvgSpectralPredators;
    case "the_watcher":
      return SvgTheWatcher;
    case "the_witching_hour":
      return SvgTheWitchingHour;
    case "trapped_spirits":
      return SvgTrappedSpirits;
    case "witchcraft":
      return SvgWitchcraft;
    case "the_secret_name":
      return SvgTheSecretName;
    case "the_wages_of_sin":
      return SvgTheWagesOfSin;
    case "for_the_greater_good":
      return SvgForTheGreaterGood;
    case "union_and_disillusion":
      return SvgUnionAndDisillusion;
    case "in_the_clutches_of_chaos":
      return SvgInTheClutchesOfChaos;
    case "music_of_the_damned":
      return SvgMusicOfTheDamned;
    case "secrets_of_the_universe":
      return SvgSecretsOfTheUniverse;
    case "before_the_black_throne":
      return SvgBeforeTheBlackThrone;
    case "agents_of_atlach_nacha":
      return SvgAgentsOfAtlachNacha;
    case "agents_of_nyarlathotep":
      return SvgAgentsOfNyarlathotep;
    case "corsairs":
      return SvgCorsairs;
    case "creatures_of_the_underworld":
      return SvgCreaturesOfTheUnderworld;
    case "dreamers_curse":
      return SvgDreamersCurse;
    case "dreamlands":
      return SvgDreamlands;
    case "merging_realities":
      return SvgMergingRealities;
    case "spiders":
      return SvgSpiders;
    case "whispers_of_hypnos":
      return SvgWhispersOfHypnos;
    case "zoogs":
      return SvgZoogs;
    case "in_the_labyrinths_of_lunacy":
      return SvgInTheLabyrinthsOfLunacy;
    case "epic_multiplayer":
      return SvgEpicMultiplayer;
    case "single_group":
      return SvgSingleGroup;
    case "abyssal_gifts":
      return SvgAbyssalGifts;
    case "abyssal_tribute":
      return SvgAbyssalTribute;
    case "brotherhood_of_the_beast":
      return SvgBrotherhoodOfTheBeast;
    case "sands_of_egypt":
      return SvgSandsOfEgypt;
    case "the_eternal_slumber":
      return SvgTheEternalSlumber;
    case "the_nights_usurper":
      return SvgTheNightsUsurper;
    case "return_to_the_gathering":
      return SvgReturnToTheGathering;
    case "return_to_the_midnight_masks":
      return SvgReturnToTheMidnightMasks;
    case "return_to_the_devourer_below":
      return SvgReturnToTheDevourerBelow;
    case "ghouls_of_umôrdhoth":
      return SvgGhoulsOfUmordhoth;
    case "the_devourers_cult":
      return SvgTheDevourersCult;
    case "return_cult":
      return SvgReturnCult;
    case "return_to_extracurricular_activities":
      return SvgReturnToExtracurricularActivities;
    case "return_to_the_house_always_wins":
      return SvgReturnToTheHouseAlwaysWins;
    case "return_to_the_miskatonic_museum":
      return SvgReturnToTheMiskatonicMuseum;
    case "return_to_the_essex_county_express":
      return SvgReturnToTheEssexCountyExpress;
    case "return_to_blood_on_the_altar":
      return SvgReturnToBloodOnTheAltar;
    case "return_to_undimensioned_and_unseen":
      return SvgReturnToUndimensionedAndUnseen;
    case "return_to_where_doom_awaits":
      return SvgReturnToWhereDoomAwaits;
    case "return_to_lost_in_time_and_space":
      return SvgReturnToLostInTimeAndSpace;
    case "resurgent_evils":
      return SvgResurgentEvils;
    case "erratic_fear":
      return SvgErraticFear;
    case "creeping_cold":
      return SvgCreepingCold;
    case "secret_doors":
      return SvgSecretDoors;
    case "yog_sothoths_emissaries":
      return SvgYogSothothsEmissaries;
    case "beyond_the_threshold":
      return SvgBeyondTheThreshold;
    case "return_to_curtain_call":
      return SvgReturnToCurtainCall;
    case "return_to_the_last_king":
      return SvgReturnToTheLastKing;
    case "return_to_echoes_of_the_past":
      return SvgReturnToEchoesOfThePast;
    case "return_to_the_unspeakable_oath":
      return SvgReturnToTheUnspeakableOath;
    case "return_to_a_phantom_of_truth":
      return SvgReturnToAPhantomOfTruth;
    case "return_to_the_pallid_mask":
      return SvgReturnToThePallidMask;
    case "return_to_black_stars_rise":
      return SvgReturnToBlackStarsRise;
    case "return_to_dim_carcosa":
      return SvgReturnToDimCarcosa;
    case "delusory_evils":
      return SvgDelusoryEvils;
    case "neurotic_fear":
      return SvgNeuroticFear;
    case "hasturs_envoys":
      return SvgHastursEnvoys;
    case "decaying_reality":
      return SvgDecayingReality;
    case "maddening_delusions":
      return SvgMaddeningDelusions;
    case "beyond_the_gates_of_sleep":
      return SvgBeyondTheGatesOfSleep;
    case "waking_nightmare":
      return SvgWakingNightmare;
    case "a_thousand_shapes_of_horror":
      return SvgAThousandShapesOfHorror;
    case "the_search_for_kadath":
      return SvgTheSearchForKadath;
    case "dark_side_of_the_moon":
      return SvgDarkSideOfTheMoon;
    case "point_of_no_return":
      return SvgPointOfNoReturn;
    case "where_the_gods_dwell":
      return SvgWhereTheGodsDwell;
    case "weaver_of_the_cosmos":
      return SvgWeaverOfTheCosmos;
    case "terror_of_the_vale":
      return SvgTerrorOfTheVale;
    case "descent_into_the_pitch":
      return SvgDescentIntoThePitch;
    case "murder_at_the_excelsior_hotel":
      return SvgMurderAtTheExcelsiorHotel;
    case "alien_interference":
      return SvgAlienInterference;
    case "dark_rituals":
      return SvgDarkRituals;
    case "excelsior_management":
      return SvgExcelsiorManagement;
    case "sins_of_the_past":
      return SvgSinsOfThePast;
    case "vile_experiments":
      return SvgVileExperiments;
    case "blob":
      return SvgBlob;
    case "blob_epic_multiplayer":
      return SvgBlobEpicMultiplayer;
    case "blob_single_group":
      return SvgBlobSingleGroup;
    case "migo_incursion":
      return SvgMigoIncursion;
    case "read_or_die":
      return SvgReadOrDie;
    case "all_or_nothing":
      return SvgAllOrNothing;
    case "bad_blood":
      return SvgBadBlood;
    case "by_the_book":
      return SvgByTheBook;
    case "red_tide_rising":
      return SvgRedTideRising;
    case "return_to_the_untamed_wilds":
      return SvgReturnToTheUntamedWilds;
    case "return_to_the_doom_of_eztli":
      return SvgReturnToTheDoomOfEztli;
    case "return_to_threads_of_fate":
      return SvgReturnToThreadsOfFate;
    case "return_to_the_boundary_beyond":
      return SvgReturnToTheBoundaryBeyond;
    case "return_to_heart_of_the_elders":
      return SvgReturnToHeartOfTheElders;
    case "return_to_pillars_of_judgment":
      return SvgReturnToPillarsOfJudgment;
    case "return_to_knyan":
      return SvgReturnToKnyan;
    case "return_to_the_city_of_archives":
      return SvgReturnToTheCityOfArchives;
    case "return_to_the_depths_of_yoth":
      return SvgReturnToTheDepthsOfYoth;
    case "return_to_shattered_aeons":
      return SvgReturnToShatteredAeons;
    case "return_to_turn_back_time":
      return SvgReturnToTurnBackTime;
    case "return_to_the_rainforest":
      return SvgReturnToTheRainforest;
    case "cult_of_pnakotus":
      return SvgCultOfPnakotus;
    case "doomed_expedition":
      return SvgDoomedExpedition;
    case "temporal_hunters":
      return SvgTemporalHunters;
    case "venomous_hate":
      return SvgVenomousHate;
    case "the_pit_of_despair":
      return SvgThePitOfDespair;
    case "creatures_of_the_deep":
      return SvgCreaturesOfTheDeep;
    case "flooded_caverns":
      return SvgFloodedCaverns;
    case "rising_tide":
      return SvgRisingTide;
    case "shattered_memories":
      return SvgShatteredMemories;
    case "agents_of_dagon":
      return SvgAgentsOfDagon;
    case "agents_of_hydra":
      return SvgAgentsOfHydra;
    case "the_locals":
      return SvgTheLocals;
    case "fog_over_innsmouth":
      return SvgFogOverInnsmouth;
    case "the_vanishing_of_elina_harper":
      return SvgTheVanishingOfElinaHarper;
    case "syzygy":
      return SvgSyzygy;
    case "malfunction":
      return SvgMalfunction;
    case "in_too_deep":
      return SvgInTooDeep;
    case "devil_reef":
      return SvgDevilReef;
    case "horror_in_high_gear":
      return SvgHorrorInHighGear;
    case "a_light_in_the_fog":
      return SvgALightInTheFog;
    case "the_lair_of_dagon":
      return SvgTheLairOfDagon;
    case "into_the_maelstrom":
      return SvgIntoTheMaelstrom;
    case "war_of_the_outer_gods":
      return SvgWarOfTheOuterGods;
    case "death_of_stars":
      return SvgDeathOfStars;
    case "children_of_paradise":
      return SvgChildrenOfParadise;
    case "swarm_of_assimilation":
      return SvgSwarmOfAssimilation;
    case "machinations_through_time":
      return SvgMachinationsThroughTime;
    case "return_to_disappearance_at_the_twilight_estate":
      return SvgReturnToDisappearanceAtTheTwilightEstate;
    case "return_to_the_witching_hour":
      return SvgReturnToTheWitchingHour;
    case "return_to_at_deaths_doorstep":
      return SvgReturnToAtDeathsDoorstep;
    case "return_to_the_secret_name":
      return SvgReturnToTheSecretName;
    case "return_to_the_wages_of_sin":
      return SvgReturnToTheWagesOfSin;
    case "return_to_for_the_greater_good":
      return SvgReturnToForTheGreaterGood;
    case "return_to_union_and_disillusion":
      return SvgReturnToUnionAndDisillusion;
    case "return_to_in_the_clutches_of_chaos":
      return SvgReturnToInTheClutchesOfChaos;
    case "return_to_before_the_black_throne":
      return SvgReturnToBeforeTheBlackThrone;
    case "hexcraft":
      return SvgWitchwork;
    case "bloodthirsty_spirits":
      return SvgBloodthirstySpirits;
    case "unspeakable_fate":
      return SvgUnspeakableFate;
    case "unstable_realm":
      return SvgSpectralRealm;
    case "city_of_the_damned":
      return SvgCityOfTheDamned;
    case "chilling_mists":
      return SvgColdFog;
    case "impending_evils":
      return SvgThreateningEvil;
    case "ice_and_death":
      return SvgIceAndDeath;
    case "the_crash":
      return SvgTheCrash;
    case "creatures_in_the_ice":
      return SvgCreaturesInTheIce;
    case "deadly_weather":
      return SvgDeadlyWeather;
    case "hazards_of_antarctica":
      return SvgHazardsOfAntarctica;
    case "silence_and_mystery":
      return SvgSilenceAndMystery;
    case "to_the_forbidden_peaks":
      return SvgToTheForbiddenPeaks;
    case "the_great_seal":
      return SvgTheGreatSeal;
    case "city_of_the_elder_things":
      return SvgCityOfTheElderThings;
    case "seeping_nightmares":
      return SvgSleepingNightmares;
    case "nameless_horrors":
      return SvgNamelessHorrors;
    case "memorials_of_the_lost":
      return SvgMemorialsOfTheLost;
    case "fatal_mirage":
      return SvgFatalMirage;
    case "elder_things":
      return SvgElderThings;
    case "the_heart_of_madness":
      return SvgTheHeartOfMadness;
    case "stirring_in_the_deep":
      return SvgStirringInTheDeep;
    case "shoggoths":
      return SvgShoggoths;
    case "penguins":
      return SvgPenguins;
    case "miasma":
      return SvgMiasma;
    case "lost_in_the_night":
      return SvgLostInTheNight;
    case "left_behind":
      return SvgLeftBehind;
    case "expedition_team":
      return SvgExpeditionTeam;
    case "agents_of_the_unknown":
      return SvgAgentsOfTheUnknown;
    case "tekelili":
      return SvgTekelili;
    case "riddles_and_rain":
      return SvgRiddlesAndRain;
    case "mysteries_abound":
      return SvgMysteriesAbound;
    case "shades_of_suffering":
      return SvgShadesOfSuffering;
    case "agents_of_the_outside":
      return SvgAgentsOfTheOutside;
    case "beyond_the_beyond":
      return SvgBeyondTheBeyond;
    case "congress_of_the_keys":
      return SvgCongressOfTheKeys;
    case "dancing_mad":
      return SvgDancingMad;
    case "dead_heat":
      return SvgDeadHeat;
    case "dogs_of_war":
      return SvgDogsOfWar;
    case "outsiders":
      return SvgOutsiders;
    case "scarlet_sorcery":
      return SvgScarletSorcery;
    case "spatial_anomaly":
      return SvgSpatialAnomaly;
    case "strange_happenings":
      return SvgStrangeHappenings;
    case "secret_war":
      return SvgSecretWar;
    case "shadow_of_a_doubt":
      return SvgShadowOfADoubt;
    case "without_a_trace":
      return SvgWithoutATrace;
    case "agents_of_yuggoth":
      return SvgAgentsOfYuggoth;
    case "cleanup_crew":
      return SvgCleanupCrew;
    case "crimson_conspiracy":
      return SvgCrimsonConspiracy;
    case "dark_veiling":
      return SvgDarkVeiling;
    case "dealings_in_the_dark":
      return SvgDealingsInTheDark;
    case "globetrotting":
      return SvgGlobetrotting;
    case "on_thin_ice":
      return SvgOnThinIce;
    case "red_coterie":
      return SvgRedCoterie;
    case "sanguine_shadows":
      return SvgSanguineShadows;
    case "spreading_corruption":
      return SvgSpreadingCorruption;
    case "fortune_and_folly":
      return SvgFortuneAndFolly;
    case "fortunes_chosen":
      return SvgFortunesChosen;
    case "plan_in_shambles":
      return SvgPlanInShambles;

    case "blob_that_ate_everything_else":
    case "migo_incursion_2":
    case "laid_to_rest":
    case "relics_of_the_past":
    default:
      return null;
  }
}

export default EncounterIcon;
