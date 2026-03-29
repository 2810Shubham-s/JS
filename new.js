
//Reverse a string without using .reverse() --> done
function rev(str){
    let lowercase = str.toLowerCase();
    let revString= []
    for(let i = lowercase.length -1; i>=0; i--){
      revString.push(lowercase[i])
    }
    return revString.join("");
}
console.log(rev("Vinod"))

//Find largest number in an array --> Done
