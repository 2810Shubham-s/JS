function filter(arr, fn){
  if(typeof fn !== "function") throw new Error("fn must be a function")
  let result = []
  for(let i = 0; i<arr.length; i++){
  if(fn(arr[i],i)) { result.push(arr[i]) }
}
return result
}
console.log(filter([-2,-1,0,1,2], function(n, i){
    return n+1
}))