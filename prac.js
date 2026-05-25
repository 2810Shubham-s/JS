//ispelindrom

function Pelindrom(str) {
     str = str.toLowerCase()
     str1 = str.split("").reverse().join("")
     return (str === str1) ? "pelindrome" : "notpelindrom"
}

//console.log(Pelindrom("Plp"))

//reverse string without using reverse method

function reverse(str) {
    let str1 = [];
    for(let i=str.length-1; i>=0; i--){
       str1.push(str[i])
    }
    return str1.join("")
}

//console.log(reverse("Apple"))

//largesnum in an array

function largest(arr){
     let largestNum = -Infinity
     for(let i = 0; i<arr.length; i++){
        if(arr[i]> largestNum){
            largestNum = arr[i]
        }
     }
     return largestNum
}

let fn = largest([11,2,3,4,9,7,8,6,5,4,8,7,10])
//console.log(fn)

//vowel and consonent
function voco(str){
    str = str.toLowerCase()
    let vowels = 'aeiou';
    let vowelCount = 0;
    let consonentCount = 0
    for(let i =0; i<str.length ; i++){
        if(vowels.includes(str[i]) ){
            vowelCount++
        }
        else if(str[i]> 'a' && str[i] < 'z'){
          consonentCount ++
        }
    }
    return {vowelCount, consonentCount}
}

//console.log(voco('abcdeaeiou'))

//remove dublicates from Array

function removeDub (arr) {
    let newArr = []
    for(let i=0; i<arr.length; i++){
        if(!newArr.includes(arr[i])){
          newArr.push(arr[i])
        }
    }
    return newArr
}

//console.log(removeDub([1,2,1,3,3,6,5,4,1,2,3]))

//method2 with Set
function Original(arr){
    return [...new Set(arr)]
}

//console.log(removeDub([1,2,1,3,3,3,3,4,4,43,6,5,4,1,2,3]))

//factorial

function factorial(num){
    let fact = 1;
    for(let i = 1; i<=num; i++){
        fact = fact*i
    }
    return fact
}

//console.log(factorial(5))

//recursion factorial

function fact(num){
    if(num===0 || num ===1 ) return 1
    return num*fact(num-1)
}

console.log(fact(4))

//anagram

function anagram(str, str1){
    str = str.toLowerCase().split("").sort().join("")
    console.log(str)
    str1 = str1.toLowerCase().split("").sort().join("")
    console.log(str1)
    return (str === str1) ? "anangram" : "notanagram"
}

//console.log(anagram("abcd", "dcba"))

//three time fetch logic

let count = 0;
async function fetcher() {
  let response = await fetch("https://jsonplaceholder.typicode.com/todose/2")
  try{
    if(count>=3){
        console.log("tried 3 time failed fetching API")
    }
    else if(!response.ok && count<3){
        count++
        console.log(`trying ${count} time`)
      setTimeout(fetcher, 1000)
    }else{
        let data =  await response.json()
        console.log(data)
    }
  }catch{
    throw new Error("error fetching Api")
  }
}

fetcher()
