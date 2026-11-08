export const generate = {
  shadeMissing: (family: string, shade: number) => `color family "${family}" has no shade ${shade}`,
  themeDuplicated: (theme: string) => `theme "${theme}" is defined more than once`,
  unknownUnit: (breakpoint: string, unit: string) => `breakpoint "${breakpoint}" overrides unknown unit "${unit}"`,
}
