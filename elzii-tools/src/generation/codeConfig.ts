const CodeConfig = {
  ElizalinaRuntime: {
    ModuleName: 'elzii',
    FormatterClassName: 'Fmt',
    FormatMethodName: 'format',
    LocaleSelection: {
      ClassName: 'Elz',
      ListPropertyName: 'locales',
      IdPropertyName: 'id',
      LoaderPropertyName: 'messages',
    },
    MakeProxyMethodName: 'makeLocaleProxy',
  },

  GeneratedCode: {
    FormatterPropertyName: 'fmt',
  },

  Placeholders: {
    UserCode: {
      Prefix: '__$usr_',
      Format: /__\$usr_[0-9a-f]{8}/g,
    },
  },
}

type DeepReadonly<T extends Record<string, unknown>> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown> ? DeepReadonly<T[P]> : T[P]
}

export default CodeConfig as DeepReadonly<typeof CodeConfig>
