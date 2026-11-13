import antfu from "@antfu/eslint-config"

export default antfu({
  type: "lib",
  typescript: true,
  markdown: false,
  stylistic: {
    quotes: "double",
  },
  formatters: true,
})
