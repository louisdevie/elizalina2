export class ElizalinaRuntimeConfig {
  private static readonly numberFormatAccessorName = 'number'

  public static readonly globalFormatterInstanceName = '$f'
  public static readonly moduleName = 'elzii'

  public static get globalFormatterShorthandPrefix(): string {
    return ElizalinaRuntimeConfig.globalFormatterInstanceName + '.'
  }

  public static get numberFormatAccessorPrefix(): string {
    return (
      ElizalinaRuntimeConfig.globalFormatterShorthandPrefix +
      ElizalinaRuntimeConfig.numberFormatAccessorName
    )
  }
}

export class PlaceholdersConfig {
  public static readonly userCodePlaceholderPrefix = '__$usr_'

  public static readonly userCodePlaceholderFormat = /__\$usr_[0-9a-f]{8}/g
}
