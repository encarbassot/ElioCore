
const ERROR={
    MISSING_DATA:{
      msg:"expected field not present",
      code:400,
      error:"MISSING_DATA"
    },
    METHOD_NOT_ALLOWED:{
      msg:"Method not allowed",
      code:404,
      error:"METHOD_NOT_ALLOWED"
    },
    ALREADY_DONE:{
      msg:"Esta acción ya se ha realizado",
      code:400,
      error:"ALREADY_DONE"
    },
    DATA_CORRUPT:{
      msg:"Data is corrupt",
      code:400,
      error:"DATA_CORRUPT"
    },
    VALIDATION_ERROR:{
      // Only for "validateRequest.js" middleware
      msg: "Invalid input data",
      code: 422,
      error: "VALIDATION_ERROR",
    },
    UNAUTHORIZED:{
      msg:"you aren't authorized on this page",
      code:401,
      error:"UNAUTHORIZED"
    },
    PERMISSIONS:{
      msg:"Permission range too low",
      code:401,
      error:"PERMISSIONS"
    },
    BAD_LOGIN:{
      msg:"login not successful",
      code:400,
      error:"BAD_LOGIN"
    },
    CREDENTIALS:{
      msg:"failed to authentificate",
      code: 400,
      error:"CREDENTIALS"
    },
    PASSWORD_FORMAT:{
      msg:"password doesnt match the requirments",
      code:400,
      error:"PASSWORD_FORMAT"
    },
    DUPLICATE:{
      msg:"Duplicate data",
      code:400,
      error:"DUPLICATE"
    },
    GENERAL:{
      msg:"An error occurred",
      code:400,
      error:"GENERAL"
    },
    UNEXISTENT:{
      msg:"Data you are trying to get doesnt exist",
      code:400,
      error:"UNEXISTENT"
    },
    NO_FILE:{
      msg:"No file provided",
      code:400,
      error:"NO_FILE"
    },
    NO_FILE:{
      msg:"No file provided",
      code:400,
      error:"NO_FILE"
    },
    FILE_PROCESSING:{
      msg:"Error processing file data",
      code:500,
      error:"FILE_PROCESSING"
    },
    RATE_LIMIT: {
      msg: 'Rate limit exceeded. Please try again later.',
      code: 429, // 429 Too Many Requests
      error: 'RATE_LIMIT',
    },
    NOT_FOUND:{
      msg:'The requested resource could not be found.',
      code:404,
      error:'NOT_FOUND'
    },
    INFORMATION_DEPENDENT:{
      msg:'The operation is restricted because this record is referenced by other records.',
      code:400,
      error:'INFORMATION_DEPENDENT'
    },
    TYPE_MISMATCH:{
      msg:'Type mismatch',
      code:400,
      error:"TYPE_MISMATCH"
    },
    CONFLICT: {
      msg: "The requested action cannot be completed due to a conflict with existing data.",
      code: 409, // HTTP 409 Conflict
      error: "CONFLICT"
    }
  }


export default ERROR