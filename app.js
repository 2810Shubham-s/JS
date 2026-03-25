// function frequency(arr){
//    let obj = {}
//    for(let item of arr){
//      if(obj[item]){
//         obj[item]++
//      }else if(!obj[item]){
//         obj[item] = 1;
//      }
//    }
//    return obj
// }

// console.log(frequency([1,3,1,3,3,5,6,8,4,5]))

//three time retry logic

// let count = 1;
// async function fetchApi(){
//     const API = "https://jsonplaceholder.typicode.com/todos1/1";
//     let response = await fetch(API)
//     try {
      
//       if(response.ok){
//         let data = await response.json();
//         console.log(data)
//         return data;
//       }else if(!response.ok && count<3){
          
//           console.log(count)
//           setTimeout(fetchApi, 1000);
          
//       }else{
//            console.log("tried 3 times but failed fetching api")
//       }
//     }catch{
//        throw new Error("Error fetching Data")
//     }
// }

// console.log(fetchApi())

// let compose = function(functions){
//     return function(x){
//             let comp=x;
//            for(let i= functions.length -1; i>=0; i--){
//             comp = functions[i](comp)
//           //  console.log(comp)
//            }
//            return comp
//         }
// }

// let fn = compose([x => 10 + x, x => 2*x, x=> x+x, x => x+1])
// console.log(fn(2))


// var once = function(fn) {
//         let called = false;
    
//     return function(...args){
        
//             if(called) return undefined
//             called = true
//             return fn(...args)
        
//     }
// };

// let fn = once((a) => a["x"])
// console.log(fn([{"x": 7}],[{"x": 10}],[{"x": 15}]))

//Cache Fucntion


function memoize(fn) {
    
    return function(...args) {
     
       let  memorisedSum = {};
       let  memorisedfib = {};
       let  memorisedFactorial = {};
       if(fn==="sum"){
          for(let i = 0; i<agrs.length; i++)
           if(memorisedSum.args[i]){
            return memorisedSum.args[i]
           }else{
            return sum(args[i])
           }
     
        }
       if(fn==="factorial"){
          for(let i = 0; i<agrs.length; i++)
           if(memorisedFactorial.args[i]){
            return memorisedFactorial.args[i]
           }else{
            return factorial(args[i])
           }
     
        }
       if(fn==="fib"){
          for(let i = 0; i<agrs.length; i++)
           if(memorisedfib.args[i]){
            return memorisedfib.args[i]
           }else{
            return fib(args[i])
           }
     
        }
       let sum = function(a,b){
            let sum = a+b;
            let input = [a,b]
            memorisedSum.input = sum;
           return sum;
        }
       
        let fib = (n) => {
            let input = n;
            let fib = 0;
            memorisedfib
            if(n<=1){
               fib = 1;
               return 1;
            }
            else { fib =  fib(n-1) + fib(n-2) }
            memorisedfib.input = fib;
        };
        let factorial = (n)=>{
            let input = n;
            let fact = 0;
            if(n<=1){
              fact = 1;
              return 1;

            }else {
            fact = factorial(n-1)*n;
            return factorial(n-1)*n;
            }
        }
        memorisedFactorial.input = fact;

       
    }





























