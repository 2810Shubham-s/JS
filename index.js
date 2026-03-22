let button = document.createElement("button");
button.textContent = "button";
button.style =
  "color: black ; background-color: green;top: 20px ; left: 40px; padding: 2px; margin: 5px; width : 200px";

document.body.appendChild(button);
let count = 0;

function toster(config) {
   count++ 
   let top = config.y;
   if(count===8){
    count = 0;
  }
  top = count*100
  
  console.log(count)
  console.log(`clicked ${count}`);
  let tosterDiv = document.createElement("div");
  let tosterText = document.createElement("h1");
  let body = document.body
  body.className = config.theme === "dark" ? "bg-zinc-900" : "bg-white";
  tosterDiv.appendChild(tosterText);
  tosterText.textContent = config.notification;
  tosterDiv.style = `position:${config.position}; ${config.loc_Y}:${top + "px"}; ${config.loc_X}: ${config.x}; background:#333; color:#fff; padding:16px 24px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.2); z-index:1000;`;
  document.body.appendChild(tosterDiv);
  top += 10;
  setTimeout(() => {
    document.body.removeChild(tosterDiv);
  }, config.duration * 1000);
}

button.addEventListener("click", () => {
  toster({
    theme: "dark",
    position: "fixed",
    loc_Y: "top",
    loc_X: "right",
    x: "10px",
    y: 10,
    notification: "Parameter acceseped",
    duration: 2,
  });
});
