function filter(arr, fn){
  if(typeof fn !== "function") throw new Error("fn must be a function")
  let result = []
  for(let i = 0; i<arr.length; i++){
  if(fn(arr[i],i) == true) { result.push(arr[i]) }
}
return result
}
console.log(filter([9,8,7,10,12,11], function(n, i){
    return n+1
}))