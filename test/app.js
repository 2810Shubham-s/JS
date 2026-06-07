let input = document.createElement("input")
let input2 = document.createElement("input")
let submit = document.createElement("input")

let h1 = document.createElement("h1")
input.setAttribute("type", "number")
input2.setAttribute("type", "number")
submit.setAttribute("type", "submit")

document.body.appendChild(input)
document.body.appendChild(input2)
document.body.appendChild(submit)
document.body.appendChild(h1)



submit.addEventListener("click", ()=> {
       console.log("click hua")
       let a = Number(input.value);
    
       let b = Number(input2.value);

       if(a>b){
        console.log(a)
        h1.innerText = `Greater number is: ${a}`
        
       }else{
        console.log(b)
        h1.innerText = `Greater number is: ${b}`
       }
    
    }
)
