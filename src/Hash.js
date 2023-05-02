const bcrypt = require('bcryptjs');

const saltRounds = 5;

export async function toHash(plainText){
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(plainText, saltRounds, function(err, hash) {
          if (err) reject(err)
          resolve(hash)
        });
      })
    
      return hashedPassword

   
}
export async function hashCompare(plainText,hashed){
    
    const compareResult = await new Promise((resolve, reject) => {
        bcrypt.compare(plainText, hashed, function(err, result) {
          if (err) reject(err)
          resolve(result)
        });
      })
   
    return compareResult;
}