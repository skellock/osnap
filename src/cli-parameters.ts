import * as minimist from 'minimist'
import { createError, ErrorCode } from './errors'
import * as tempfile from 'tempfile'

export type Platform = 'ios' | 'android'

/**
 * The parameters passed in from the command line.
 */
export interface CliParameters {
  /** Will we be using ios or android? */
  platform?: Platform
  /** A file name to save the image. */
  filename: string
  /** An optional device name for android if more than 1 device is plugged in. */
  device?: string
  /** Should we use the clipboard? */
  useClipboard: boolean
}

/**
 * Grabs the platform or dies horribly.
 *
 * @param parsed The minimist parsed arguments.
 */
function getPlatform(parsed: minimist.ParsedArgs) {
  const platform = parsed._[0] as string

  // no platform?
  if (!platform) throw createError(ErrorCode.MissingPlatform)

  // bad platform?
  if (platform !== 'ios' && platform !== 'android') {
    throw createError(ErrorCode.InvalidPlatform)
  }

  return platform
}

/**
 * Parses and validates the CLI parameter.
 *
 * @param argv The parameters to use (default: reads from `process.argv`)
 */
export function parse(argv?: string[]): CliParameters {
  // use the default process args if nothing was passed in
  argv = argv || process.argv.slice(2)

  // parse the arguments with minimist
  const parsed = minimist(argv)

  // grab what we need
  const platform = getPlatform(parsed)
  const useClipboard = !parsed['f']
  const filename = (parsed['f'] as string) || tempfile('.png')
  const device = parsed['device'] as string

  return { platform, filename, device, useClipboard }
}
