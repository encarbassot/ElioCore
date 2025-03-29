import {c,title} from "../utils/beautyConsole.js"

export default function requestManager(){

  return (req,res,next)=>{

    res.sendBad = (...props)=>sendResBAD(res,...props) // sendResBAD(res,err,more=undefined,field=null)
    res.sendOk = (...props)=>sendResOK(res,...props) // sendResOK(res,data)
    res.catch = (err,...props)=>catchRes(req,res,err,...props) // catchRes(req,res,err,path)
    req.requireBodyData = (keys) => {
      const arg = arguments
      if(arg.length <= 1){
        return requireBodyData(req,res,keys)
      }else{
        return requireBodyData(req,res,arg)
      }
    }




    next()
  }
}


function sendResOK(res,data){
  if (data === false) {
    // If data is false, we send a bad response
    return sendResBAD(res, ERROR.DATA_CORRUPT)
  }

  // if(data instanceof User){
  //   // data = data.publicData()
  // }
  // if(res.cookieAccessToken){
  //   console.log("COOKIE")
  //   return res.cookie("access_token",res.cookieAccessToken,{
  //     httpOnly:true,//solo se puede acceder desde el servidor
  //     // secure:true,//solo en HTTPS
  //     // sameSite:"strict",
  //     maxAge: 1000 * 60 * 60 * 24 * 12 //12 dias
  //   }).json({success:true,data})
  // }
  return res.json({success:true,data})
}


export function sendResBAD(res,err,more=undefined,field=null){
  if (field) {
    // Ensure err.more.fields exists
    if (!err.more) err.more = {};
    if (!err.more.fields) err.more.fields = {};

    // Assign error message to the specific field
    err.more.fields[field] = more;
  } else if (more) {
    err.more = more;
  }
  
  return res.status(err?.code || 400).json({success:false,err})
}



function catchRes(req,res,err,path){
  if(err.alreadySentResponse){
    return
  }else if(err.name === "CustomError"){
    sendResBAD(res,err.err,err.more)
    return
  }else{
    sendResBAD(res,ERROR.GENERAL)
  }

  


  
  const endpointPath = req.originalUrl || req.url
  console.log(`ERROR FILE:${path.url} ENDPOINT:${endpointPath} ERROR:${err.message}`)


  const callingFileName = new URL(import.meta.url).pathname;
  console.log(`Called from: ${callingFileName}`);

  console.log(c("r",title("ERROR")))
  console.log(c("r","FILE:"),path.url)
  console.log(c("r","ENDPOINT:"),endpointPath)
  console.error(err)  
}