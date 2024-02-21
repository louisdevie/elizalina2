const { promisify } = await import('node:util')
const { stat } = await import('node:fs')
const { exit } = await import('node:process')
const { resolve } = await import('node:path')
const statAsync = promisify(stat)

export function showErrorAndExit(message) {
  console.log('Error: ' + message)
  exit(1)
}

export async function checkPackageRoot() {
  let packageJsonFound
  try {
    const packageJson = await statAsync(resolve('package.json'))
    packageJsonFound = packageJson.isFile()
  } catch (err) {
    packageJsonFound = false
  }

  if (!packageJsonFound)
    showErrorAndExit('This script needs to be executed from the root of the package.')
}

export async function tryImport(id, fallback) {
  let imported = fallback;

  try {
    imported = await import(id)
  } catch (error) {  }

  return imported
}