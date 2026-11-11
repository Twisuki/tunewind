import { BYPASS_MARKER } from "@/const/postcss"

/** register the variant exempting a class from the checks */
export function buildRaw(): string {
  return `@custom-variant ${BYPASS_MARKER} (&);`
}
