
class Ball {
	ballImage;
	ballBody;
	
	static radius = 16;
	
	constructor(theBallImage, theBallBody) {
		this.ballImage = theBallImage;
		this.ballBody = theBallBody;		
	}
	
	updateDomPosition() {
		let newPos = this.ballBody.position;
		let newAngle = this.ballBody.angle;
		this.ballImage.css({ 'transform' : `translate(${newPos.x}px, ${newPos.y}px) rotate(${newAngle}rad)` });
	}
}
