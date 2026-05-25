class Pen{
    constructor(name, color, texture,text){
        this.name = name;
        this.color = color;
        this.texture = texture;
        this.write = function(text){
           let h1 = document.createElement("h1")
           h1.textContent = text
           h1.style.color = color
           h1.style.fontWeight = this.texture
           console.log(texture)
           document.body.append(h1)
        }
    }
}

let Natraj = new Pen("Bolder", "red", "200",)
let Natraj2 = new Pen("Bolder", "red", "900")
console.log(Natraj)
Natraj.write("Hello")
Natraj2.write("Hello World")