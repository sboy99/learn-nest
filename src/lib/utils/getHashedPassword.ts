import * as bcryptjs from 'bcryptjs';

export async function getHashedPassword(pwd: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(pwd, salt);
  return hash;
}

export async function comparePassword(
  pwd: string,
  hash: string,
): Promise<boolean> {
  const isMatch = await bcryptjs.compare(pwd, hash);
  return isMatch;
}
