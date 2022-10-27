
var reneo = window.reneo || {};
reneo.Flipperen = reneo.Flipperen || {};

reneo.Flipperen.Main = (function () {
    "use strict";
    
    function Main(theContainer) {
		var container,
			balls = [],
			startTs,
			raf,
			engine,
			render;
			
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
			engine = Matter.Engine.create();
			render = Matter.Render.create({
				element: document.body,
				engine: engine
			});
			
			// create two boxes and a ground
			var boxA = Matter.Bodies.circle(400, 200, 32, {
    isStatic:false,
    restitution: 0.95
  });
			var boxB = Matter.Bodies.rectangle(500, 50, 80, 80);
			var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });	

			// add all of the bodies to the world
			Matter.Composite.add(engine.world, [boxA, boxB, ground]);
        }
		
		function addFloor() {
		}	

		function update(dt) {
			Matter.Engine.update(engine, 1000 / 60);
			//space.step(dt);
			//for (let ball of balls) {
			//	ball.updateDomPosition();
			//}
		}
		
		function go() {
			// run the renderer
			Matter.Render.run(render);

			// create runner
			//var runner = Matter.Runner.create();

			// run the engine
			//Matter.Runner.run(runner, engine);
			
			window.requestAnimationFrame(step);

/*
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
			flipper = $('<svg height="60" width="160"><polygon points="0,30 160,60 160,0" style="fill:blue;stroke:purple;stroke-width:1" /></svg>');
			
			let tris = [
                cp.v(0, 30),
                cp.v(160, 60),
                cp.v(160, 0)
            ];
			
			let polyMass = 100;
			let momentPoly = cp.momentForPoly(polyMass, tris, v(0,0));
			momentPoly = 1385000;
			console.log("Moment poly: " + momentPoly);
			flipperBody = space.addBody(new cp.Body(polyMass, momentPoly));
			flipperBody.setPos(v(100, 100));
			
			let flipperShape = space.addShape(new cp.PolyShape(flipperBody, tris, v(0,0))); //space.staticBody     v(95, 150)
			//let flipperShape = space.addShape(new cp.PolyShape(space.staticBody, tris, v(95, 150))); //space.staticBody     v(95, 150)
			//flipperShape.setElasticity(0.4);
			//flipperShape.setFriction(1);
			//flipperBody.setPos(v(100, 200));
			
			flipperJointBody = space.addBody(new cp.Body(Infinity, Infinity));
			flipperJointBody.setPos(v(100, 100));
			flipperPinJoint = new cp.PinJoint(flipperJointBody, flipperBody, cp.v(160,30), cp.v(160,30));
			space.addConstraint(flipperPinJoint);
			space.addConstraint(new cp.DampedRotarySpring(flipperBody, flipperJointBody, 0.15, 20000000, 900000));

			container.append(flipper);	
							
			window.requestAnimationFrame(step);
			
			setTimeout(function() {
				flipperJointBody.applyImpulse(40000, v(0, 0));
			}, 3000);
			*/
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
			//let newBall = $('<img class="flipperbal" src="/assets/voetbal32x32.png" alt="ball" width="32" height="32">');
			//return newBall;
		}

		this.go = go;
                
        init();
    };
	
	return Main;
})();
