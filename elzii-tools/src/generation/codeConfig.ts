export class ElizalinaRuntimeConfig {
  private static readonly numberFormatAccessorName = 'number'

  public static readonly moduleName = 'elzii'
  public static readonly formatterClassName = 'Fmt'
  public static readonly formatMethodName = 'format'
}

export class GeneratedCodeConfig {
  public static readonly formatterPropertyName = 'fmt'
}

export class PlaceholdersConfig {
  public static readonly userCodePlaceholderPrefix = '__$usr_'

  public static readonly userCodePlaceholderFormat = /__\$usr_[0-9a-f]{8}/g
}
