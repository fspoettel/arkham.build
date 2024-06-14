import React from "react";

type Props = {
  className?: string;
  code?: string;
};

export function EncounterIcon({ code, className }: Props) {
  const Icon = getEncounterIcon(code);
  return Icon ? <Icon className={className} /> : null;
}

// BEWARE! EVERYTHING BELOW WAS GENERATED WITH COPILOT AND SOME MANUAL FIXUPS.
const SvgTorch = React.lazy(() => import("../icons/midnight-masks"));
const SvgArkham = React.lazy(() => import("../icons/arkham"));
const SvgCultists = React.lazy(() => import("../icons/cult-of-umordoth"));
const SvgRats = React.lazy(() => import("../icons/rats"));
const SvgGhouls = React.lazy(() => import("../icons/ghouls"));
const SvgStrikingFear = React.lazy(() => import("../icons/striking-fear"));
const SvgAncientEvils = React.lazy(() => import("../icons/ancient-evils"));
const SvgChillingCold = React.lazy(() => import("../icons/chilling-cold"));
const SvgPentagram = React.lazy(() => import("../icons/dark-cult"));
const SvgNightgaunts = React.lazy(() => import("../icons/nightgaunts"));
const SvgLockedDoors = React.lazy(() => import("../icons/locked-doors"));
const SvgAgentsOfHastur = React.lazy(() => import("../icons/agents-of-hastur"));
const SvgAgentsOfYog = React.lazy(() => import("../icons/agents-of-yog"));
const SvgAgentsOfShub = React.lazy(() => import("../icons/agents-of-shub"));
const SvgAgentsOfCthulhu = React.lazy(
  () => import("../icons/agents-of-cthulhu"),
);
const SvgVenice = React.lazy(() => import("../icons/venice"));
const SvgArmitagesFate = React.lazy(() => import("../icons/armitages-fate"));
const SvgBishopsThralls = React.lazy(() => import("../icons/bishops-thralls"));
const SvgBeastThralls = React.lazy(() => import("../icons/beast-thralls"));
const SvgNaomisCrew = React.lazy(() => import("../icons/naomis-crew"));
const SvgExtracurricularActivity = React.lazy(
  () => import("../icons/extracurricular-activity"),
);
const SvgTheHouseAlwaysWins = React.lazy(
  () => import("../icons/the-house-always-wins"),
);
const SvgSorcery = React.lazy(() => import("../icons/sorcery"));
const SvgDunwich = React.lazy(() => import("../icons/dunwich"));
const SvgWhippoorwills = React.lazy(() => import("../icons/whippoorwills"));
const SvgBadLuck = React.lazy(() => import("../icons/bad-luck"));
const SvgTheBeyond = React.lazy(() => import("../icons/the-beyond"));
const SvgHideousAbominations = React.lazy(
  () => import("../icons/hideous-abominations"),
);
const SvgTheMiskatonicMuseum = React.lazy(
  () => import("../icons/the-miskatonic-museum"),
);
const SvgEssexCountyExpress = React.lazy(
  () => import("../icons/the-essex-county-express"),
);
const SvgBloodOnTheAltar = React.lazy(
  () => import("../icons/blood-on-the-altar"),
);
const SvgUndimensionedAndUnseen = React.lazy(
  () => import("../icons/undimensioned-and-unseen"),
);
const SvgWhereDoomAwaits = React.lazy(
  () => import("../icons/where-doom-awaits"),
);
const SvgLostInTimeAndSpace = React.lazy(
  () => import("../icons/lost-in-time-and-space"),
);
const SvgCurtainCall = React.lazy(() => import("../icons/curtain-call"));
const SvgTheLastKing = React.lazy(() => import("../icons/the-last-king"));
const SvgDelusions = React.lazy(() => import("../icons/delusions"));
const SvgByakhee = React.lazy(() => import("../icons/byakhee"));
const SvgInhabitantsOfCarcosa = React.lazy(
  () => import("../icons/inhabitants-of-carcosa"),
);
const SvgEvilPortents = React.lazy(() => import("../icons/evil-portents"));
const SvgHauntings = React.lazy(() => import("../icons/hauntings"));
const SvgHastursGift = React.lazy(() => import("../icons/hasturs-gift"));
const SvgCultOfTheYellowSign = React.lazy(
  () => import("../icons/cult-of-the-yellow-sign"),
);
const SvgDecay = React.lazy(() => import("../icons/decay-and-filth"));
const SvgEchoesOfThePast = React.lazy(
  () => import("../icons/echoes-of-the-past"),
);
const SvgTheUnspeakableOath = React.lazy(
  () => import("../icons/the-unspeakable-oath"),
);
const SvgAPhantomOfTruth = React.lazy(
  () => import("../icons/a-phantom-of-truth"),
);
const SvgThePallidMask = React.lazy(() => import("../icons/the-pallid-mask"));
const SvgBlackStarsRise = React.lazy(() => import("../icons/black-stars-rise"));
const SvgFlood = React.lazy(() => import("../icons/the-flood-below"));
const SvgVortex = React.lazy(() => import("../icons/the-vortex-above"));
const SvgDimCarcosa = React.lazy(() => import("../icons/dim-carcosa"));
const SvgAgentsOfYig = React.lazy(() => import("../icons/agents-of-yig"));
const SvgExpedition = React.lazy(() => import("../icons/expedition"));
const SvgGuardiansOfTime = React.lazy(
  () => import("../icons/guardians-of-time"),
);
const SvgPnakoticBrotherhood = React.lazy(
  () => import("../icons/pnakotic-brotherhood"),
);
const SvgPoison = React.lazy(() => import("../icons/poison"));
const SvgRainforest = React.lazy(() => import("../icons/rainforest"));
const SvgSerpents = React.lazy(() => import("../icons/serpents"));
const SvgThreadsOfFate = React.lazy(() => import("../icons/threads-of-fate"));
const SvgTheBoundaryBeyond = React.lazy(
  () => import("../icons/the-boundary-beyond"),
);
const SvgHeartOfTheElders = React.lazy(
  () => import("../icons/heart-of-the-elders"),
);
const SvgPillarsOfJudgment = React.lazy(
  () => import("../icons/pillars-of-judgement"),
);
const SvgKnyan = React.lazy(() => import("../icons/knyan"));
const SvgTheCityOfArchives = React.lazy(
  () => import("../icons/city-of-archives"),
);
const SvgTheDepthsOfYoth = React.lazy(
  () => import("../icons/the-depths-of-yoth"),
);
const SvgShatteredAeons = React.lazy(() => import("../icons/shattered-aeons"));
const SvgTurnBackTime = React.lazy(() => import("../icons/turn-back-time"));
const SvgAgentsOfAzathoth = React.lazy(
  () => import("../icons/agents-of-azathoth"),
);
const SvgAnettesCoven = React.lazy(() => import("../icons/anettes-coven"));
const SvgAtDeathsDoorstep = React.lazy(
  () => import("../icons/at-deaths-doorstep"),
);
const SvgCityOfSins = React.lazy(() => import("../icons/city-of-sins"));
const SvgDisappearanceAtTheTwilightEstate = React.lazy(
  () => import("../icons/disappearance-at-the-twilight-estate"),
);
const SvgInexorableFate = React.lazy(() => import("../icons/inexorable-fate"));
const SvgRealmOfDeath = React.lazy(() => import("../icons/realm-of-death"));
const SvgSilverTwilightLodge = React.lazy(
  () => import("../icons/silver-twilight-lodge"),
);
const SvgSpectralPredators = React.lazy(
  () => import("../icons/spectral-predators"),
);
const SvgTheWatcher = React.lazy(() => import("../icons/the-watcher"));
const SvgTheWitchingHour = React.lazy(
  () => import("../icons/the-witching-hour"),
);
const SvgTrappedSpirits = React.lazy(() => import("../icons/trapped-spirits"));
const SvgWitchcraft = React.lazy(() => import("../icons/witchcraft"));
const SvgTheSecretName = React.lazy(() => import("../icons/the-secret-name"));
const SvgTheWagesOfSin = React.lazy(() => import("../icons/the-wages-of-sin"));
const SvgForTheGreaterGood = React.lazy(
  () => import("../icons/for-the-greater-good"),
);
const SvgUnionAndDisillusion = React.lazy(
  () => import("../icons/union-and-disillusion"),
);
const SvgInTheClutchesOfChaos = React.lazy(
  () => import("../icons/in-the-clutches-of-chaos"),
);
const SvgMusicOfTheDamned = React.lazy(
  () => import("../icons/music-of-the-damned"),
);
const SvgSecretsOfTheUniverse = React.lazy(
  () => import("../icons/secrets-of-the-universe"),
);
const SvgBeforeTheBlackThrone = React.lazy(
  () => import("../icons/before-the-black-throne"),
);
const SvgAgentsOfAtlachNacha = React.lazy(
  () => import("../icons/agents-of-atlach-nacha"),
);
const SvgAgentsOfNyarlathotep = React.lazy(
  () => import("../icons/agents-of-nyarlathotep"),
);
const SvgCorsairs = React.lazy(() => import("../icons/corsairs"));
const SvgCreaturesOfTheUnderworld = React.lazy(
  () => import("../icons/creatures-of-the-underworld"),
);
const SvgDreamersCurse = React.lazy(() => import("../icons/dreamers-curse"));
const SvgDreamlands = React.lazy(() => import("../icons/dreamlands"));
const SvgMergingRealities = React.lazy(
  () => import("../icons/merging-realities"),
);
const SvgSpiders = React.lazy(() => import("../icons/spiders"));
const SvgWhispersOfHypnos = React.lazy(
  () => import("../icons/whispers-of-hypnos"),
);
const SvgZoogs = React.lazy(() => import("../icons/zoogs"));
const SvgInTheLabyrinthsOfLunacy = React.lazy(
  () => import("../icons/in-the-labyrinths-of-lunacy"),
);
const SvgEpicMultiplayer = React.lazy(
  () => import("../icons/epic-multiplayer"),
);
const SvgSingleGroup = React.lazy(() => import("../icons/single-group"));
const SvgAbyssalGifts = React.lazy(() => import("../icons/abyssal-gifts"));
const SvgAbyssalTribute = React.lazy(() => import("../icons/abyssal-tribute"));
const SvgBrotherhoodOfTheBeast = React.lazy(
  () => import("../icons/brotherhood-of-the-beast"),
);
const SvgSandsOfEgypt = React.lazy(() => import("../icons/sands-of-egypt"));
const SvgTheEternalSlumber = React.lazy(
  () => import("../icons/eternal-slumber"),
);
const SvgTheNightsUsurper = React.lazy(() => import("../icons/nights-usurper"));
const SvgReturnToTheGathering = React.lazy(
  () => import("../icons/return-to-the-gathering"),
);
const SvgReturnToTheMidnightMasks = React.lazy(
  () => import("../icons/return-to-the-midnight-masks"),
);
const SvgReturnToTheDevourerBelow = React.lazy(
  () => import("../icons/return-to-the-devourer-below"),
);
const SvgGhoulsOfUmordhoth = React.lazy(
  () => import("../icons/ghouls-of-umrdhoth"),
);
const SvgTheDevourersCult = React.lazy(
  () => import("../icons/the-devourers-cult"),
);
const SvgReturnCult = React.lazy(() => import("../icons/return-cult"));
const SvgReturnToExtracurricularActivities = React.lazy(
  () => import("../icons/return-to-extracurricular-activities"),
);
const SvgReturnToTheHouseAlwaysWins = React.lazy(
  () => import("../icons/return-to-the-house-always-wins"),
);
const SvgReturnToTheMiskatonicMuseum = React.lazy(
  () => import("../icons/return-to-the-miskatonic-museum"),
);
const SvgReturnToTheEssexCountyExpress = React.lazy(
  () => import("../icons/return-to-the-essex-county-express"),
);
const SvgReturnToBloodOnTheAltar = React.lazy(
  () => import("../icons/return-to-blood-on-the-altar"),
);
const SvgReturnToUndimensionedAndUnseen = React.lazy(
  () => import("../icons/return-to-undimensioned-and-unseen"),
);
const SvgReturnToWhereDoomAwaits = React.lazy(
  () => import("../icons/return-to-where-doom-awaits"),
);
const SvgReturnToLostInTimeAndSpace = React.lazy(
  () => import("../icons/return-to-lost-in-time-and-space"),
);
const SvgResurgentEvils = React.lazy(() => import("../icons/resurgent-evils"));
const SvgErraticFear = React.lazy(() => import("../icons/erratic-fear"));
const SvgCreepingCold = React.lazy(() => import("../icons/creeping-cold"));
const SvgSecretDoors = React.lazy(() => import("../icons/secret-doors"));
const SvgYogSothothsEmissaries = React.lazy(
  () => import("../icons/yog-sothoths-emissaries"),
);
const SvgBeyondTheThreshold = React.lazy(
  () => import("../icons/beyond-the-threshold"),
);
const SvgReturnToCurtainCall = React.lazy(
  () => import("../icons/return-to-curtain-call"),
);
const SvgReturnToTheLastKing = React.lazy(
  () => import("../icons/return-to-the-last-king"),
);
const SvgReturnToEchoesOfThePast = React.lazy(
  () => import("../icons/return-to-echoes-of-the-past"),
);
const SvgReturnToTheUnspeakableOath = React.lazy(
  () => import("../icons/return-to-the-unspeakable-oath"),
);
const SvgReturnToAPhantomOfTruth = React.lazy(
  () => import("../icons/return-to-the-phantom-of-truth"),
);
const SvgReturnToThePallidMask = React.lazy(
  () => import("../icons/return-to-the-pallid-mask"),
);
const SvgReturnToBlackStarsRise = React.lazy(
  () => import("../icons/return-to-black-stars-rise"),
);
const SvgReturnToDimCarcosa = React.lazy(
  () => import("../icons/return-to-dim-carcosa"),
);
const SvgDelusoryEvils = React.lazy(() => import("../icons/delusory-evils"));
const SvgNeuroticFear = React.lazy(() => import("../icons/neurotic-fear"));
const SvgHastursEnvoys = React.lazy(() => import("../icons/hasturs-envoys"));
const SvgDecayingReality = React.lazy(
  () => import("../icons/decaying-reality"),
);
const SvgMaddeningDelusions = React.lazy(
  () => import("../icons/maddening-delusions"),
);
const SvgBeyondTheGatesOfSleep = React.lazy(
  () => import("../icons/beyond-the-gates-of-sleep"),
);
const SvgWakingNightmare = React.lazy(
  () => import("../icons/waking-nightmare"),
);
const SvgAThousandShapesOfHorror = React.lazy(
  () => import("../icons/a-thousand-shapes-of-horror"),
);
const SvgTheSearchForKadath = React.lazy(
  () => import("../icons/the-search-for-kadath"),
);
const SvgDarkSideOfTheMoon = React.lazy(
  () => import("../icons/dark-side-of-the-moon"),
);
const SvgPointOfNoReturn = React.lazy(
  () => import("../icons/point-of-no-return"),
);
const SvgWhereTheGodsDwell = React.lazy(
  () => import("../icons/where-gods-dwell"),
);
const SvgWeaverOfTheCosmos = React.lazy(
  () => import("../icons/weaver-of-the-cosmos"),
);
const SvgTerrorOfTheVale = React.lazy(
  () => import("../icons/terror-of-the-vale"),
);
const SvgDescentIntoThePitch = React.lazy(
  () => import("../icons/descent-into-the-pitch"),
);
const SvgMurderAtTheExcelsiorHotel = React.lazy(
  () => import("../icons/murder-at-the-excelsior-hotel"),
);
const SvgAlienInterference = React.lazy(
  () => import("../icons/alien-interference"),
);
const SvgDarkRituals = React.lazy(() => import("../icons/dark-rituals"));
const SvgExcelsiorManagement = React.lazy(
  () => import("../icons/excelsior-management"),
);
const SvgSinsOfThePast = React.lazy(() => import("../icons/sins-of-the-past"));
const SvgVileExperiments = React.lazy(
  () => import("../icons/vile-experiments"),
);
const SvgBlob = React.lazy(() => import("../icons/blob"));
const SvgBlobEpicMultiplayer = React.lazy(
  () => import("../icons/epic-multiplayer"),
);
const SvgBlobSingleGroup = React.lazy(() => import("../icons/single-group"));
const SvgMigoIncursion = React.lazy(() => import("../icons/migo"));
const SvgReadOrDie = React.lazy(() => import("../icons/read-or-die"));
const SvgAllOrNothing = React.lazy(() => import("../icons/all-or-nothing"));
const SvgBadBlood = React.lazy(() => import("../icons/bad-blood"));
const SvgByTheBook = React.lazy(() => import("../icons/by-the-book"));
const SvgRedTideRising = React.lazy(() => import("../icons/red-tide-rising"));
const SvgReturnToTheUntamedWilds = React.lazy(
  () => import("../icons/return-to-the-untamed-wilds"),
);
const SvgReturnToTheDoomOfEztli = React.lazy(
  () => import("../icons/return-to-the-doom-of-eztli"),
);
const SvgReturnToThreadsOfFate = React.lazy(
  () => import("../icons/return-to-threads-of-fate"),
);
const SvgReturnToTheBoundaryBeyond = React.lazy(
  () => import("../icons/return-to-the-boundary-beyond"),
);
const SvgReturnToHeartOfTheElders = React.lazy(
  () => import("../icons/return-to-the-heart-of-the-elders"),
);
const SvgReturnToPillarsOfJudgment = React.lazy(
  () => import("../icons/return-to-pillars-of-judgement"),
);
const SvgReturnToKnyan = React.lazy(() => import("../icons/return-to-knyan"));
const SvgReturnToTheCityOfArchives = React.lazy(
  () => import("../icons/return-to-city-of-archives"),
);
const SvgReturnToTheDepthsOfYoth = React.lazy(
  () => import("../icons/return-to-the-depths-of-yoth"),
);
const SvgReturnToShatteredAeons = React.lazy(
  () => import("../icons/return-to-shattered-aeons"),
);
const SvgReturnToTurnBackTime = React.lazy(
  () => import("../icons/return-to-turn-back-time"),
);
const SvgReturnToTheRainforest = React.lazy(
  () => import("../icons/return-to-the-rainforest"),
);
const SvgCultOfPnakotus = React.lazy(() => import("../icons/cult-of-pnakotus"));
const SvgDoomedExpedition = React.lazy(
  () => import("../icons/doomed-expedition"),
);
const SvgTemporalHunters = React.lazy(
  () => import("../icons/temporal-hunters"),
);
const SvgVenomousHate = React.lazy(() => import("../icons/venomous-hate"));
const SvgThePitOfDespair = React.lazy(
  () => import("../icons/grotto-of-despair"),
);
const SvgCreaturesOfTheDeep = React.lazy(
  () => import("../icons/creatures-from-below"),
);
const SvgFloodedCaverns = React.lazy(() => import("../icons/flooded-caves"));
const SvgRisingTide = React.lazy(() => import("../icons/rising-tide"));
const SvgShatteredMemories = React.lazy(
  () => import("../icons/shattered-memories"),
);
const SvgAgentsOfDagon = React.lazy(() => import("../icons/agents-of-dagon"));
const SvgAgentsOfHydra = React.lazy(() => import("../icons/agents-of-hydra"));
const SvgTheLocals = React.lazy(() => import("../icons/locals"));
const SvgFogOverInnsmouth = React.lazy(
  () => import("../icons/fog-over-innsmouth"),
);
const SvgTheVanishingOfElinaHarper = React.lazy(
  () => import("../icons/disappearance-of-elina-harper"),
);
const SvgSyzygy = React.lazy(() => import("../icons/syzygy"));
const SvgMalfunction = React.lazy(() => import("../icons/malfunction"));
const SvgInTooDeep = React.lazy(() => import("../icons/in-too-deep"));
const SvgDevilReef = React.lazy(() => import("../icons/devil-reef"));
const SvgHorrorInHighGear = React.lazy(
  () => import("../icons/horror-in-high-gear"),
);
const SvgALightInTheFog = React.lazy(
  () => import("../icons/a-light-in-the-fog"),
);
const SvgTheLairOfDagon = React.lazy(() => import("../icons/lair-of-dagon"));
const SvgIntoTheMaelstrom = React.lazy(
  () => import("../icons/into-the-maelstrom"),
);
const SvgWarOfTheOuterGods = React.lazy(
  () => import("../icons/war-of-the-outer-gods"),
);
const SvgDeathOfStars = React.lazy(() => import("../icons/death-of-the-stars"));
const SvgChildrenOfParadise = React.lazy(
  () => import("../icons/children-of-paradise"),
);
const SvgSwarmOfAssimilation = React.lazy(
  () => import("../icons/assimilating-swarm"),
);
const SvgMachinationsThroughTime = React.lazy(
  () => import("../icons/machinations-through-time"),
);
const SvgReturnToDisappearanceAtTheTwilightEstate = React.lazy(
  () => import("../icons/return-to-disappearance-at-the-twilight-estate"),
);
const SvgReturnToTheWitchingHour = React.lazy(
  () => import("../icons/return-to-the-witching-hour"),
);
const SvgReturnToAtDeathsDoorstep = React.lazy(
  () => import("../icons/return-to-at-deaths-doorstep"),
);
const SvgReturnToTheSecretName = React.lazy(
  () => import("../icons/return-to-the-secret-name"),
);
const SvgReturnToTheWagesOfSin = React.lazy(
  () => import("../icons/return-to-the-wages-of-sin"),
);
const SvgReturnToForTheGreaterGood = React.lazy(
  () => import("../icons/return-to-for-the-greater-good"),
);
const SvgReturnToUnionAndDisillusion = React.lazy(
  () => import("../icons/return-to-union-and-disillusion"),
);
const SvgReturnToInTheClutchesOfChaos = React.lazy(
  () => import("../icons/return-to-in-the-clutches-of-chaos"),
);
const SvgReturnToBeforeTheBlackThrone = React.lazy(
  () => import("../icons/return-to-before-the-black-throne"),
);
const SvgBloodthirstySpirits = React.lazy(
  () => import("../icons/bloodthirsty-spirits"),
);
const SvgUnspeakableFate = React.lazy(
  () => import("../icons/unspeakable-fate"),
);
const SvgCityOfTheDamned = React.lazy(
  () => import("../icons/city-of-the-damned"),
);
const SvgIceAndDeath = React.lazy(() => import("../icons/ice-and-death"));
const SvgTheCrash = React.lazy(() => import("../icons/the-crash"));
const SvgCreaturesInTheIce = React.lazy(
  () => import("../icons/creatures-in-the-ice"),
);
const SvgDeadlyWeather = React.lazy(() => import("../icons/deadly-weather"));
const SvgHazardsOfAntarctica = React.lazy(
  () => import("../icons/hazards-of-antarctica"),
);
const SvgSilenceAndMystery = React.lazy(
  () => import("../icons/silence-and-mystery"),
);
const SvgToTheForbiddenPeaks = React.lazy(
  () => import("../icons/to-the-forbidden-peaks"),
);
const SvgTheGreatSeal = React.lazy(() => import("../icons/the-great-seal"));
const SvgCityOfTheElderThings = React.lazy(
  () => import("../icons/city-of-the-elder-things"),
);
const SvgSleepingNightmares = React.lazy(
  () => import("../icons/sleeping-nightmares"),
);
const SvgNamelessHorrors = React.lazy(
  () => import("../icons/nameless-horrors"),
);
const SvgMemorialsOfTheLost = React.lazy(
  () => import("../icons/memorials-of-the-lost"),
);
const SvgFatalMirage = React.lazy(() => import("../icons/fatal-mirage"));
const SvgElderThings = React.lazy(() => import("../icons/elder-things"));
const SvgTheHeartOfMadness = React.lazy(
  () => import("../icons/the-heart-of-madness"),
);
const SvgStirringInTheDeep = React.lazy(
  () => import("../icons/stirring-in-the-deep"),
);
const SvgShoggoths = React.lazy(() => import("../icons/shoggoths"));
const SvgPenguins = React.lazy(() => import("../icons/penguins"));
const SvgMiasma = React.lazy(() => import("../icons/miasma"));
const SvgLostInTheNight = React.lazy(
  () => import("../icons/lost-in-the-night"),
);
const SvgLeftBehind = React.lazy(() => import("../icons/left-behind"));
const SvgExpeditionTeam = React.lazy(() => import("../icons/expedition-team"));
const SvgAgentsOfTheUnknown = React.lazy(
  () => import("../icons/agents-of-the-unknown"),
);
const SvgTekelili = React.lazy(() => import("../icons/tekeli-li"));
const SvgRiddlesAndRain = React.lazy(() => import("../icons/riddles-and-rain"));
const SvgMysteriesAbound = React.lazy(
  () => import("../icons/mysteries-abound"),
);
const SvgShadesOfSuffering = React.lazy(
  () => import("../icons/shades-of-sorrow"),
);
const SvgAgentsOfTheOutside = React.lazy(
  () => import("../icons/agents-of-the-outside"),
);
const SvgBeyondTheBeyond = React.lazy(
  () => import("../icons/beyond-the-beyond"),
);
const SvgCongressOfTheKeys = React.lazy(
  () => import("../icons/congress-of-the-keys"),
);
const SvgDancingMad = React.lazy(() => import("../icons/dancing-mad"));
const SvgDeadHeat = React.lazy(() => import("../icons/dead-heat"));
const SvgDogsOfWar = React.lazy(() => import("../icons/dogs-of-war"));
const SvgOutsiders = React.lazy(() => import("../icons/outsiders"));
const SvgScarletSorcery = React.lazy(() => import("../icons/scarlet-sorcery"));
const SvgSpatialAnomaly = React.lazy(() => import("../icons/spatial-anomaly"));
const SvgStrangeHappenings = React.lazy(
  () => import("../icons/strange-happenings"),
);
const SvgSecretWar = React.lazy(() => import("../icons/secret-war"));
const SvgShadowOfADoubt = React.lazy(
  () => import("../icons/shadow-of-a-doubt"),
);
const SvgWithoutATrace = React.lazy(() => import("../icons/without-a-trace"));
const SvgAgentsOfYuggoth = React.lazy(
  () => import("../icons/agents-of-yuggoth"),
);
const SvgCleanupCrew = React.lazy(() => import("../icons/cleanup-crew"));
const SvgCrimsonConspiracy = React.lazy(
  () => import("../icons/crimson-conspiracy"),
);
const SvgDarkVeiling = React.lazy(() => import("../icons/dark-veiling"));
const SvgDealingsInTheDark = React.lazy(
  () => import("../icons/dealings-in-the-dark"),
);
const SvgGlobetrotting = React.lazy(() => import("../icons/globetrotting"));
const SvgOnThinIce = React.lazy(() => import("../icons/on-thin-ice"));
const SvgRedCoterie = React.lazy(() => import("../icons/red-coterie"));
const SvgSanguineShadows = React.lazy(
  () => import("../icons/sanguine-shadows"),
);
const SvgSpreadingCorruption = React.lazy(
  () => import("../icons/spreading-corruption"),
);
const SvgFortuneAndFolly = React.lazy(
  () => import("../icons/fortune-and-folly"),
);
const SvgFortunesChosen = React.lazy(() => import("../icons/fortunes-chosen"));
const SvgPlanInShambles = React.lazy(() => import("../icons/plan-in-shambles"));
const SvgTheDevourerBelow = React.lazy(
  () => import("../icons/the-devourer-below"),
);
const SvgCurseOfTheRougarou = React.lazy(
  () => import("../icons/curse-of-the-rougarou"),
);
const SvgTheBayou = React.lazy(() => import("../icons/the-bayou"));
const SvgTheStranger = React.lazy(() => import("../icons/the-stranger"));
const SvgForgottenRuins = React.lazy(() => import("../icons/forgotten-ruins"));
const SvgDeadlyTraps = React.lazy(() => import("../icons/deadly-traps"));
const SvgTheDoomOfEztli = React.lazy(
  () => import("../icons/the-doom-of-eztli"),
);
const SvgTheUntamedWilds = React.lazy(
  () => import("../icons/the-untamed-wilds"),
);
const SvgYigsVenom = React.lazy(() => import("../icons/yigs-venom"));
const SvgTemporalFlux = React.lazy(() => import("../icons/temporal-flux"));
const SvgColdFog = React.lazy(() => import("../icons/cold-fog"));
const SvgThreateningEvil = React.lazy(
  () => import("../icons/threatening-evil"),
);
const SvgWitchwork = React.lazy(() => import("../icons/witchwork"));
const SvgSpectralRealm = React.lazy(() => import("../icons/spectral-realm"));

// these are not available yet:
// - "../icons/blob-that-ate-everything-else"
// - "../icons/migo1"
// - "../icons/laid-to-rest"
// - "../icons/relics-of-the-past"

function getEncounterIcon(code?: string) {
  switch (code) {
    case "torch":
      return SvgTorch;
    case "arkham":
      return SvgArkham;
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
