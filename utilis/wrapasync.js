module.exports =(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}

// function wrapasync(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }