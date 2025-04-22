import crypto from "node:crypto"

export const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export const CHARSET_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


// Function to generate a secure random salt
export function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString('hex')
}


export function hashPassword(password,salt = undefined) {

  if(salt===undefined){
    salt = generateSalt()
  }
  const iterations = 10000
  const keylen = 64
  const digest = 'sha512'

  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)
  const hashedPwd = hash.toString('hex')
  return {salt, hash: hashedPwd}
}


// Function to verify a password
export function verifyPassword(storedHash, storedSalt, inputPassword) {
  const { hash: inputHash } = hashPassword(inputPassword, storedSalt);
  return storedHash === inputHash;
}

// // Example usage
// const { salt, hash } = hashPassword("hello");
// console.log(salt, hash);
// const ok = verifyPassword(hash, salt, "hello");
// console.log("OK,", ok);


