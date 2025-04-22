import jwt from "jsonwebtoken"
// import db from "../db/db.js";
// import { User } from "../models/User.js";

// import { db_getUserByJWT } from "../db/db_users.js";
// import { ERROR } from "./requestManager.js";

export function jwtSign(data,config = {}){
  
  return jwt.sign(data, config.JWT_SECRET, { expiresIn: config.JWT_TIMEOUT });
}
