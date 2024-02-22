import { TargetsConfigBuilder, OutputConfigBuilder, TargetConfigBuilder } from '@module/options'

test('OutputConfigBuilder', () => {
  let jsOnly = new OutputConfigBuilder({ js: 'path/to/js' })
  expect(jsOnly.js).toMatchObject({ enabled: true, directory: 'path/to/js' })
  expect(jsOnly.dts).toMatchObject({ enabled: false })
  expect(jsOnly.ts).toMatchObject({ enabled: false })

  let jsAndNoDts = new OutputConfigBuilder({ js: 'path/to/js', dts: false })
  expect(jsAndNoDts.js).toMatchObject({ enabled: true, directory: 'path/to/js' })
  expect(jsAndNoDts.dts).toMatchObject({ enabled: false })
  expect(jsAndNoDts.ts).toMatchObject({ enabled: false })

  let jsAndDtsSameDir = new OutputConfigBuilder({ js: 'path/to/js', dts: true })
  expect(jsAndDtsSameDir.js).toMatchObject({ enabled: true, directory: 'path/to/js' })
  expect(jsAndDtsSameDir.dts).toMatchObject({ enabled: true, directory: 'path/to/js' })
  expect(jsAndDtsSameDir.ts).toMatchObject({ enabled: false })

  let jsAndDtsSetDir = new OutputConfigBuilder({ js: 'path/to/js', dts: 'path/to/dts' })
  expect(jsAndDtsSetDir.js).toMatchObject({ enabled: true, directory: 'path/to/js' })
  expect(jsAndDtsSetDir.dts).toMatchObject({ enabled: true, directory: 'path/to/dts' })
  expect(jsAndDtsSetDir.ts).toMatchObject({ enabled: false })

  let ts = new OutputConfigBuilder({ ts: 'path/to/ts' })
  expect(ts.js).toMatchObject({ enabled: false })
  expect(ts.dts).toMatchObject({ enabled: false })
  expect(ts.ts).toMatchObject({ enabled: true, directory: 'path/to/ts' })
})

test('TargetConfigBuilder', () => {
  let target = new TargetConfigBuilder()

  expect(() => target.translations).toThrow()
  expect(() => target.output).toThrow()
  expect(target.interfaceName).toEqual('Locale')
  expect(target.functionName).toEqual('elz')
  expect(target.singleFile).toBeFalsy()

  target.merge(
    {
      translations: 'path/to/translations',
      output: {
        js: 'path/to/js',
      },
      functionName: 'locale',
    },
    true,
    'in tests',
  )

  expect(target.translations).toEqual('path/to/translations')
  expect(target.output).toMatchObject({ js: { enabled: true, directory: 'path/to/js' } })
  expect(target.interfaceName).toEqual('Locale')
  expect(target.functionName).toEqual('locale')
  expect(target.singleFile).toBeFalsy()
})

test('ConfigBuilder', () => {
  let singleTarget = new TargetsConfigBuilder()

  singleTarget.merge(
    {
      translations: 'something',
      output: { js: 'path/to/js' },
    },
    true,
    'in tests',
  )

  expect(singleTarget.allTargets).toContain('default')
  expect(singleTarget.getTarget('default').translations).toEqual('something')

  let multipleTargets = new TargetsConfigBuilder()

  multipleTargets.merge(
    {
      targetA: {
        translations: 'something',
        output: { js: 'path/to/js' },
      },
      targetB: {
        translations: 'something/else',
        output: { js: 'path/to/js' },
      },
    },
    true,
    'in tests',
  )

  expect(multipleTargets.allTargets).toContain('targetA')
  expect(multipleTargets.allTargets).toContain('targetB')
  expect(multipleTargets.getTarget('targetA').translations).toEqual('something')
  expect(multipleTargets.getTarget('targetB').translations).toEqual('something/else')
})
