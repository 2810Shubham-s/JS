
//Reverse a string without using .reverse() --> done
function rev(str){
    let lowercase = str.toLowerCase();
    let revString= []
    for(let i = lowercase.length -1; i>=0; i--){
      revString.push(lowercase[i])
    }
    return revString.join("");
}
//console.log(rev("Vinod"));

//Find largest number in an array --> Done
let findLargest = function(arr){
    let largest = -Infinity
   for(let i =0; i< arr.length; i++){
       if(arr[i]>=largest){
        largest = arr[i]
       }
   }

   return largest
}

//console.log(findLargest([1,2,5,6,3,4,8,9,5,10,2,13]))

//Count vowels and consonants in a string -->Done

function vowel(str){
    str = str.toLowerCase()
    let countVowel= 0;
    let countConsonents= 0;
    for(let char of str){
        if("aeiou".includes(char)){
             countVowel++
        }else if(char>='a' && char<="z" ){
            countConsonents++
        }
    }
   return {countVowel, countConsonents};

}

//console.log(vowel("Hello@World!"))

//Remove duplicates from an array
function removeDuplicate(arr){
    let newArr =[];

    for(let item of arr){
        if(!newArr.includes(item)){
            newArr.push(item)
        }
    }
    return newArr
}

//console.log(removeDuplicate([1,2,1,3,5,4,5,4,8,7,4]))

//Remove duplicates from an array using Set
function removeDuplicate2(arr){
    return [...new Set(arr)]
}

console.log(removeDuplicate2([1,2,1,3,5,4,5,4,8,7,4]))