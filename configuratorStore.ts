# extensions/dtf-configurator/shopify.extension.toml
api_version = "2024-07"

[[extensions]]
type = "theme"
name = "DTF Configurator Block"
handle = "dtf-configurator"

  [[extensions.targeting]]
  module = "./blocks/dtf-configurator.liquid"
  target = "section"
