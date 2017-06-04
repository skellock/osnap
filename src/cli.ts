import { parse } from './cli-parameters'
import { OsnapError, ErrorCode } from './errors'
import { usage } from './cli-usage'
import { saveToFile as iosSave } from './ios'
import { saveToFile as androidSave } from './android'
import { copyToClipboard } from './copy-to-clipboard'

/**
 * Runs the CLI and returns the exit code we should use.
 */
export async function run() {
  try {
    const parameters = parse()

    // save it to a file
    if (parameters.platform === 'ios') {
      await iosSave(parameters)
    } else if (parameters.platform === 'android') {
      await androidSave(parameters)
    }

    // copy it to the clipboard
    if (parameters.useClipboard) {
      await copyToClipboard(parameters.filename)
    }

    return 0
  } catch (err) {
    // typescript doesn't support typing the catch parameter
    if ((err as OsnapError).code === ErrorCode.MissingPlatform) {
      // print usage instead
      console.log(usage)
      return 0
    } else {
      console.error(err.message)
      return 1
    }
  }
}
