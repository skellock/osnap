/**
 * The different types of errors that can happen.
 */
export enum ErrorCode {
  Unknown,
  MissingPlatform,
  InvalidPlatform,
  MissingXcrun,
  MissingAndroidHome,
  MissingAndroidAdb,
  MissingPerl,
  NoRunningiOSSimulators,
  NoRunningAndroidEmulators,
  AmbiguousAndroidEmulator,
  MissingAndroidEmulator,
  ScreenshotFail,
  CopyToClipboardFail,
  ClipboardPlatformUnsupported
}

export interface OsnapError extends Error {
  /** The error code */
  code: ErrorCode
  /** Additional human-facing error message */
  details?: string
}

const errorMap: { [code: number]: string } = {
  [ErrorCode.MissingPlatform]: `Platform is required.  Must be 'ios' or 'android'.`,
  [ErrorCode.InvalidPlatform]: `Unrecognized platform.  'ios' or 'android' are supported.`,
  [ErrorCode.MissingXcrun]: `Unable to find 'xcrun' on your path.`,
  [ErrorCode.MissingAndroidHome]: `Unable to find ANDROID_HOME environment varilable.`,
  [ErrorCode.MissingAndroidAdb]: `Unable to find adb.`,
  [ErrorCode.MissingPerl]: `Unable to find perl which is used to clean up goofy output from adb.`,
  [ErrorCode.NoRunningiOSSimulators]: `No iOS simulators are running.`,
  [ErrorCode.NoRunningAndroidEmulators]: `No android emulators or devices connected.`,
  [ErrorCode.ScreenshotFail]: `Some horrible happened while taking a screenshot.`,
  [ErrorCode.CopyToClipboardFail]: `Unable to copy the image bytes to the clipboard. Sorry about that.`,
  [ErrorCode.ClipboardPlatformUnsupported]: `Unable to copy to the clipboard on this platform. PRs welcome.`,
  [ErrorCode.AmbiguousAndroidEmulator]: `Multiple android devices connected, please specify a device with -d.`,
  [ErrorCode.MissingAndroidEmulator]: `The specified device is currently not connected.`
}

/**
 * Creates an OSnapError.
 *
 * @param code The error code.
 * @param message An optional error message.
 */
export function createError(code: ErrorCode, details?: string) {
  const e = new Error() as OsnapError
  e.message = errorMap[code]
  e.details = details
  e.code = code
  return e
}
