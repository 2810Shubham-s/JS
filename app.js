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

let count = 1;
async function fetchApi(){
    const API = "https://jsonplaceholder.typicode.com/todos1/1";
    let response = await fetch(API)
    try {
      
      if(response.ok){
        let data = await response.json();
        console.log(data)
        return data;
      }else if(!response.ok && count<3){
          
          console.log(count)
          setTimeout(fetchApi, 1000);
          
      }else{
           console.log("tried 3 times but failed fetching api")
      }
    }catch{
       throw new Error("Error fetching Data")
    }
}

console.log(fetchApi())