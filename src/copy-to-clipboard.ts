import * as execa from 'execa'
import { ErrorCode, createError } from './errors'
import { resolve } from 'path'

// TODO: support other platforms other than mac
const pathToCopyApp = resolve(`${__dirname}/../macos/pbcopyimg`)

export async function copyToClipboard(imagePath: string) {
  // verify the platform
  if (process.platform !== 'darwin') {
    throw createError(ErrorCode.ClipboardPlatformUnsupported)
  }

  // run the command to copy to the clipboard
  try {
    await execa(pathToCopyApp, [imagePath])
  } catch (err) {
    // was there a horrible issue?
    throw createError(ErrorCode.CopyToClipboardFail)
  }

  return true
}
