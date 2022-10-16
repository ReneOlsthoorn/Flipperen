
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
			balls = [];
			
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
		}
		
		function go() {
			space = new cp.Space();
			space.iterations = 60;
			space.gravity = v(0, -500);
			space.sleepTimeThreshold = 0.5;
			space.collisionSlop = 0.5;
			
			addFloor();

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
