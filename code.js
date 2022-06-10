/*******************************************************  

	Einrichtung der Seite

*******************************************************/

alert("Auf dieser Seite können Sie durch Bewegen der Maus verschiedene optische Effekte erzeugen. Per Mausklick können Sie die Art der Darstellung ändern.");
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const particlesArray = [];
let count = 0;
let h = 0;


//Mode 0: Bubbles
//Mode 1: Circle Trails
//Mode 2: Network
let mode = 0;


//Alle Elemente im Canvas werden an die Fenstergröße angepasst
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


//Mauszeiger als Objekt festlegen, um ihn nutzen zu können.
const mouse = {
	x: undefined,
	y: undefined
}



/*******************************************************  

	Eventlistener und Functions

*******************************************************/

//EventListener ändert den Modus der Darstellung
canvas.addEventListener('click', function(){
	switch(mode) {
		case 0: mode = 1; break;
		case 1: {
			if(particlesArray.length > 50) {
				particlesArray.splice(0, particlesArray.length-50);
			}
			mode = 2;
			break;
		}
		case 2: mode = 0; break;
		default: mode = 0; break;
	}
})

//Dieser Eventlistener sorgt dafür, dass die Form sich beim Resize des Fensters nicht verändert.
//Damit die Form nicht gelöscht wird, muss sie zusätzlich innerhalb des Eventlisteners liegen.
window.addEventListener('resize', function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});


//Eventlistener reagiert auf Mausbewegung und malt einen Path aus Kreisen
canvas.addEventListener('mousemove', function(event) {
	mouse.x = event.x;
	mouse.y = event.y;
	if(mode != 2 || count % 2 == 0) particlesArray.push(new Particle);
})


//Function läuft in einem Loop - Neuer Kreis wird gemalt, sodass er immer dem Cursor zu folgen scheint
//Canvas wird alternativ mit einem schwarzen Rect mit geringer Opacity überladen, wodurch Trails entstehen
function animate() {
	switch(mode) {
		case 0: 
		case 2: ctx.fillStyle = 'RGBA(0, 0, 0, 1)'; break;
		case 1: ctx.fillStyle = 'RGBA(0, 0, 0, 0.15)'; break;
		default: break;
	}
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	handleParticles();
	requestAnimationFrame(animate);
}
animate();


//Function ruft die draw- und update-Functions von Particle auf, um sie über das Canvas zu bewegen
function handleParticles() {
	for(let i=0; i<particlesArray.length; i++) {	
		if(particlesArray[i].size <= 0.2) {
			particlesArray.splice(i, 1);
			i--;
		}
		else {
			particlesArray[i].update();
			switch(mode) {
				case 0: particlesArray[i].drawMode0(); break;
				case 1: particlesArray[i].drawMode1(); break;
				case 2: particlesArray[i].drawMode2(i); break;
				default: break;
			}
		}
	}
}



/*******************************************************  

	Classes

*******************************************************/

class Particle {
	constructor() {
		this.x = mouse.x;
		this.y = mouse.y;
		this.size = Math.random() * 8 + 1;
		this.speedX = Math.random() * 2 - 1;		//Geschwindigkeit zwischen -1 und +1
		this.speedY = Math.random() * 2 - 1;		//Geschwindigkeit zwischen -1 und +1
		this.color = 'HSL(' + h + ', 100%, 50%)';
	}
	update() {
		this.x += this.speedX;
		this.y += this.speedY;
		this.size -= 0.025;
		
		count++;
		if(count == 200) {
			count = 0;
			if(h == 360) h = 0;
			h++;
		}
			
	}
	drawMode0() {
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.stroke();
	}
	drawMode1() {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fill();
	}
	drawMode2(i) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fill();
		for(let j=(i+1); j<particlesArray.length; j++) {
			let distX = particlesArray[i].x - particlesArray[j].x;
			let distY = particlesArray[i].y - particlesArray[j].y;
			let distance = Math.sqrt(distX * distX + distY * distY);
			if(distance < 300 && distance > 200) {
				ctx.strokeStyle = 'white';
				ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
				ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
				ctx.stroke();
			}
		}
	}
}