import { CliParameters } from './cli-parameters'
import { ErrorCode, createError } from './errors'
import { which } from './which'
import * as execa from 'execa'
import { existsSync, createWriteStream } from 'fs'

/**
 * Finds the path to adb or throws an error.
 */
export function getAdbPath() {
  const androidHome = process.env['ANDROID_HOME']
  if (!androidHome) {
    throw createError(ErrorCode.MissingAndroidHome)
  }
  const adb = `${androidHome}/platform-tools/adb`
  if (!existsSync(adb)) {
    throw createError(ErrorCode.MissingAndroidAdb)
  }
  return adb
}

/**
 * Finds the path to perl or throws an error.
 */
export async function getPerlPath() {
  try {
    return await which('perl')
  } catch (err) {
    throw createError(ErrorCode.MissingPerl)
  }
}

/**
 * Checks to see if a simulator is booted and ready to ask for a screen shot.
 *
 * @param adb The path to adb
 * @param device An optional target android device id
 */
export async function checkEmulator(adb: string, device?: string) {
  // get the list of simulators
  const response = await execa(adb, ['devices'])
  const stdout = response.stdout as string

  const devices = stdout
    .split('\n')
    .filter(line => line.endsWith('\tdevice'))
    .map(line => line.replace('\tdevice', ''))

  // not enough devices?
  if (devices.length === 0) {
    throw createError(ErrorCode.NoRunningAndroidEmulators)
  }

  // only 1 and no preference?  just pick that.
  if (devices.length === 1 && !device) {
    return devices[0]
  }

  // too many devices?
  if (devices.length > 1 && !device) {
    throw createError(ErrorCode.AmbiguousAndroidEmulator)
  }

  // can't find what the user is looking for?
  if (devices.indexOf(device) < 0) {
    throw createError(ErrorCode.MissingAndroidEmulator)
  }
}

/**
 * Takes a screenshot of the current running simulator and saves it to a file.
 *
 * @param adb The path to adb
 * @param device The android device id
 * @param filename The filename to save
 */
export async function saveScreenshot(adb: string, perl: string, device: string, filename: string) {
  return new Promise((resolve, reject) => {
    try {
      // up the max buffer size since these could be huge iamges
      const maxBuffer = 1024 * 1000 * 50 // 50 MB

      // create the processes needed in the chain
      const adbProcess = execa(adb, ['-s', device, 'shell', 'screencap', '-p'], { maxBuffer })
      const perlProcess = execa(perl, ['-pe', 's/\\x0D\\x0A/\\x0A/g'], { maxBuffer })

      // hook up the chain: adb -> perl -> image.png
      adbProcess.stdout.pipe(perlProcess.stdin)
      perlProcess.stdout.pipe(createWriteStream(filename))

      // determine when we've ended
      perlProcess.on('exit', exitCode => {
        if (exitCode === 0) {
          resolve()
        } else {
          reject()
        }
      })
    } catch (err) {
      throw createError(ErrorCode.ScreenshotFail)
    }
  })
}

/**
 * Runs the Android snapshot.
 *
 * @param parameters The CLI parameters
 */
export async function saveToFile(parameters: CliParameters) {
  const adb = getAdbPath()
  const perl = await getPerlPath()
  const device = await checkEmulator(adb, parameters.device)
  await saveScreenshot(adb, perl, device, parameters.filename)
}
