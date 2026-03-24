function frequency(arr){
   let obj = {}
   for(let item of arr){
     if(obj[item]){
        obj[item]++
     }else if(!obj[item]){
        obj[item] = 1;
     }
   }
   return obj
}

console.log(frequency([1,3,1,3,3,5,6,8,4,5]))