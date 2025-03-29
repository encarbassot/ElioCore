import jwt from "jsonwebtoken"


function unzipJWT(token,secret){
  if (!token) return;
  const userData = jwt.verify(token, secret);
  return userData
}



export function jwtVerify(tokenChecker, config){

  return async (req, res, next) => {

    
    try {
      let token =
      req.body.token || req.query.token || req.headers["authorization"] || req.headers["Authorization"];
      
      if (!token) {
        return res.status(403).json({
          success: false,
          msg: "A token is required for authentication",
        });
      }
      
      if(token.startsWith("Bearer ")){
        token = token.replace("Bearer ","")
      }
      
      if(tokenChecker){

        const jwt = unzipJWT(token, config.JWT_SECRET)

        const user = tokenChecker(jwt,token)
        if(!user){
          return res.status(401).json({ success: false, msg: "Invalid Token" });
        }
        req.user = user;
      }
      // else{
      //   const user = await db_getUserByJWT(token);
    
      //   if (!user) {
      //     return res.status(401).json({ success: false, msg: "Invalid Token" });
      //   }
    
      //   req.user = user;
      // }
      
      return next();
    } catch(err) {
      console.error(err)
      return res.status(401).json({ success: false, msg: "Invalid Token" });
    }
  }
}