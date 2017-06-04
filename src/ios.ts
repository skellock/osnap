import { CliParameters } from './cli-parameters'
import { which } from './which'
import { ErrorCode, createError } from './errors'
import * as execa from 'execa'

/**
 * Finds the path to xcrun or throws an error.
 */
export async function getXcrunPath() {
  try {
    return await which('xcrun')
  } catch (err) {
    throw createError(ErrorCode.MissingXcrun)
  }
}

/**
 * Checks to see if a simulator is booted and ready to ask for a screen shot.
 *
 * @param xcrunPath The path to xcrun
 */
export async function checkSimulator(xcrunPath: string) {
  // get the list of simulators
  const response = await execa(xcrunPath, ['simctl', 'list'])
  const stdout = response.stdout as string

  // count the number of ones started
  const reducer = (acc, line) => (line.indexOf('Booted') >= 0 ? acc + 1 : acc)
  const count = stdout.split('\n').reduce(reducer, 0)

  if (count === 0) throw createError(ErrorCode.NoRunningiOSSimulators)
}

/**
 * Takes a screenshot of the current running simulator and saves it to a file.
 *
 * @param xcrunPath The path to xcrun
 * @param filename The filename to save
 */
export async function saveScreenshot(xcrunPath: string, filename: string) {
  try {
    const response = await execa(xcrunPath, ['simctl', 'io', 'booted', 'screenshot', filename])
    if (response.code !== 0) {
      throw createError(ErrorCode.ScreenshotFail)
    }
  } catch (err) {
    throw createError(ErrorCode.ScreenshotFail)
  }
}

/**
 * Runs the iOS snapshot.
 *
 * @param parameters The CLI parameters
 */
export async function saveToFile(parameters: CliParameters) {
  const xcrun = await getXcrunPath()
  await checkSimulator(xcrun)
  await saveScreenshot(xcrun, parameters.filename)
}
