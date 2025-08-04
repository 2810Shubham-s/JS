//this keyword ek aisa keywword hai jiski value run time par decide hoti hai. 
//this keyword ka use object ke andar function ko call karne ke liye hota hai.
//this keyword ka use function ke andar bhi hota hai.

//Value of this in Global Scope

console.log(this) //this keyword in global scope refer to the global object (window in browser, global in Node.js)

//Value of this in Function Scope

 function valueOfThis () {
     console.log(this);
 } 
valueOfThis(); //this kwyword in functional scope refers to the global object (window in browser, global in Node.js)

//Value of this in Method

const user = {
     fullname : "shubham",
     age: 21,

     function () {
          let obj = {
               fullname: "jay",
               age: 20,

               
          }
          function nesting () {
               console.log(this)
          }
          
          console.log(this)
     }

}

user.function()
//this keyword in method refers to the object itself

//lexical scoipng

function a(){
   let Ram = "Shubh";
    let b = Ram;

    function c () {
        console.log(b);
    }
    c();
}
a();

//Dynamic Scoping

let Ram = "king of Ayodhya";

function b (){
    console.log(Ram);
}


function jay() {
     let Ram = "Narayan";
     b();
}

jay()

//clouser => clouser concept me ek parent fuction ke andar ek aur function retutrn hota hai 
  // aur returning function paraint function ki koi variable use(istemal) karta hai.

  function parent() {
    let a = "Shubh";
     return function child (){
          console.log(a)
     }
     child();
  }
  let fnc = parent();
    fnc(); // "Shubh"














//clouser

function clicktLImiter () {
     let click = 0;

     return function () {
          if (click < 5){
            click++;
            console.log(click);
          } else {
            console.log("Maximum click reached please try again letter")
          }
     }
} 

let fn = clicktLImiter();
fn(); 
fn(); 
fn(); 
fn(); 
fn(); 
fn(); 
fn(); 

console.log(click)



