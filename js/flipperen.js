
var reneo = window.reneo || {};
reneo.Flipperen = reneo.Flipperen || {};

reneo.Flipperen.Main = (function () {
    "use strict";
    
    function Main(theContainer) {
		var GRABABLE_MASK_BIT = 1<<31,
			NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT,
			v = cp.v,
			container,
			space,
			raf,
			startTs,
			balls = [],
			staticBall,
			staticBallImage,
			flipperBody,
			flipper;
			
        function init() {
			container = $(theContainer);
			raf = window.requestAnimationFrame
				|| window.webkitRequestAnimationFrame
				|| window.mozRequestAnimationFrame
				|| window.oRequestAnimationFrame
				|| window.msRequestAnimationFrame
				|| function(callback) {
					return window.setTimeout(callback, 1000 / 60);
				};			
        }
		
		function addFloor() {
			var floor = space.addShape(new cp.SegmentShape(space.staticBody, v(0, 0), v(640, 0), 0));
			floor.setElasticity(1);
			floor.setFriction(1);
			floor.setLayers(NOT_GRABABLE_MASK);

			var ceiling = space.addShape(new cp.SegmentShape(space.staticBody, v(0, 640), v(640, 640), 0));
			floor.setElasticity(1);
			floor.setFriction(1);
			floor.setLayers(NOT_GRABABLE_MASK);

			var wall = space.addShape(new cp.SegmentShape(space.staticBody, v(0, 0), v(0, 640), 0));
			wall.setElasticity(1);
			wall.setFriction(1);
			wall.setLayers(NOT_GRABABLE_MASK);

			var wall2 = space.addShape(new cp.SegmentShape(space.staticBody, v(640, 0), v(640, 640), 0));
			wall2.setElasticity(1);
			wall2.setFriction(1);
			wall2.setLayers(NOT_GRABABLE_MASK);
		}	

		function update(dt) {
			space.step(dt);
			for (let ball of balls) {
				ball.updateDomPosition();
			}
			
			let arbiters = space.arbiters;
			for (let arbiter of arbiters) {
				let nrContacts = arbiter.contacts.length;
				if (arbiter.a == staticBall.ballCollisionShape || arbiter.b == staticBall.ballCollisionShape) {
					space.removeShape(staticBall.ballCollisionShape);
					staticBallImage.fadeOut(200, 'linear', function() { staticBallImage.remove(); });
				}
			}
			//console.log(flipperBody.getPos());
			let leftFlipPos = flipperBody.getPos();
			let vel = flipperBody.rot;
			let angle = 2*Math.PI - cp.v.toangle(vel);
			
			flipper.css({ 'transform' : `translate(${leftFlipPos.x}px, ${640-leftFlipPos.y}px) rotate(${angle}rad)` });
			//flipperBody.setPos(v(100, 200));
		}
		
		function go() {
			space = new cp.Space();
			space.iterations = 60;
			space.gravity = v(0, -500);
			space.sleepTimeThreshold = 0.5;
			space.collisionSlop = 0.5;
			
			addFloor();
			
			staticBallImage = createBallImage();
			container.append(staticBallImage);
			
			let staticBallShape = space.addShape(new cp.CircleShape(space.staticBody, Ball.radius, v(64, 64)));
			staticBallShape.setElasticity(1);
			staticBallShape.setFriction(1);
			staticBallShape.setLayers(NOT_GRABABLE_MASK);
			
			staticBall = new StaticBall(staticBallImage, staticBallShape);
			staticBall.updateDomPosition();

			for (let i = 1; i < 10; i++ ) {
				let ballImage = createBallImage();
				container.append(ballImage);
				
				let ballBody = space.addBody(new cp.Body(Ball.mass, cp.momentForCircle(Ball.mass, 0, Ball.radius, v(0, 0))));
				
				let ballCollisionShape = space.addShape(new cp.CircleShape(ballBody, Ball.radius, v(0, 0)));
				ballCollisionShape.setElasticity(1);
				ballCollisionShape.setFriction(1);
				
				let newBall = new Ball(ballImage, ballBody, ballCollisionShape);
				balls.push(newBall);
				
				newBall.setPos(v(200 + i*30, 300+ (2 * (Ball.radius*1) + 5) * i));
			}
			
			// add flipper
			flipper = $('<svg height="60" width="160"><polygon points="0,0 160,60 160,0" style="fill:blue;stroke:purple;stroke-width:1" /></svg>');
			let leftFlipPos = v(110,195);
			flipper.css({ 'transform' : `translate(${leftFlipPos.x}px, ${640-leftFlipPos.y}px) rotate(0deg)` });
			
			let tris = [
                cp.v(0, 60),
                cp.v(160, 60),
                cp.v(160, 0)
            ];
			
			let polyMass = 1.0;
			flipperBody = space.addBody(new cp.Body(polyMass, cp.momentForPoly(1.0, tris, v(0,0))));
			let flipperShape = space.addShape(new cp.PolyShape(flipperBody, tris, v(0,0))); //space.staticBody     v(95, 150)
			flipperShape.setElasticity(1);
			flipperShape.setFriction(1);
			flipperBody.setPos(v(100, 200));

			container.append(flipper);	
							
			window.requestAnimationFrame(step);
		}
		
		function step(timestamp) {
			if (startTs === undefined) {
				startTs = timestamp;
			}
			const elapsed = timestamp - startTs;
			update(1/60);
			window.requestAnimationFrame(step);
		}
		
		function createBallImage() {
			let newBall = $('<img class="flipperbal" src="/assets/voetbal32x32.png" alt="ball" width="32" height="32">');
			return newBall;
		}

		this.go = go;
                
        init();
    };
	
	return Main;
})();
