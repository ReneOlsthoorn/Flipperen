
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
			domFlipperLinks,
			domFlipperRechts,
			domWandRechts,
			domWandLinks,
			flipperRechts,
			wandLinks,
			wandRechts,
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
			
			let newPos = flipperLinks.position;
			let newAngle = flipperLinks.angle;
			domFlipperLinks.css({ 'transform' : `translate(${newPos.x}px, ${newPos.y}px) rotate(${newAngle}rad)` });

			newPos = flipperRechts.position;
			newAngle = flipperRechts.angle;
			domFlipperRechts.css({ 'transform' : `translate(${newPos.x}px, ${newPos.y}px) rotate(${newAngle}rad)` });
			
			newPos = wandRechts.position;
			newAngle = wandRechts.angle;
			domWandRechts.css({ 'transform' : `translate(${newPos.x}px, ${newPos.y}px) rotate(${newAngle}rad)` });
			
			newPos = wandLinks.position;
			newAngle = wandLinks.angle;
			domWandLinks.css({ 'transform' : `translate(${newPos.x}px, ${newPos.y}px) rotate(${newAngle}rad)` });				
		}
		
		function moveLeftFlipper() {
			Matter.Body.applyForce( flipperLinks, {x: flipperLinks.position.x, y: flipperLinks.position.y}, {x: 0, y: -2.7});
		}
		
		function moveRightFlipper() {
			Matter.Body.applyForce( flipperRechts, {x: flipperRechts.position.x, y: flipperRechts.position.y}, {x: 0, y: -2.7});
		}
		
		
		function go() {
			engine = Matter.Engine.create();
			engine.enableSleeping = true;
			
			var render = Matter.Render.create({
				element: document.body,
				engine: engine,
				options: {
					width: document.body.clientWidth,
					height: document.body.clientHeight
				}
			});
			
			const screenWidth = document.body.clientWidth;   // 800
			const screenHeight = document.body.clientHeight;  // 600
			const boundsThickness = 150;
			const halfBoundsThickness = boundsThickness / 2;
			const halfScreenWidth = screenWidth / 2;
			const halfScreenHeight = screenHeight / 2;
			
			var ground = Matter.Bodies.rectangle(halfScreenWidth, screenHeight + halfBoundsThickness, screenWidth, boundsThickness, { isStatic: true });
			var wallLeft = Matter.Bodies.rectangle(-halfBoundsThickness, halfScreenHeight, boundsThickness, screenHeight, { isStatic: true });
			var wallRight = Matter.Bodies.rectangle(screenWidth+halfBoundsThickness, halfScreenHeight, boundsThickness, screenHeight, { isStatic: true });
			var ceiling = Matter.Bodies.rectangle(halfScreenWidth, -halfBoundsThickness, screenWidth, boundsThickness, { isStatic: true });

			const flipperThickness = Ball.radius * 2;
			const flipperPosY = screenHeight - 65;
			const flipperLinksPosX = halfScreenWidth - 126;

			flipperLinks = Matter.Bodies.rectangle(flipperLinksPosX, flipperPosY - 40, flipperThickness, 165, { angle: 2.00, density: 0.005 } );  //Matter.Bodies.trapezoid(330, 360, 32, 165, 0.33, {  angle: 2.00, density: 0.005 } );
			let leftHinge = Matter.Bodies.circle(flipperLinksPosX - 90, flipperPosY - 59, 5, {	isStatic: true });
			let leftStopHinge = Matter.Bodies.circle(flipperLinksPosX + 50, flipperPosY + 10, 10, { isStatic: true });
			wandLinks = Matter.Bodies.rectangle(flipperLinksPosX-420, flipperPosY - 150 -250, 960, 32, { isStatic: true, angle: (Math.PI / 4) });
			
			let leftBinding = Matter.Constraint.create({
				bodyA: flipperLinks,
				pointA: { x: -90.0, y: -39.0 },
				bodyB: leftHinge,
				length: 0,
				stiffness: 0.4
			});	

			const flipperRechtsPosX = halfScreenWidth + 126;

			flipperRechts = Matter.Bodies.rectangle(flipperRechtsPosX, flipperPosY - 40, flipperThickness, 165, {  angle: -2.00, density: 0.005 } );
			let rightHinge = Matter.Bodies.circle(flipperRechtsPosX + 90, flipperPosY - 59, 5, { isStatic: true });
			let rightStopHinge = Matter.Bodies.circle(flipperRechtsPosX - 50, flipperPosY + 10, 10, { isStatic: true });
			wandRechts = Matter.Bodies.rectangle(flipperRechtsPosX+420, flipperPosY - 150 - 250, 960, 32, { isStatic: true, angle: -(Math.PI / 4) });
			
			let rightBinding = Matter.Constraint.create({
				bodyA: flipperRechts,
				pointA: { x: 90.0, y: -39.0 },
				bodyB: rightHinge,
				length: 0,
				stiffness: 0.4
			});	

			Matter.Composite.add(engine.world, [ ground, wallLeft, ceiling, wallRight, flipperLinks, leftHinge, leftBinding, leftStopHinge, wandLinks, flipperRechts, rightHinge, rightBinding, rightStopHinge, wandRechts ]);
			
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
			
			domFlipperLinks = createFlipperInDOM();
			domFlipperRechts = createFlipperInDOM();
			
			domWandRechts = $('<div style="background-color: #0000cc; display: inline-block; position: absolute; left: -480px; top: -16px; width: 960px; height: 32px"></div>');
			container.append(domWandRechts);

			domWandLinks = $('<div style="background-color: #0000cc; display: inline-block; position: absolute; left: -480px; top: -16px; width: 960px; height: 32px"></div>');
			container.append(domWandLinks);			
			
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
			let newBall = $('<div style="position: absolute; left: -16px; top: -16px; display: none; width: 32px; height: 32px;"><img class="flipperbal" src="/assets/voetbal32x32.png" alt="ball" width="32" height="32"></div>');
			return newBall;
		}
		
		
		function createFlipperInDOM() {
			let flipper = $('<div style="background-color: blue; display: inline-block; position: absolute; left: -16px; top: -82.5px; width: 32px; height: 165px"></div>');
			//let flipper = $('<svg height="60" width="160"><polygon points="0,30 160,60 160,0" style="fill:blue;stroke:purple;stroke-width:1" /></svg>');
			container.append(flipper);
			return flipper;
		}


		this.go = go;
		this.matterEngine = matterEngine;
                
        init();
    };
	
	return Main;
})();
