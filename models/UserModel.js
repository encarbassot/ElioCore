import { verifyPassword } from "../utils/crypto.js"
import { jwtSign } from "../utils/jwt.js"

export default class UserModel{

  #password
  #salt
  #email
  #jwt
  #activated
  #created_at
  #updated_at

  constructor({
    id,
    email,
    password,
    salt,
    jwt,
    activated,
    created_at,
    updated_at,
  }){
    this.id = id
    this.email = email
    this.#password = password
    this.#salt = salt
    this.#activated = activated
    this.#created_at = created_at
    this.#updated_at = updated_at
  }


  verifyPassword(password){
    return verifyPassword(this.#password,this.#salt,password)
  }

  signJWT(config){
    if(!config){
      console.log("MISSING JWT CONFIG IN signJWT()",config)
    }
    this.#jwt = jwtSign({id:this.id},config)
    return this.#jwt
  }

  with(...keys){
    const result = {...this}
    if(keys.includes("jwt")){
      result.jwt = this.#jwt
    }

    if(keys.includes("email")){
      result.email = this.#email
    }

    return result
  }

}