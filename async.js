console.log("Start")


let wada = new Promise((resolve , reject)=>{
    let workDone = true
   // workDone = false;
    setTimeout(()=>{
        if(workDone) resolve('kaam ho gya')
            reject(new Error("bhai yaar Sorry tera kaam nhi hua"))
    }, 2000)
})

console.log("abhi kaam pending hai")

wada.then((res)=>{
    console.log(res)
}).catch((err)=>{
    console.error(err)
})

console.log("Stop")