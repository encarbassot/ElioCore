import ERROR from "../ERRORS.js"
import { c } from "./beautyConsole.js";
import fs from "fs"



/**
 * Wraps an asynchronous route handler with try-catch logic to handle errors and send a default success response.
 * If the original handler does not explicitly send a response, a default success response will be sent.
 *
 * @param {Function} handler - The original asynchronous route handler function.
 * @returns {Function} - A new function that includes try-catch logic and sends a default success response.
 *
 * @example
 // Using tryCatch as a middleware for an Express route
 router.post("/example", tryCatch(async (req, res) => {
   const result = await someAsyncFunction();
   //res.sendOk(result);
   return result
 }));
 */
 export function requestTryCatch (handler){
  return async (req, res) => {
    try {
      const data = await handler(req, res);
      
      // Check if the response has been sent
      if (!res.headersSent) {
        if(data){
          res.sendOk(data || undefined)
        }else{
          res.sendBad()
        }
      }
    } catch (error) {
      if(req.uploadMetadata?.path){
        fs.unlinkSync(req.uploadMetadata.path);
      }

      if(error.code === "ER_DUP_ENTRY"){
        return res.sendBad(ERROR.DUPLICATE,"El valor ya existe")
      }else if(error.code === "ER_NO_REFERENCED_ROW_2"){
        return res.sendBad(ERROR.DATA_CORRUPT,"Algunos datos son incompatibles")
      }else if(error.code === "ER_ROW_IS_REFERENCED_2"){
        return res.sendBad(ERROR.INFORMATION_DEPENDENT)
      }
      console.log(c("y",error.code))
      res.catch(error, import.meta);
    }
  };
};


