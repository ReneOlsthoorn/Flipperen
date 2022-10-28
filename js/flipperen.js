
var reneo = window.reneo || {};
reneo.Flipperen = reneo.Flipperen || {};

reneo.Flipperen.Main = (function () {
    "use strict";
    
    function Main(theContainer) {
		var container,
			startTs,
			balls = [],
			engine,
			render;

			
        function init() {
			container = $(theContainer);
        }

		
		function matterEngine() {
			return engine;
		}


		function update() {
			Matter.Engine.update(engine, 1000 / 60);
			
			//var bodies = Matter.Composite.allBodies(engine.world);
			for (const [i, ball] of balls.entries()) {
				if (ball.isDeleted) { insertNewDynamicBall(i); }
				if (ball.ballBody.isSleeping) {	ball.remove(); }
				
				ball.updateDomPosition();
			}
		}
		
		
		function go() {
			engine = Matter.Engine.create();
			engine.enableSleeping = true;
			
			var render = Matter.Render.create({
				element: document.body,
				engine: engine
			});
			
			var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
			var wallLeft = Matter.Bodies.rectangle(0, 0, 60, 1200, { isStatic: true });
			var wallRight = Matter.Bodies.rectangle(800, 0, 60, 1200, { isStatic: true });
			Matter.Composite.add(engine.world, [ ground, wallLeft, wallRight ]);			
			
			// dynamische ballen
			for (let i = 0; i < 15; i++) {
				insertNewDynamicBall(i);
			}
			
			// statische ballen
			for (let i = 0; i < 4; i++) {
				let ballImage = createBallImage();
				container.append(ballImage);
				
				let ballBody = Matter.Bodies.circle(200 + (i * 30), 400 + (i * 40), Ball.radius, { isStatic: true, restitution: 1.0, friction: 0.0005 });
				
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
			
			let ballBody = Matter.Bodies.circle(20 + (i * 34), 16, Ball.radius, { isStatic: false, restitution: 1.0, friction: 0.0005 });
			
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
