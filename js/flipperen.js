
var reneo = window.reneo || {};
reneo.Flipperen = reneo.Flipperen || {};

reneo.Flipperen.Main = (function () {
    "use strict";
    
    function Main(theContainer) {
		var container,
			startTs,
			balls = [],
			engine,
			flipperLinks,
			render;

			
        function init() {
			container = $(theContainer);
			document.addEventListener("keydown", function(ev) {
				if (ev.code === 'ArrowLeft') { moveLeftFlipper(); }
				if (ev.code === 'ArrowRight') { moveRightFlipper(); }
			});
        }

		
		function matterEngine() {
			return engine;
		}


		function update() {
			Matter.Engine.update(engine, 1000 / 60);
			
			for (const [i, ball] of balls.entries()) {
				if (ball.isDeleted) { insertNewDynamicBall(i); }
				if (ball.ballBody.isSleeping && !ball.ballBody.isStatic) {	ball.remove(); }
				
				ball.updateDomPosition();
			}
		}
		
		function moveLeftFlipper() {
			Matter.Body.applyForce( flipperLinks, {x: flipperLinks.position.x, y: flipperLinks.position.y}, {x: 0, y: -2.7});
		}
		
		function moveRightFlipper() {
			Matter.Body.applyForce( flipperLinks, {x: flipperLinks.position.x, y: flipperLinks.position.y}, {x: 0, y: -1.7});
		}
		
		
		function go() {
			engine = Matter.Engine.create();
			engine.enableSleeping = true;
			
			var render = Matter.Render.create({
				element: document.body,
				engine: engine
			});
			
			const screenWidth = 800;
			const screenHeight = 600;
			const boundsThickness = 200;
			const halfBoundsThickness = boundsThickness / 2;
			const halfScreenWidth = screenWidth / 2;
			const halfScreenHeight = screenHeight / 2;
			
			var ground = Matter.Bodies.rectangle(halfScreenWidth, screenHeight + halfBoundsThickness, screenWidth, boundsThickness, { isStatic: true });
			var wallLeft = Matter.Bodies.rectangle(-halfBoundsThickness, halfScreenHeight, boundsThickness, screenHeight, { isStatic: true });
			var wallRight = Matter.Bodies.rectangle(screenWidth+halfBoundsThickness, halfScreenHeight, boundsThickness, screenHeight, { isStatic: true });
			var ceiling = Matter.Bodies.rectangle(halfScreenWidth, -halfBoundsThickness, screenWidth, boundsThickness, { isStatic: true });

			const flipperThickness = Ball.radius * 2;
			const flipperLinksPosY = screenHeight - 65;  // 535
			const flipperLinksPosX = halfScreenWidth - 170;

			flipperLinks = Matter.Bodies.rectangle(flipperLinksPosX, flipperLinksPosY - 40, flipperThickness, 165, { angle: 2.00, density: 0.005 } );  //Matter.Bodies.trapezoid(330, 360, 32, 165, 0.33, {  angle: 2.00, density: 0.005 } );
			let leftHinge = Matter.Bodies.circle(flipperLinksPosX - 90, flipperLinksPosY - 59, 5, {	isStatic: true });
			let leftStopHinge = Matter.Bodies.circle(flipperLinksPosX + 50, flipperLinksPosY + 10, 10, { isStatic: true });
			var wandLinks = Matter.Bodies.rectangle(flipperLinksPosX - 120, flipperLinksPosY - 150, 165, 16, { isStatic: true, angle: (Math.PI / 4) });
			//var wandLinks2 = Matter.Bodies.rectangle(0, (flipperLinksPosY - 210) /2, 16, flipperLinksPosY - 210, { isStatic: true });
			
			let leftBinding = Matter.Constraint.create({
				bodyA: flipperLinks,
				pointA: { x: -90.0, y: -39.0 },
				bodyB: leftHinge,
				length: 0,
				stiffness: 0.4
			});	

			Matter.Composite.add(engine.world, [ ground, wallLeft, ceiling, wallRight, flipperLinks, leftHinge, leftBinding, leftStopHinge, wandLinks ]);
			
			// dynamische ballen
			for (let i = 0; i < 1; i++) {
				insertNewDynamicBall(i);
			}
			
			// statische ballen
			for (let i = 0; i < 4; i++) {
				let ballImage = createBallImage();
				container.append(ballImage);
				
				let ballBody = Matter.Bodies.circle(400 + (i * 30), 200 + (i * 40), Ball.radius, { isStatic: true, restitution: 1.0, friction: 0.0005 });
				
				Matter.Composite.add(engine.world, [ ballBody ]);
				
				let newBall = new Ball(reneo.Flipperen.singletonMain, ballImage, ballBody);
				balls.push(newBall);
			}	

			collisionEndHandler();
			
			Matter.Render.run(render);
			
			window.requestAnimationFrame(step);
		}

		
		function collisionEndHandler() {
			Matter.Events.on(engine, 'collisionEnd', function(event) {
				var pairs = event.pairs;

				for (var i = 0; i < pairs.length; i++) {
					var pair = pairs[i];
					for (let ball of balls) {
						if (pair.bodyA === ball.ballBody || pair.bodyB === ball.ballBody) {
							Matter.Body.setStatic(ball.ballBody, false);
						}
					}
				}
			});
		}

		
		function step(timestamp) {
			if (startTs === undefined) {
				startTs = timestamp;
			}
			const elapsed = timestamp - startTs;
			update();
			window.requestAnimationFrame(step);
		}


		function insertNewDynamicBall(i) {
			let ballImage = createBallImage();
			container.append(ballImage);
			
			let ballBody = Matter.Bodies.circle(200 + (i * 34), 34, Ball.radius, { isStatic: false, restitution: 1.0, friction: 0.0005 });
			
			Matter.Composite.add(engine.world, [ ballBody ]);
			
			let newBall = new Ball(reneo.Flipperen.singletonMain, ballImage, ballBody);
			if (i <= balls.length) {
				balls[i] = newBall;
			} else {
				balls.push(newBall);
			}
		}
		
		
		function createBallImage() {
			let newBall = $('<img class="flipperbal" src="/assets/voetbal32x32.png" alt="ball" width="32" height="32" style="display: none">');
			return newBall;
		}
		
		
		function createFlipperInDOM() {
			flipper = $('<svg height="60" width="160"><polygon points="0,30 160,60 160,0" style="fill:blue;stroke:purple;stroke-width:1" /></svg>');
			container.append(flipper);
		}


		this.go = go;
		this.matterEngine = matterEngine;
                
        init();
    };
	
	return Main;
})();
