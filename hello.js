const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(ctx);
const particleArray = [];
let colorShiftCounter = 0;
let hue = 0;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})


const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    init(10)
})
canvas.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
    init(1);
})


// function draw(ctx) {
//     ctx.fillStyle = '#ffffff';
//     ctx.beginPath()
//     ctx.strokeStyle = '#bdbdbd'
//     ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
//     ctx.fill()
//     ctx.stroke()
//     console.log(ctx)
// }


function handleColorShift() {
    colorShiftCounter++;
    hue += 0.3;
    if (colorShiftCounter > 25) {
        brushColor = randomRgb();
        colorShiftCounter = 0;
    }
    if (hue > 36000) {
        hue = 0;
    }

}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // ctx.fillStyle = `rgb(0, 0, 0, 0.4)`
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    handleColorShift();
    requestAnimationFrame(animate)
}

animate();

class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.RGBcolor = brushColor;
        this.hueColor = `hsl(${hue}, 100%, 50%)`;

    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) {
            this.size -= 0.1;
        }
    }

    draw() {
        ctx.fillStyle = this.hueColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

}

function init(number) {
    for (let i = 0; i < number; i++) {
        particleArray.push(new Particle())
    }
}

function handleParticles() {
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();

        for (let j = i; j < particleArray.length; j++) {
            const dx = particleArray[i].x - particleArray[j].x;
            const dy = particleArray[i].y - particleArray[j].y;
            const distance =Math.exp(1 / 2 * Math.log(dx * dx + dy * dy));
            // const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 50) {
                ctx.beginPath();
                ctx.strokeStyle = particleArray[i].hueColor;
                ctx.lineWidth = particleArray[i].size/7;
                ctx.moveTo(particleArray[i].x, particleArray[i].y);
                ctx.lineTo(particleArray[j].x, particleArray[j].y);
                ctx.stroke();
            }


        }
        if (particleArray[i].size <= 0.3) {
            particleArray.splice(i, 1);
            i--;
        }

    }
}

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min) + 1);
const randomRgb = () => {
    const r = randomBetween(0, 255);
    const g = randomBetween(0, 255);
    const b = randomBetween(0, 255);
    return `rgb(${r},${g},${b})`
}

console.log(particleArray)

let brushColor = randomRgb();



