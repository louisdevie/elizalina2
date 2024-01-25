import { Options } from './options'
import { Show } from './show'
import { Config } from './config'

export { Show, Config }

/**
 * The version of the package.
 */
export const version = '0.1.0'

/**
 * Create options to configure elzii tooling.
 * @param opts The options object.
 */
export const defineConfig = (opts: Options) => opts

/**
 * default Config instance.
 */
export const config = new Config()

/**
 * default Show instance that uses the default config instance.
 */
export const show = new Show(config)
config.useShowInstance(show)
