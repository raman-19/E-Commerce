const asyncHandler =(requestHandler)=>{
    return(req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)) //because async function return promises automatically
        .catch((err)=> next(err)) //using this it is easly handle any sync error
    }
}
export {asyncHandler}
