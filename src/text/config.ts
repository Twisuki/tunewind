export const config = {
  keyFormat: "key must match [A-Za-z0-9_]+",
  colorScaleEmpty: "color scale must define at least one shade",
  defaultUnitRequired: "units must define a default unit",
  fileNotFound: (cwd: string, files: string[]) => `tune config not found in ${cwd}, expected one of ${files.join(", ")}`,
  defaultExportRequired: (file: string) => `${file} must export default config`,
  invalid: (file: string, detail: string) => `invalid tune config in ${file}\n${detail}`,
}
