let canvas, ctx;
let render, init;
let blob;
let backgroundImage;
let backgroundCanvas;

const IDLE = {
    friction: 0.90,
    elasticity: 0.0015
};

const HOVER = {
    friction: 0.70,
    elasticity: 0.005
};

let motionIntensity = 0.3; // idle default

class Blob {
    constructor() {
        this.points = [];
    }

    init() {
        for (let i = 0; i < this.numPoints; i++) {
            let point = new Point(this.divisional * (i + 1), this);
            point.acceleration = 0;
            point.radialEffect = 0;
            point.speed = 0;
            this.push(point);
        }
    }

    render() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const points = this.points;

        // 1️⃣ Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2️⃣ Fill entire canvas black (outside blob)
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 3️⃣ Build blob path
        ctx.beginPath();
        let p0 = points[points.length - 1].position;
        let p1 = points[0].position;
        ctx.moveTo((p0.x + p1.x)/2, (p0.y + p1.y)/2);

        for (let i = 1; i < points.length; i++) {
            let point = points[i];
            point.solveWith(points[i - 1], points[i + 1] || points[0]);
            const p2 = points[i].position;
            const xc = (p1.x + p2.x)/2;
            const yc = (p1.y + p2.y)/2;
            ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
            p1 = p2;
        }

        const p2 = points[0].position;
        const xc = (p1.x + p2.x)/2;
        const yc = (p1.y + p2.y)/2;
        ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
        ctx.closePath();

        // 4️⃣ Clip to blob
        ctx.save();
        ctx.clip();

        // 5️⃣ Draw the moving background canvas inside the blob
        // Make sure backgroundCanvas is your moving background canvas element
        ctx.drawImage(backgroundCanvas, 0, 0, canvas.width, canvas.height);

        // 6️⃣ Draw the transparent image on top, fixed and centered
        const imgRatio = backgroundImage.width / backgroundImage.height;
        let drawWidth, drawHeight;
        if (imgRatio > canvas.width / canvas.height) {
            drawWidth = canvas.width * 0.9;
            drawHeight = drawWidth / imgRatio;
        } else {
            drawHeight = canvas.height * 0.9;
            drawWidth = drawHeight * imgRatio;
        }

        const offsetX = canvas.width / 2 - drawWidth / 2;
        const offsetY = canvas.height / 2 - drawHeight / 2;

        ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);

        ctx.restore(); // remove clip

        // 7️⃣ Optional blob outline
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        // ctx.stroke();

        // 8️⃣ Animate next frame
        requestAnimationFrame(this.render.bind(this));

        // let targetIntensity = hover ? 1 : 0.3;
        // motionIntensity += (targetIntensity - motionIntensity) * 0.05;
    }

    push(item) {
        if (item instanceof Point) {
            this.points.push(item);
        }
    }

    set color(value) {
        this._color = value;
    }
    get color() {
       // return this._color || '#000000';
    }

    set canvas(value) {
        if (value instanceof HTMLElement && value.tagName.toLowerCase() === 'canvas') {
            this._canvas = value;
            this.ctx = this._canvas.getContext('2d');
        }
    }
    get canvas() {
        return this._canvas;
    }

    set numPoints(value) {
        if (value > 2) {
            this._points = value;
        }
    }
    get numPoints() {
        return this._points || 20;
    }

    set radius(value) {
        if (value > 0) {
            this._radius = value;
        }
    }
    get radius() {
        return Math.min(this.canvas.width, this.canvas.height) * 0.4;
    }

    set position(value) {
        if (typeof value == 'object' && value.x && value.y) {
            this._position = value;
        }
    }
    get position() {
        return this._position || { x: 0.5, y: 0.5 };
    }

    get divisional() {
        return Math.PI * 2 / this.numPoints;
    }

    get center() {
        return { x: this.canvas.width * this.position.x, y: this.canvas.height * this.position.y };
    }

    set running(value) {
        this._running = value === true;
    }
    get running() {
        return this.running !== false;
    }
}

class Point {
    constructor(azimuth, parent) {
        this.parent = parent;
        this.azimuth = Math.PI - azimuth;
        this._components = {
            x: Math.cos(this.azimuth),
            y: Math.sin(this.azimuth),
        };

        this.acceleration = -0.3 + Math.random() * 0.6;
    }

    solveWith(leftPoint, rightPoint) {
    let baseForce =
    ((-0.3 * this.radialEffect +
    (leftPoint.radialEffect - this.radialEffect) +
    (rightPoint.radialEffect - this.radialEffect))
    * this.elasticity
    - this.speed * this.friction)
    * motionIntensity; // scale by motion intensity

    let idleForce = Math.sin(Date.now() * 0.001 + this.azimuth) * 0.0015;

    this.acceleration = baseForce + idleForce;
}

    set acceleration(value) {
        if (typeof value == 'number') {
            this._acceleration = value;
            this.speed += this._acceleration * 2;
        }
    }
    get acceleration() {
        return this._acceleration || 0;
    }

    set speed(value) {
        if (typeof value == 'number') {
            this._speed = value;
            this.radialEffect += this._speed * 4;
        }
    }
    get speed() {
        return this._speed || 0;
    }

    set radialEffect(value) {
        if (typeof value == 'number') {
            this._radialEffect = value;
        }
    }
    get radialEffect() {
        return this._radialEffect || 0;
    }

    get position() {
        return {
            x: this.parent.center.x + this.components.x * (this.parent.radius + this.radialEffect),
            y: this.parent.center.y + this.components.y * (this.parent.radius + this.radialEffect),
        }
    }

    get components() {
        return this._components;
    }

    set elasticity(value) {
        if (typeof value === 'number') {
            this._elasticity = value;
        }
    }
    get elasticity() {
        return this._elasticity || 0.001;
    }
    set friction(value) {
        if (typeof value === 'number') {
            this._friction = value;
        }
    }
    get friction() {
        return this._friction || 0.0085;
    }
}

blob = new Blob;

init = function () {
    // canvas = document.createElement('canvas');
    canvas = document.getElementById("canvas");
    canvas.setAttribute('touch-action', 'none');
    backgroundCanvas = document.getElementById("webGLApp");
    host = document.getElementById("host-section");
    host.appendChild(canvas);

    let resize = function () {
        let width = host.offsetWidth;

        canvas.width = width;

        // decide blob size based on screen
        let maxBlobHeight = 600;

        let blobHeight;

        if (window.innerWidth >= 1024) {
            blobHeight = maxBlobHeight;
        } else {
            blobHeight = Math.min(window.innerWidth * 0.9, maxBlobHeight);
        }

        canvas.height = blobHeight;

        blob.canvas = canvas;
        blob.radius = blobHeight / 2;

        blob.points = [];
        blob.init();
    }
    window.addEventListener('resize', resize);
    resize();
    window.addEventListener("load", () => {
        console.log( "loaded");
        resize();

        requestAnimationFrame(() => {
            blob.points = [];
            blob.init();
        });
    });

    let oldMousePoint = { x: 0, y: 0 };
    let hover = false;
    let mouseMove = function (e) {
        blob.hover = hover; // update the blob's hover state
        let pos = blob.center;
        let diff = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        let dist = Math.sqrt((diff.x * diff.x) + (diff.y * diff.y));
        let angle = null;

        blob.mousePos = { x: pos.x - e.clientX, y: pos.y - e.clientY };

        if (dist < blob.radius && hover === false) {
            let vector = { x: e.clientX - pos.x, y: e.clientY - pos.y };
            angle = Math.atan2(vector.y, vector.x);
            hover = true;
            // blob.color = '#77FF00';
        } else if (dist > blob.radius && hover === true) {
            let vector = { x: e.clientX - pos.x, y: e.clientY - pos.y };
            angle = Math.atan2(vector.y, vector.x);
            hover = false;
            blob.color = null;
        }

        if (typeof angle == 'number') {

            let nearestPoint = null;
            let distanceFromPoint = 100;

            blob.points.forEach((point) => {
                if (Math.abs(angle - point.azimuth) < distanceFromPoint) {
                    // console.log(point.azimuth, angle, distanceFromPoint);
                    nearestPoint = point;
                    distanceFromPoint = Math.abs(angle - point.azimuth);
                }

            });

            if (nearestPoint) {
                let strength = { x: oldMousePoint.x - e.clientX, y: oldMousePoint.y - e.clientY };
                strength = Math.sqrt((strength.x * strength.x) + (strength.y * strength.y)) * 10;
                strength = Math.min(strength, 60);
                nearestPoint.acceleration = (strength / 100) * motionIntensity * (hover ? -1 : 1);
            }
        }

        oldMousePoint.x = e.clientX;
        oldMousePoint.y = e.clientY;
    }
    // window.addEventListener('mousemove', mouseMove);
    window.addEventListener('pointermove', mouseMove);

    blob.canvas = canvas;
    blob.init();
    backgroundImage = new Image();
    backgroundImage.src = "/styles/assets/speakers/backstage.png";

    backgroundImage.onload = function () {
        blob.render(); // start animation only after image loads
    };
}

init();