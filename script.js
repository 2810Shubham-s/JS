function fib(n){
    let a=0, b=1, next;
    console.log(a);
    console.log(b);

    for(let i = 2; i<=n; i++){  
        next = b+a
        console.log(next)
        a=b;
        b= next
    } 
}

function fibR(n){
   if(n<=1) return n;
   return fib(n-1) + fib(n-2);
}
function fibS(n){
 for(let i=0; i<=n; i++){
     console.log(fib(i))
 }
}

fibS(10)