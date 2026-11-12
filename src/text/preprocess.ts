export const preprocess = {
  breakpointDuplicated: (first: string, second: string) => `breakpoints "${first}" and "${second}" have the same width`,
  breakpointPrefixDuplicated: (first: string, second: string) => `breakpoints "${first}" and "${second}" share the same prefix`,
  breakpointWidthMissing: (breakpoint: string) => `breakpoint "${breakpoint}" has no width and no built-in width`,
  maxMissing: (unit: string) => `size unit "${unit}" has no max`,
  rangeReversed: (unit: string) => `size unit "${unit}" has larger min than max`,
  shadeMissing: (family: string, shade: number) => `color family "${family}" has no shade ${shade}`,
  themeDuplicated: (theme: string) => `theme "${theme}" is defined more than once`,
  unknownUnit: (breakpoint: string, unit: string) => `breakpoint "${breakpoint}" overrides unknown unit "${unit}"`,
}
