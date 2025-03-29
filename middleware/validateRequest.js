import Joi from "joi";
import ERROR from "../ERRORS.js";

export function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const objResponse = {
        fields: {},
        more: error._original // This includes the original invalid input data
      };

      error.details.forEach(detail => {
        objResponse.fields[detail.path.join(".")] = detail.message;
      });

      return res.sendBad(ERROR.VALIDATION_ERROR, objResponse);
    }

    req.value = value;
    next();
  };
}





// function logicStringFromLogicArray(logicArray){
//   function logicString(logic,level = 0){
//     if(typeof(logic) === "boolean"){
//       return logic?"true":"false"
//     }else if(typeof(logic) === "string"){
//       return logic
//     }else if(Array.isArray(logic)){
//       let result = "( "
//       const logicGate = level%2===0?"AND":"OR"
//       result += logic.map(x=>logicString(x,level+1)).join(` ${logicGate} `)
//       result+=" )"
//       return result
//     }else{
//       if(logic.type === "array"){
//         return (logic.key?logic.key+":":"")+`[${logicStringFromLogicArray(logic.subtype)}]`
//       }else if(logic.type==="object"){
//         return (logic.key?logic.key+":":"")+`{${logicStringFromLogicArray(logic.values)}}`
//       }else {
//         return logic.key+":"+logic.type
//       }
//     }
//   }
//   return logicString(logicArray)
// }


// /**
//  * Extracts and validates required data from the request body based on a logical condition.
//  *
//  * @param {Object} req - Express request object.
//  * @param {Object} res - Express response object.
//  * @param {Array|String} logic - Logical condition specifying required keys in the request body.
//  * @param {Boolean} firstLevelOr - if set to true, odd levels are considered OR and even are AND
//  * @throws {Error} - Throws an error if the response has already been sent.
//  * @returns {Object} - Extracted and validated required data from the request body.
//  * 
//  * this also can be used as a <req> method as req.requireBodyData (will be funny req.uireBodyData)
//  * @example
//  *   const {colorName,colorHex,colorFinish} = req.requireBodyData(["colorName","colorHex","colorFinish"])
//  * 
//  * 
//  * @example of <logic>
//  * 
//  * -> "username" -> username is required
//  * -> ["username","password"] -> (username AND passwords) are required
//  * -> [["username","email"]] -> (username OR email) is required
//  * -> ["colorId",["colodName","colorHex"]] -> (colorId AND (colorName OR colorHex))
//  * -> ["A",["B",["C","D"]]] -> (A AND (B OR (C AND D)))
//  * 
//  * checking types and more
//  * -> "brandId:number" >> will check brandId to be a number
//  * -> {key:"brandId",type:"number"} >> same as before
//  * -> {key:"value",type:"string"}
//  * -> {key:"value",type:"boolean"}
//  * -> {key:"value",type:"object",values:[]} -> the array <values> is like another instance of logic array (starting with AND)
//  * -> {key:"value",type:"array",subtype:"number"} -> checks if all subelements of the array are numbers
//  * -> {key:"value",type:"array",subtype:"string"}
//  * -> {key:"value",type:"array",subtype:"boolean"}
//  * -> {key:"value",type:"array",subtype:{
//  *      type:"object",
//  *      values:[] -> this array is like another instance of logic array (starting with AND)
//  *    }}
//  * 
//  * all the types declared as object also accept a function <check>
//  *     {key:"name",type:"string",check:v=>v.length>0}, >>will not accept empty strings
//  * 
//  * // Requires 'field1' and optionaly 'field2' or 'field3'.
//  * const { field1, field2, field3 } = req.requireBodyData(["field1", ["field2", "field3", true]]);
//  * 
//  * 
//  * @example with <firstLevelOr> set to true:
//  *   const { username, email } = req.requireBodyData(["username", "email"], true);
//  *   // Requires either 'username' OR 'email' in the request body.
//  */
// function requireBodyData(req, res, logic, firstLevelOr = false) {

//   const bodyData = req.body;
//   const urlParams = req.query;
  
//   // Combine body JSON and URL params
//   const body = { ...bodyData, ...urlParams };


//   function checkKeys(key,container) {
//     const bodyKeys = Object.keys(container)
//     if(bodyKeys.includes(key)) return true
//     return false
//   }

//   function evaluateObject(objLogic,container){
//     const { type, values, check:checkFn } = objLogic;
//     if(type === "array"){
//       const {subtype} = objLogic
//       if(!Array.isArray(container)) return false
//       if (checkFn && !checkFn(container)) return false

//       if(subtype){
//         if(typeof subtype === "string"){
//           if(subtype === "array"){
//             return container.every(subObj => Array.isArray(subObj))
//           }
//           return container.every(subObj => typeof subObj === subtype)
//         }

//         return container.every(subObj => evaluateObject(subtype,subObj))
//       }


//     }else if(type === "object"){
//       if(typeof container !== "object" || Array.isArray(container))return false
//       if (checkFn && !checkFn(container)) return false
//       return evaluateLogic(values,container,0)

//     }else{
//       if(typeof container !== type) return false
//       if (checkFn && !checkFn(container)) return false
      
//     }

//     return true;
//   }



//   function evaluateLogic(logicArray,container,level = 0) {

//     //bolean operators
//     if(typeof logicArray === "boolean"){
//       return logicArray
//     }else if (typeof logicArray === 'string'){//case base
//       // Handle single key
//       // Check if the single key is present in the requestData
//       if(logicArray.includes(":")){
//         const[key,type] = logicArray.split(":")
//         return evaluateLogic({key,type},container,level)
//       }
//       return checkKeys(logicArray,container);

//     }else if (Array.isArray(logicArray)){
//       // Check if logicArray is an array

//       const isAndLogic = firstLevelOr? level % 2 !== 0:level % 2 === 0; //level pair makes AND
//       if(isAndLogic){
//         return logicArray.every(element=>evaluateLogic(element,container,level+1))
//       }else {
//         return logicArray.some(element=>evaluateLogic(element,container,level+1))
//       }

//     }else if (typeof logicArray === 'object'){
//       if(container[logicArray.key] === undefined) return false
//       return evaluateObject(logicArray,container[logicArray.key])
//     }
//     // Invalid logic structure
//     // Return false for any other unsupported logic structure
//     return false;
//   }



//   if (!evaluateLogic(logic,body)) {
//     const logicString = logicStringFromLogicArray(logic)
//     sendResBAD(res, ERROR.MISSING_DATA, logicString);
//     throw { alreadySentResponse: true };
//   }

//   //return all data available, but we know the logic is correct
//   const requiredData = {}
//   const keys = logic.flat(Infinity)
//   for (const k of keys) {
//     if(!requiredData.hasOwnProperty(k) && body.hasOwnProperty(k)){
//       requiredData[k]= body[k]
//     }
//   }
  
//   return requiredData
// }
