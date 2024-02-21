import { showErrorAndExit, checkPackageRoot, tryImport } from './__shared.mjs'
import { promisify } from 'node:util'
import { exec } from 'node:child_process'
import semver from 'semver'
import { resolve, join, delimiter } from 'node:path'

const execAsync = promisify(exec)

const { localConfig } = await tryImport('./antlrGen.local.mjs', { localConfig: {} })
const ANTLR_EXECUTABLE = getAntlrExecutableFromConfig(localConfig) ?? 'antlr4'
const ANTLR_REQUIRED_VERSION = '4.13.x'
const TM_DIRECTORY = resolve('src/languages/tm/parse')

async function main() {
  await checkPackageRoot()
  await checkAntlrInstallation()

  for (const args of [
    { sourceDir: TM_DIRECTORY, fileName: 'TMLexer.g4' },
    { sourceDir: TM_DIRECTORY, fileName: 'TMParser.g4' }
  ]) {
    await generateAntlrRecognizer(args)
  }
}

async function checkAntlrInstallation() {
  try {
    const { stdout } = await execAsync(ANTLR_EXECUTABLE)

    const version = /Version\s+(\d+\.\d+\.\d+)/g.exec(stdout)[1] ?? 'unknown'

    if (!semver.satisfies(version, ANTLR_REQUIRED_VERSION)) {
      showErrorAndExit(
        `ANTLR version ${ANTLR_REQUIRED_VERSION} is required but ${version} is installed.`
      )
    }
  } catch (err) {
    if (err.code === 127) {
      showErrorAndExit(`'${ANTLR_EXECUTABLE}' command not found.`)
    }
  }
}

async function generateAntlrRecognizer(args) {
  const source = join(args.sourceDir, args.fileName)
  const output = args.outputDir ?? join(args.sourceDir, 'gen')
  const imports = args.importDir ?? args.sourceDir
  const command = `${ANTLR_EXECUTABLE} -o ${output} -listener -visitor -Dlanguage=TypeScript -lib ${imports} ${source}`

  try {
    console.log(`Generating ${args.fileName} ...`)
    const { stderr } = await execAsync(command)
    console.log(stderr)
  } catch (err) {
    console.log(err.stderr)
    showErrorAndExit(`'${ANTLR_EXECUTABLE}' exited with code ${err.code}.`)
  }
}

function getAntlrExecutableFromConfig(cfg) {
  let exec = undefined

  let classPath = undefined
  if (
    typeof cfg.antlr4ClassPath === 'object' &&
    'base' in cfg.antlr4ClassPath &&
    'paths' in cfg.antlr4ClassPath
  ) {
    classPath = cfg.antlr4ClassPath.paths
      .map((p) => join(cfg.antlr4ClassPath.base, p))
      .join(delimiter)
  } else if (Array.isArray(cfg.antlr4ClassPath)) {
    classPath = cfg.antlr4ClassPath.join(delimiter)
  } else if (typeof cfg.antlr4ClassPath === 'string') {
    classPath = cfg.antlr4ClassPath
  }

  let mainClass = undefined
  if (typeof cfg.antlr4MainClass === 'string') {
    mainClass = cfg.antlr4MainClass
  }

  if (classPath !== undefined && mainClass !== undefined) {
    exec = `java -cp '${classPath}' ${mainClass}`
  }

  return exec
}

await main()
