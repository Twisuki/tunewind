// #region config

/** config file names, resolved in order */
export const CONFIG_FILES = [
  "tune.config.ts",
  "tune.config.mts",
  "tune.config.js",
  "tune.config.mjs",
]

// #endregion

// #region postcss

/** postcss plugin name of the preset plugin */
export const PRESET_PLUGIN_NAME = "tunewind-preset"

/** postcss plugin name of the guard plugin */
export const GUARD_PLUGIN_NAME = "tunewind-guard"

/** at-rule replaced by the generated css */
export const AT_RULE_NAME = "tunewind"

// #endregion

// #region tailwind

/** color family names of the tailwind default palette */
export const COLOR_FAMILIES = [
  "amber",
  "blue",
  "cyan",
  "emerald",
  "fuchsia",
  "gray",
  "green",
  "indigo",
  "lime",
  "mauve",
  "mist",
  "neutral",
  "olive",
  "orange",
  "pink",
  "purple",
  "red",
  "rose",
  "sky",
  "slate",
  "stone",
  "taupe",
  "teal",
  "violet",
  "yellow",
  "zinc",
] as const

/** shade numbers of the tailwind default palette */
export const COLOR_SHADES = [
  50,
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
  950,
] as const

/** color family name */
export type ColorFamily = (typeof COLOR_FAMILIES)[number]

/** shade number */
export type ColorShade = (typeof COLOR_SHADES)[number]

// #endregion
