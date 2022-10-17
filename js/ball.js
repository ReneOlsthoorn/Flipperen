
class Ball {
	ballImage;
	ballBody;
	ballCollisionShape;
	
	static radius = 16;
	static mass = 3;
	
	constructor(theBallImage, theBallBody, theBallCollisionShape) {
		this.ballImage = theBallImage;
		this.ballBody = theBallBody;		
		this.ballCollisionShape = theBallCollisionShape;
	}
	
	updateDomPosition() {
		let newPos = this.ballBody.getPos();
		this.ballImage.css({ 'transform' : `translate(${newPos.x}px, ${640-newPos.y}px) rotate(${this.getAngle()}rad)` });
	}
	
	setPos(pos) {
		this.ballBody.setPos(pos);
	}
	
	getAngle() {
		let vel = this.ballBody.rot;
		return 2*Math.PI - cp.v.toangle(vel);
	}
	
	radiansToDegrees(radians) {
		return radians * (180 / Math.PI);
	}	
}
