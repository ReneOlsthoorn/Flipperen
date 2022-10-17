
class StaticBall {
	ballImage;
	ballCollisionShape;
	
	static radius = 16;
	static mass = 3;
	
	constructor(theBallImage, theBallCollisionShape) {
		this.ballImage = theBallImage;
		this.ballCollisionShape = theBallCollisionShape;
	}
	
	updateDomPosition() {
		let newPos = this.ballCollisionShape.c;
		this.ballImage.css({ 'transform' : `translate(${newPos.x}px, ${640-newPos.y}px)` });
	}
}
