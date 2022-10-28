
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

		function update() {
			Matter.Engine.update(engine, 1000 / 60);
			
			//var bodies = Matter.Composite.allBodies(engine.world);
			for (let ball of balls) {
				ball.updateDomPosition();
			}
		}
		
		function go() {
			engine = Matter.Engine.create();
			
			var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
			var wallLeft = Matter.Bodies.rectangle(0, 0, 60, 1200, { isStatic: true });
			var wallRight = Matter.Bodies.rectangle(800, 0, 60, 1200, { isStatic: true });
			Matter.Composite.add(engine.world, [ ground, wallLeft, wallRight ]);			
			
			for (let i = 1; i < 10; i++) {
				let ballImage = createBallImage();
				container.append(ballImage);
				
				let ballBody = Matter.Bodies.circle(100 + (i * 30), 0 + (i * 40), Ball.radius, { isStatic: false, restitution: 1.0, friction: 0.0005 });
				
				Matter.Composite.add(engine.world, [ ballBody ]);
				
				let newBall = new Ball(ballImage, ballBody);
				balls.push(newBall);
			}			
			
			window.requestAnimationFrame(step);
		}
		
		function collisionEndHandler() {
			Events.on(engine, 'collisionEnd', function(event) {
				var pairs = event.pairs;

				// change object colours to show those ending a collision
				for (var i = 0; i < pairs.length; i++) {
					var pair = pairs[i];

					//pair.bodyA.render.fillStyle = '#222';
					//pair.bodyB.render.fillStyle = '#222';
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
		
		function createBallImage() {
			let newBall = $('<img class="flipperbal" src="/assets/voetbal32x32.png" alt="ball" width="32" height="32">');
			return newBall;
		}
		
		function createFlipperInDOM() {
			flipper = $('<svg height="60" width="160"><polygon points="0,30 160,60 160,0" style="fill:blue;stroke:purple;stroke-width:1" /></svg>');
			container.append(flipper);
		}

		this.go = go;
                
        init();
    };
	
	return Main;
})();
