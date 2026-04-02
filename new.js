//Reverse a string without using .reverse() --> done
function rev(str) {
  let lowercase = str.toLowerCase();
  let revString = [];
  for (let i = lowercase.length - 1; i >= 0; i--) {
    revString.push(lowercase[i]);
  }
  return revString.join("");
}
//console.log(rev("Vinod"));

//Find largest number in an array --> Done
let findLargest = function (arr) {
  let largest = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= largest) {
      largest = arr[i];
    }
  }

  return largest;
};

//console.log(findLargest([1,2,5,6,3,4,8,9,5,10,2,13]))

//Count vowels and consonants in a string -->Done

function vowel(str) {
  str = str.toLowerCase();
  let countVowel = 0;
  let countConsonents = 0;
  for (let char of str) {
    if ("aeiou".includes(char)) {
      countVowel++;
    } else if (char >= "a" && char <= "z") {
      countConsonents++;
    }
  }
  return { countVowel, countConsonents };
}

//console.log(vowel("Hello@World!"))

//Remove duplicates from an array
function removeDuplicate(arr) {
  let newArr = [];

  for (let item of arr) {
    if (!newArr.includes(item)) {
      newArr.push(item);
    }
  }
  return newArr;
}

//console.log(removeDuplicate([1,2,1,3,5,4,5,4,8,7,4]))

//Remove duplicates from an array using Set
function removeDuplicate2(arr) {
  return [...new Set(arr)];
}

//console.log(removeDuplicate2([1,2,1,3,5,4,5,4,8,7,4]))

//factorial it loop and with recursion

//with loop
function fact(n) {
  let fact = 1;
  for (let i = 1; i <= n; i++) {
    fact = fact * i;
  }
  return fact;
}

//with recursion

let factorial = function (n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};

//console.log(`factorial with loop`,fact(5))
//console.log(`factorial with recursion`,factorial(5))

//Check if two strings are anagrams

function anagram(str, str2) {
  return str.split("").sort().join("") === str2.split("").sort().join("")
    ? "angram"
    : "not anagram";
}

//console.log(anagram("abcd2", "dcab"))

//Find second largest number in array --> Done
let secondLargest = function (arr) {
  let large = -Infinity; //10
  let SecLarge = -Infinity; //7

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= large) {
      SecLarge = large;
      large = arr[i];
    } else if (arr[i] >= SecLarge && arr[i] != large) {
      SecLarge = arr[i];
    }
  }
  return { large, SecLarge };
};

//console.log(secondLargest([1,2,3,6,5,4,7,10,6,9,9]))

//Flatten nested array (e.g. [1,[2,[3]]] → [1,2,3])

function flatArray(arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      newArr = newArr.concat(flatArray(arr[i]));
    } else {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

//console.log(flatArray([1,[2],3,[3,[5,6]]]))

//Implement map() manually

function manualMap(fn, arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    let newItem = fn(arr[i]);
    newArr.push(newItem);
  }
  return newArr;
}

// //console.log(manualMap((x)=>{
//    return x*2
// }, [1,2,3,5,6,9,8]
// ));

//implement manual filter
function manualFilter(fn, arr) {
  let newarr = [];

  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i])) {
      newarr.push(arr[i]);
    }
  }
  return newarr;
}

// console.log(manualFilter((n)=>{
//   return n%2===0

// }, [1,2,3,4,5,6,7,8,9,10]))

//implement manual reduce

function reduce(fn, arr, init) {
  let final;
  let start;
  if (init !== undefined) {
    final = init;
    start = 0;
  } else {
    final = arr[0];
    start = 1;
  }

  for (let i = start; i < arr.length; i++) {
    final = fn(final, arr[i]);
  }
  return final;
}

// console.log(reduce(function(accum,curr){
//     return accum + curr
// }, [1,2,3,4,5,6,7,8,9], 0))

//frequency of arr
function frequency(arr) {
  let obj = {};

  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i]]) {
      obj[arr[i]] = 1;
    } else {
      obj[arr[i]]++;
    }
  }
  return obj;
}

//console.log( frequency([1,2,1,2,1,2,3,5,6,4,1,2,5,6,9,8,7]))
//frequency with for of
function frequency2(arr) {
  let obj = {};

  for (let item of arr) {
    if (!obj[item]) {
      obj[item] = 1;
    } else {
      obj[item]++;
    }
  }
  return obj;
}

//console.log( frequency2([2,2,1,2,1,2,3,5,6,4,1,2,5,6,9,8,7]))
//frequency with for of and if in
function frequency3(arr) {
  let obj = {};

  for (let item of arr) {
    if (item in obj) {
      obj[item]++;
    } else {
      obj[item] = 1;
    }
  }
  return obj;
}

console.log(frequency3([2, 2, 1, 2, 1, 2, 3, 5, 6, 4, 1, 2, 5, 6, 9, 8, 7]));

//cache fucntion

function memorize(fn) {
  let cache = {};
  return function (...args) {
    let key = JSON.stringify(args);

    if (cache[key]) {
      return cache[key];
    }
    let result = fn(...args);
    cache[key] = result;
    return result;
  }
}
