
class Ball {
	ballImage;
	ballBody;
	parentObj;
	isDeleted;
	beingRemoved;
	
	static radius = 16;
	
	constructor(theParentObj, theBallImage, theBallBody) {
		this.isDeleted = false;
		this.beingRemoved = false;
		this.parentObj = theParentObj;
		this.ballImage = theBallImage;
		this.ballBody = theBallBody;
	}
	
	updateDomPosition() {
		if (this.beingRemoved) { return; }
		
		let newPos = this.ballBody.position;
		let newAngle = this.ballBody.angle;
		this.ballImage.css({ 'transform' : `translate(${newPos.x}px, ${newPos.y}px) rotate(${newAngle}rad)` });
		
		if (this.ballImage.is(':hidden')) {
			this.ballImage.show();
		};
	}
	
	remove() {
		if (this.beingRemoved) {
			return;
		}
		this.beingRemoved = true;
		Matter.Composite.remove(this.parentObj.matterEngine().world, this.ballBody);
		this.ballImage.fadeOut('linear', () => { this.isDeleted = true; theBallImage.remove(); });
	}
}
