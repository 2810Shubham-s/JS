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
    let cache = {};

    return function(...args) {
        let key = JSON.stringify(args);

        if (cache[key]) {
            return cache[key];
        }

        let result = fn(...args);
        cache[key] = result;
        return result;
    };
}

//DEBOUCE fucntion()

let debounce = (fn, delay)=>{
   let timer;

   return function(...args){
    clearTimeout(timer);
    timer = setTimeout(()=>{fn(...args)},delay)
   }
}

let fn = debounce(search,1000)
function search(query) {
    console.log(`i am seaching`, query);
}



// throttle
let throttle =(fn,limit) =>{
    let lastCall = 0;

    return function(...args){
       let now = Date.now();
       if(now- lastCall >= limit){
        lastCall = now
        fn(...args)
       }
    }
}




function massage(msg){
    console.log(msg)
}


// let send = throttle(massage,2000)
// send("hi")
// send("hi")
// send("hi")
// send("hi")
// send("hello")
// send("hello")
// send("hello")

class Fruit {
    constructor (name,color){
        this.name = name;
        this.color = color;
    }
}

let apple = new Fruit("Apple", "Red")
let banana = new Fruit("banana", "yellow")

console.log(apple)
console.log(banana)




























