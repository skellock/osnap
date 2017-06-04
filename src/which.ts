import * as pify from 'pify'
import * as whichLib from 'which'

const pwhich = pify(whichLib)

/**
 * Returns the path to a program, or throws an Error if we can't find it.
 *
 * @param program The program to search for.
 */
export async function which(program: string): Promise<string> {
  const path: string = await pwhich(program)
  return path
}
