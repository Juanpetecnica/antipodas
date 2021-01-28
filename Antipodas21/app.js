
window.onload = iniciar;

function iniciar(){
	cargarGif();
	
	ScrollOut({  
		targets: ".img-example",
		threshold:0.5,
		once: false
	});
} 

//Url de donde he sacado el gif: 
https://giphy.com/gifs/animation-art-26DN594O8pz0v9S12
function cargarGif(){
    document.getElementById("imagen_mundo").src = "img/mundillo2.gif";
}


