// ================= CONFIG =================
const API_BASE = 'http://localhost:3000/api';

// ================= QUIZ DATA =================
const questions = [
    {
        text: "You stumble upon hidden treasure deep in the Forbidden Forest. What do you do?",
        image: "images/forest.jpeg",
        options: [
            { text: "Charge in boldly — glory awaits!", house: "gryffindor" },
            { text: "Devise a cunning plan to claim it to your advantage.", house: "slytherin" },
            { text: "Study it carefully to understand its origins first.", house: "ravenclaw" },
            { text: "Share the discovery with your closest friends.", house: "hufflepuff" }
        ]
    },
    {
        text: "When faced with a seemingly impossible challenge, your first instinct is to...",
        image: "images/challenge.jpeg",
        options: [
            { text: "Face it head-on, consequences be damned.", house: "gryffindor" },
            { text: "Find the cleverest angle to outmaneuver it.", house: "slytherin" },
            { text: "Analyze it logically from every possible angle.", house: "ravenclaw" },
            { text: "Rally your allies — together you will prevail.", house: "hufflepuff" }
        ]
    },
    {
        text: "A perfect free afternoon at Hogwarts would be spent...",
        image: "images/free-time.jpeg",
        options: [
            { text: "Exploring somewhere forbidden and dangerous.", house: "gryffindor" },
            { text: "Scheming your next great ambition.", house: "slytherin" },
            { text: "Lost in the library among ancient tomes.", house: "ravenclaw" },
            { text: "Helping a struggling classmate with their studies.", house: "hufflepuff" }
        ]
    },
    {
        text: "If you could master one extraordinary magical ability, it would be...",
        image: "images/ability.jpeg",
        options: [
            { text: "Invisibility — to go where none dare follow.", house: "gryffindor" },
            { text: "Legilimency — to read and influence minds.", house: "slytherin" },
            { text: "Chronokinesis — to manipulate time itself.", house: "ravenclaw" },
            { text: "Healing magic — to mend what has been broken.", house: "hufflepuff" }
        ]
    },
    {
        text: "When someone betrays your trust, you...",
        image: "images/betrayal.jpeg",
        options: [
            { text: "Confront them directly — you deserve answers.", house: "gryffindor" },
            { text: "Bide your time and repay it on your own terms.", house: "slytherin" },
            { text: "Reflect carefully on what went wrong and why.", house: "ravenclaw" },
            { text: "Find it in your heart to forgive and move forward.", house: "hufflepuff" }
        ]
    },
    {
        text: "What drives you forward when the road grows dark?",
        image: "images/motivation.jpeg",
        options: [
            { text: "The thrill of adventure and the promise of glory.", house: "gryffindor" },
            { text: "Power, influence, and the taste of hard-won success.", house: "slytherin" },
            { text: "The pursuit of truth and ever-deeper understanding.", house: "ravenclaw" },
            { text: "The bonds of loyalty that never, ever break.", house: "hufflepuff" }
        ]
    }
];

const houseData = {
    gryffindor: {
        name: "Gryffindor",
        description: "Your heart beats with uncommon bravery. You rush toward danger when others flee, driven by courage, chivalry, and an unshakeable moral compass. Daring, nerve, and nerve set Gryffindors apart."
    },
    slytherin: {
        name: "Slytherin",
        description: "You possess sharp cunning and a singular ambition. Where others see obstacles, you see opportunity. Resourceful, determined, and destined for greatness entirely on your own terms."
    },
    ravenclaw: {
        name: "Ravenclaw",
        description: "Your mind is your greatest treasure. Witty, creative, and endlessly curious, you seek wisdom in all things. Ravenclaw prizes learning and ingenuity above all else."
    },
    hufflepuff: {
        name: "Hufflepuff",
        description: "Your loyalty is legendary and your heart boundless. You work tirelessly, forgive easily, and lift those around you without need for recognition or glory."
    }
};

const houseImages = {
    gryffindor: "images/gryffindor.jpg",
    slytherin:  "images/slytherin.jpg",
    ravenclaw:  "images/ravenclaw.jpg",
    hufflepuff: "images/hufflepuff.jpg"
};

// House color palettes for particles + flood
const houseColors = {
    gryffindor: { primary: '#c0392b', secondary: '#e74c3c', dark: '#7b0000' },
    slytherin:  { primary: '#1a7a1a', secondary: '#27ae60', dark: '#004400' },
    ravenclaw:  { primary: '#1a3a9a', secondary: '#2980b9', dark: '#000c4a' },
    hufflepuff: { primary: '#c9940e', secondary: '#f1c40f', dark: '#6b4e00' }
};

// ================= DOM ELEMENTS =================
const startContainer    = document.getElementById('start-container');
const startBtn          = document.getElementById('start-btn');
const questionContainer = document.getElementById('question-container');
const thinkingContainer = document.getElementById('thinking-container');
const questionText      = document.getElementById('question-text');
const questionImg       = document.getElementById('question-img');
const optionsDiv        = document.getElementById('options');
const resultContainer   = document.getElementById('result-container');
const houseReveal       = document.getElementById('house-reveal');
const houseImg          = document.getElementById('house-img');
const retakeBtn         = document.getElementById('retake-btn');
const heroStartBtn      = document.getElementById('hero-start-btn');
const nameModal         = document.getElementById('name-modal');
const nameInput         = document.getElementById('name-input');
const nameConfirmBtn    = document.getElementById('name-confirm-btn');
const particleCanvas    = document.getElementById('particleCanvas');
const houseFlood        = document.getElementById('house-flood');
const body              = document.body;

// ================= STATE =================
let currentQuestionIndex = 0;
let scores = { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 };
let studentName = '';
let particleAnimId = null;

const downloadBtn = document.getElementById('download-btn');

if (downloadBtn) {
    downloadBtn.addEventListener('click', async () => {

        const shareCard = document.getElementById('share-card');

        // Fill data
        document.getElementById('share-name').textContent = studentName || "Young Wizard";
        document.getElementById('share-house').textContent = houseReveal.textContent;
        document.getElementById('share-img').src = houseImg.src;

        // Show temporarily
        shareCard.classList.remove('hidden');

        const canvas = await html2canvas(shareCard);

        const link = document.createElement('a');
        link.download = 'hogwarts-result.png';
        link.href = canvas.toDataURL();
        link.click();

        // Hide again
        shareCard.classList.add('hidden');
    });
}
// ================= STARFIELD =================
function initStarfield() {
    const canvas = document.createElement('canvas');
    canvas.id = 'starsCanvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const stars = Array.from({ length: 180 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.005 + 0.002
    }));

    function draw() {
        canvas.width  = window.innerWidth;
        canvas.height = document.body.scrollHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            s.a += s.speed;
            const alpha = (Math.sin(s.a) + 1) / 2 * 0.65 + 0.1;
            ctx.beginPath();
            ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(218,205,170,${alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// ================= PROGRESS PIPS =================
function renderPips() {
    const existing = document.getElementById('quiz-progress-pips');
    if (existing) existing.remove();

    const pips = document.createElement('div');
    pips.id = 'quiz-progress-pips';
    pips.className = 'quiz-progress';

    questions.forEach((_, i) => {
        const pip = document.createElement('div');
        pip.className = 'quiz-pip' +
            (i < currentQuestionIndex ? ' done' : i === currentQuestionIndex ? ' active' : '');
        pips.appendChild(pip);
    });

    questionContainer.insertBefore(pips, questionContainer.firstChild);
}

// ================= NAME MODAL =================
function showNameModal(onConfirm) {
    nameModal.classList.remove('hidden');
    nameInput.value = '';
    nameInput.focus();

    function submit() {
        const name = nameInput.value.trim();
        if (!name) {
            // Shake the input
            nameInput.classList.remove('shake');
            void nameInput.offsetWidth; // force reflow
            nameInput.classList.add('shake');
            nameInput.style.borderBottomColor = 'rgba(200,60,60,0.7)';
            setTimeout(() => nameInput.style.borderBottomColor = '', 600);
            return;
        }
        studentName = name;
        nameModal.classList.add('hidden');
        onConfirm();
    }

    // Clean up old listeners by replacing buttons
    const newConfirmBtn = nameConfirmBtn.cloneNode(true);
    nameConfirmBtn.parentNode.replaceChild(newConfirmBtn, nameConfirmBtn);

    newConfirmBtn.addEventListener('click', submit);
    nameInput.addEventListener('keydown', function handler(e) {
        if (e.key === 'Enter') {
            submit();
            nameInput.removeEventListener('keydown', handler);
        }
    });
}

// ================= QUIZ FUNCTIONS =================
function initQuiz() {
    renderPips();
    showQuestion();
}

function showQuestion() {
    renderPips();

    const question = questions[currentQuestionIndex];

    questionText.style.opacity = '0';
    questionText.style.transform = 'translateY(10px)';
    optionsDiv.style.opacity = '0';

    setTimeout(() => {
        questionText.textContent = question.text;
        if (questionImg) questionImg.src = question.image;

        optionsDiv.innerHTML = '';
        question.options.forEach((option, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option.text;
            btn.style.opacity = '0';
            btn.style.transform = 'translateX(-12px)';
            btn.addEventListener('click', () => selectOption(btn, option.house));
            optionsDiv.appendChild(btn);

            // Stagger each option in
            setTimeout(() => {
                btn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                btn.style.opacity = '1';
                btn.style.transform = 'translateX(0)';
            }, i * 60 + 80);
        });

        questionText.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        optionsDiv.style.transition = 'opacity 0.35s ease';
        questionText.style.opacity = '1';
        questionText.style.transform = 'translateY(0)';
        optionsDiv.style.opacity = '1';
    }, 220);
}

function selectOption(btn, house) {
    // Disable all buttons immediately
    document.querySelectorAll('.option-btn').forEach(b => {
        b.style.pointerEvents = 'none';
        b.style.opacity = '0.4';
    });
    btn.classList.add('selected');
    btn.style.opacity = '1';

    scores[house]++;
    currentQuestionIndex++;

    setTimeout(() => {
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showThinking();
        }
    }, 380);
}

// ================= THINKING STATE =================
function showThinking() {
    questionContainer.classList.add('hidden');
    thinkingContainer.classList.remove('hidden');

    // Random thinking messages for fun
    const messages = [
        'The Hat is deliberating...',
        'Hmm... a difficult one...',
        'The Hat sees much in you...',
        'Your mind is complex indeed...',
        'Almost... yes, almost decided...'
    ];
    const msgEl = thinkingContainer.querySelector('.thinking-text');
    let idx = 0;
    const interval = setInterval(() => {
        idx = (idx + 1) % messages.length;
        msgEl.style.opacity = '0';
        setTimeout(() => {
            msgEl.textContent = messages[idx];
            msgEl.style.transition = 'opacity 0.4s';
            msgEl.style.opacity = '1';
        }, 200);
    }, 900);

    // After 2.8s, show result
    setTimeout(() => {
        clearInterval(interval);
        thinkingContainer.classList.add('hidden');
        showResult();
    }, 2800);
}

// ================= PARTICLE SYSTEM =================
function launchParticles(house) {
    const colors = houseColors[house];
    const ctx = particleCanvas.getContext('2d');

    particleCanvas.width  = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    particleCanvas.classList.add('active');

    const particles = [];
    const GOLD = '#d4a017';
    const GOLD2 = '#f0c040';

    // Spawn burst of particles from center-top
    for (let i = 0; i < 120; i++) {
        const isGold = Math.random() < 0.5;
        const angle  = (Math.random() * Math.PI * 2);
        const speed  = Math.random() * 7 + 2;
        particles.push({
            x: particleCanvas.width / 2,
            y: particleCanvas.height * 0.35,
            vx: Math.cos(angle) * speed * (0.6 + Math.random() * 0.8),
            vy: Math.sin(angle) * speed - Math.random() * 4,
            r: Math.random() * 5 + 2,
            color: isGold
                ? (Math.random() < 0.5 ? GOLD : GOLD2)
                : (Math.random() < 0.5 ? colors.primary : colors.secondary),
            alpha: 1,
            decay: Math.random() * 0.018 + 0.012,
            gravity: 0.18 + Math.random() * 0.12,
            shape: Math.random() < 0.3 ? 'star' : 'circle'
        });
    }

    function drawStar(ctx, x, y, r) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const innerAngle = angle + (2 * Math.PI) / 10;
            if (i === 0) ctx.moveTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
            else ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
            ctx.lineTo(x + (r * 0.4) * Math.cos(innerAngle), y + (r * 0.4) * Math.sin(innerAngle));
        }
        ctx.closePath();
        ctx.fill();
    }

    function animate() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        let alive = false;
        particles.forEach(p => {
            if (p.alpha <= 0) return;
            alive = true;

            p.x  += p.vx;
            p.y  += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.99;
            p.alpha -= p.decay;

            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;

            if (p.shape === 'star') {
                drawStar(ctx, p.x, p.y, p.r);
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        ctx.globalAlpha = 1;

        if (alive) {
            particleAnimId = requestAnimationFrame(animate);
        } else {
            particleCanvas.classList.remove('active');
        }
    }

    if (particleAnimId) cancelAnimationFrame(particleAnimId);
    animate();
}

// ================= HOUSE FLOOD =================
function triggerHouseFlood(house) {
    const colors = houseColors[house];
    houseFlood.style.background =
        `radial-gradient(ellipse at 50% 40%, ${colors.primary}22 0%, ${colors.dark}11 50%, transparent 80%)`;
    houseFlood.classList.add('show');
}

function clearHouseFlood() {
    houseFlood.classList.remove('show');
    houseFlood.style.background = '';
}

// ================= SHOW RESULT =================
function showResult() {
    // Determine winner
    let maxScore = 0;
    let winner = 'gryffindor';
    for (const house in scores) {
        if (scores[house] > maxScore) {
            maxScore = scores[house];
            winner = house;
        }
    }

    // Set body class for CSS house-specific styling
    body.classList.add(`${winner}-bg`);

    // Flood the background with house color
    triggerHouseFlood(winner);

    // Populate result
    const nameEl = document.getElementById('result-student-name');
    if (nameEl) nameEl.textContent = studentName || 'Young Wizard';
    houseReveal.textContent = houseData[winner].name;
    houseImg.src = houseImages[winner];

    const descEl = document.getElementById('house-description');
    if (descEl) descEl.textContent = houseData[winner].description;

    // Show result card
    resultContainer.classList.remove('hidden');

    // Launch particles after a short delay (let crest animate in first)
    setTimeout(() => launchParticles(winner), 600);

    // Save to backend
    saveToBackend(studentName || 'Anonymous', winner, scores);
}

// ================= SAVE TO BACKEND =================
async function saveToBackend(name, house, scores) {
    try {
        const response = await fetch(`${API_BASE}/sort`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, house, scores })
        });
        if (!response.ok) return;
        const data = await response.json();
        console.log('✅ Saved to Neo4j:', data);
    } catch (err) {
        // Silently fail — quiz experience is unaffected
        console.warn('Backend unreachable:', err.message);
    }
}

// ================= RETAKE =================
if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
        currentQuestionIndex = 0;
        scores = { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 };
        studentName = '';

        body.classList.remove('gryffindor-bg', 'slytherin-bg', 'ravenclaw-bg', 'hufflepuff-bg');
        clearHouseFlood();

        // Stop particles
        if (particleAnimId) {
            cancelAnimationFrame(particleAnimId);
            particleCanvas.classList.remove('active');
        }

        resultContainer.classList.add('hidden');
        thinkingContainer.classList.add('hidden');

        // Show name modal again for a fresh entry
        showNameModal(() => {
            questionContainer.classList.remove('hidden');
            initQuiz();
        });
    });
}

// ================= START BUTTON =================
if (startBtn) {
    startBtn.addEventListener('click', () => {
        startContainer.classList.add('hidden');
        showNameModal(() => {
            questionContainer.classList.remove('hidden');
            initQuiz();
        });
    });
}

// Hero section button — smooth scroll only
if (heroStartBtn) {
    heroStartBtn.addEventListener('click', () => {
        document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
    });
}

// ================= INIT =================
window.addEventListener('load', initStarfield);
