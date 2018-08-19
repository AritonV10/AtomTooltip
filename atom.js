document.addEventListener("mouseover", function(event) {
  if (event.target.getAttribute("aria-describedby") != null) {
    event.preventDefault();
    var tool_tip = atom_tool_init(
      event.target.className.split(' '),
      event.target.dataset.atom,
      event.target.getAttribute("atom-action"));

    var elem = event.target,
      pos_ = elem.getBoundingClientRect(),
      atom_action = elem.getAttribute("atom-action") || "down";
      
    var top_ = event.target.getAttribute("atom-top") || 10,
    		bottom_ = event.target.getAttribute("atom-bottom") || -15;

    tool_tip.style.top = 
    (atom_action == "up" ? (pos_.top - elem.offsetHeight) : (pos_.top + elem.offsetHeight)) + "px";
    
    tool_tip.style.right = pos_.right + "px";
    tool_tip.style.left = pos_.left + (elem.offsetWidth / 2) - (tool_tip.offsetWidth / 2) + "px";

    tool_tip.style.bottom = pos_.bottom + "px";

    tool_tip.style.visibility = "visibile";
    tool_tip.style.opacity = "1";

    tool_tip.style.transform = "translateY(" + (atom_action == "down" ? top_ : bottom_) + "px)";
    elem.addEventListener("mouseleave", function() {
     	tool_tip.style.opacity = "0";
     	atom_tool_dest();
    })
  }
});

function atom_tool_init(target, message, atom_action) {
  var body_ = document.querySelector("body");
  var div_elem = document.createElement("div");
  var action = atom_action || "down";
  console.log(action);
  div_elem.id = "atom-tooltip";
  div_elem.setAttribute("role", "tooltip");
  div_elem.setAttribute("atom-target", (function() {
    var concat_ = "";
    target.forEach((elem, index) => {
      concat_ += elem + (index + 1 == target.length ? "" : " ");
    })
    return concat_;
  })());

  var svg_par = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    svg_child = document.createElementNS("http://www.w3.org/2000/svg", "polygon"),
    text_child = document.createElement("div");
  text_child.className = "atom-tooltip-2";
  text_child.append(message);
  div_elem.appendChild(text_child); // append the first child so we can get Its width

  svg_child.setAttribute("points", (action == "down" ? "30,4,4,60,60,60" : "30,80,4,30,60,30"));
  svg_par.setAttribute("height", "10");
  svg_par.appendChild(svg_child);


  div_elem.insertBefore(svg_par, text_child);
  body_.appendChild(div_elem);
  svg_par.setAttribute("style", "position: absolute; text-align: center; left: 0; right: 0; margin-right: auto; margin-left: auto; " + (action === "down" ? "top: -9px;" : "bottom: -9px;"));

  svg_par.setAttribute("width", div_elem.offsetWidth);
  if(action != "down") {
  		svg_par.setAttribute("transform", "rotate(360deg);");
  }
  svg_child.setAttribute("style", "transform: translateX(" + (div_elem.offsetWidth - 57.5) / 2 + "px) " + (action != "down" ? "translateY(-74px);" : " ") + "; fill:" + window.getComputedStyle(div_elem).getPropertyValue("background-color"));
  return div_elem;
}

function atom_tool_dest() {
  if (typeof document.querySelector("#atom-tooltip") != 'undefined' && document.querySelector("#atom-tooltip") != null) {
    document.querySelector("body").removeChild(document.querySelector("#atom-tooltip"));
  }
}
