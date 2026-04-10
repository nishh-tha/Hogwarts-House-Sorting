// ================= CONFIG =================
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : 'https://your-backend-url.onrender.com/api';


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


// ================= DOM ELEMENTS =================
const startContainer    = document.getElementById("start-container");
const startBtn          = document.getElementById("start-btn");
const questionContainer = document.getElementById("question-container");
const questionText      = document.getElementById("question-text");
const questionImg       = document.getElementById("question-img");
const optionsDiv        = document.getElementById("options");
const resultContainer   = document.getElementById("result-container");
const houseReveal       = document.getElementById("house-reveal");
const houseImg          = document.getElementById("house-img");
const retakeBtn         = document.getElementById("retake-btn");
const heroStartBtn      = document.getElementById("hero-start-btn");
const body              = document.body;


// ================= STATE =================
let currentQuestionIndex = 0;
let scores = { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 };
let studentName = '';


// ================= STARFIELD =================
function initStarfield() {
    const canvas = document.createElement('canvas');
    canvas.id = 'starsCanvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const stars = Array.from({ length: 160 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.006 + 0.002
    }));

    function draw() {
        canvas.width = window.innerWidth;
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
        pip.className = 'quiz-pip' + (i < currentQuestionIndex ? ' done' : i === currentQuestionIndex ? ' active' : '');
        pips.appendChild(pip);
    });

    questionContainer.insertBefore(pips, questionContainer.firstChild);
}


// ================= NAME PROMPT =================
// Ask for the student's name before the quiz begins
function askForName(onConfirm) {
    // Remove existing name prompt if any
    const existing = document.getElementById('name-prompt');
    if (existing) existing.remove();

    const prompt = document.createElement('div');
    prompt.id = 'name-prompt';
    prompt.style.cssText = `
        position:fixed; inset:0; background:rgba(0,0,0,0.75);
        display:flex; align-items:center; justify-content:center;
        z-index:1000; backdrop-filter:blur(4px);
    `;
    prompt.innerHTML = `
        <div style="
            background:#1a1230; border:1px solid rgba(218,205,170,0.3);
            border-radius:16px; padding:40px; max-width:380px; width:90%;
            text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.5);
        ">
            <p style="color:#daccaa; font-size:13px; letter-spacing:2px; margin-bottom:8px;">✦ THE SORTING CEREMONY ✦</p>
            <h2 style="color:#f0e8d0; font-size:22px; margin-bottom:8px;">State your name</h2>
            <p style="color:rgba(218,205,170,0.6); font-size:14px; margin-bottom:24px;">
                The Sorting Hat must know who stands before it.
            </p>
            <input
                id="name-input"
                type="text"
                placeholder="e.g. Harry Potter"
                maxlength="40"
                style="
                    width:100%; box-sizing:border-box;
                    background:rgba(255,255,255,0.07);
                    border:1px solid rgba(218,205,170,0.3);
                    border-radius:8px; padding:12px 16px;
                    color:#f0e8d0; font-size:16px; outline:none;
                    margin-bottom:20px; font-family:inherit;
                "
            />
            <button id="name-confirm-btn" style="
                background:linear-gradient(135deg,#7b3fa0,#4a2575);
                color:#f0e8d0; border:none; border-radius:8px;
                padding:12px 32px; font-size:15px; cursor:pointer;
                width:100%; letter-spacing:1px; font-family:inherit;
                transition:opacity 0.2s;
            ">Begin the Ceremony</button>
        </div>
    `;

    document.body.appendChild(prompt);

    const input   = document.getElementById('name-input');
    const confirm = document.getElementById('name-confirm-btn');
    input.focus();

    function submit() {
        const name = input.value.trim();
        if (!name) {
            input.style.borderColor = '#c0392b';
            input.placeholder = 'Please enter your name!';
            return;
        }
        studentName = name;
        prompt.remove();
        onConfirm();
    }

    confirm.addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}


// ================= FUNCTIONS =================
function initQuiz() {
    renderPips();
    showQuestion();
}

function showQuestion() {
    renderPips();

    const question = questions[currentQuestionIndex];
    questionText.style.opacity = '0';
    optionsDiv.style.opacity = '0';

    setTimeout(() => {
        questionText.textContent = question.text;
        if (questionImg) questionImg.src = question.image;

        optionsDiv.innerHTML = '';
        question.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option.text;
            btn.addEventListener('click', () => selectOption(option.house));
            optionsDiv.appendChild(btn);
        });

        questionText.style.transition = 'opacity 0.35s';
        optionsDiv.style.transition = 'opacity 0.35s';
        questionText.style.opacity = '1';
        optionsDiv.style.opacity = '1';
    }, 180);
}

function selectOption(house) {
    scores[house]++;
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

// ================= SAVE TO BACKEND =================
async function saveToBackend(name, house, scores) {
    try {
        const response = await fetch(`${API_BASE}/sort`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, house, scores })
        });

        const data = await response.json();

        if (!response.ok) {
            console.warn('Backend warning:', data.message);
            return null;
        }

        if (window.location.hostname === 'localhost') {
            console.log('Saved to Neo4j:', data);
        }

        return data;

    } catch (err) {
        console.warn('Could not reach backend:', err.message);
        alert("⚠️ Could not save your result.");
        return null;
    }
}

// ================= LOAD LEADERBOARD =================
async function loadLeaderboard() {
    try {
        const [resultsRes, statsRes] = await Promise.all([
            fetch(`${API_BASE}/results`),
            fetch(`${API_BASE}/stats`)
        ]);

        const resultsData = await resultsRes.json();
        const statsData   = await statsRes.json();

        renderLeaderboard(resultsData.students, statsData.stats);

    } catch (err) {
        console.warn('Could not load leaderboard:', err.message);
    }
}

function renderLeaderboard(students, stats) {
    // Remove old leaderboard if it exists
    const existing = document.getElementById('leaderboard-section');
    if (existing) existing.remove();

    if (!students || students.length === 0) return;

    const houseColors = {
        Gryffindor: '#ae0001',
        Slytherin:  '#1a472a',
        Ravenclaw:  '#0e1a40',
        Hufflepuff: '#ecb939'
    };

    const houseEmoji = {
        Gryffindor: '🦁',
        Slytherin:  '🐍',
        Ravenclaw:  '🦅',
        Hufflepuff: '🦡'
    };

    // Build stats bars
    const totalStudents = stats.reduce((sum, s) => sum + s.total, 0);
    const statsBars = stats.map(s => {
        const pct = totalStudents > 0 ? Math.round((s.total / totalStudents) * 100) : 0;
        const color = houseColors[s.house] || '#555';
        return `
            <div style="margin-bottom:10px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span style="color:#daccaa;font-size:13px;">${houseEmoji[s.house] || ''} ${s.house}</span>
                    <span style="color:rgba(218,205,170,0.6);font-size:13px;">${s.total} student${s.total !== 1 ? 's' : ''}</span>
                </div>
                <div style="background:rgba(255,255,255,0.08);border-radius:4px;height:8px;overflow:hidden;">
                    <div style="background:${color};width:${pct}%;height:100%;border-radius:4px;transition:width 0.8s ease;"></div>
                </div>
            </div>
        `;
    }).join('');

    // Build recent students list (latest 10)
    const recentRows = students.slice(0, 10).map(s => {
        const date = new Date(s.sortedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' });
        const color = houseColors[s.house] || '#555';
        return `
            <div style="
                display:flex; align-items:center; justify-content:space-between;
                padding:10px 0; border-bottom:1px solid rgba(218,205,170,0.08);
            ">
                <span style="color:#f0e8d0;font-size:14px;">${escapeHtml(s.name)}</span>
                <span style="
                    background:${color}33; color:${color === '#ecb939' ? '#a07800' : '#daccaa'};
                    border:1px solid ${color}66;
                    padding:3px 10px; border-radius:20px; font-size:12px;
                ">${houseEmoji[s.house] || ''} ${s.house}</span>
                <span style="color:rgba(218,205,170,0.4);font-size:12px;">${date}</span>
            </div>
        `;
    }).join('');

    const section = document.createElement('section');
    section.id = 'leaderboard-section';
    section.style.cssText = `
        padding:80px 20px; max-width:700px; margin:0 auto;
        text-align:center;
    `;
    section.innerHTML = `
        <h2 style="color:#f0e8d0;font-size:28px;margin-bottom:8px;">The Great Hall Board</h2>
        <p style="color:rgba(218,205,170,0.6);margin-bottom:48px;">Those who have been sorted before you</p>

        <div style="
            background:rgba(255,255,255,0.04); border:1px solid rgba(218,205,170,0.15);
            border-radius:16px; padding:28px; margin-bottom:24px; text-align:left;
        ">
            <p style="color:rgba(218,205,170,0.5);font-size:11px;letter-spacing:2px;margin-bottom:20px;">HOUSE STANDINGS</p>
            ${statsBars}
        </div>

        <div style="
            background:rgba(255,255,255,0.04); border:1px solid rgba(218,205,170,0.15);
            border-radius:16px; padding:28px; text-align:left;
        ">
            <p style="color:rgba(218,205,170,0.5);font-size:11px;letter-spacing:2px;margin-bottom:16px;">RECENTLY SORTED</p>
            ${recentRows}
        </div>
    `;

    // Insert before footer
    const footer = document.querySelector('.site-footer');
    if (footer) {
        document.body.insertBefore(section, footer);
    } else {
        document.body.appendChild(section);
    }
}

function escapeHtml(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
}


// ================= SHOW RESULT =================
function showResult() {
    questionContainer.classList.add('hidden');

    // Determine winner
    let maxScore = 0;
    let winner = 'gryffindor';
    for (const house in scores) {
        if (scores[house] > maxScore) {
            maxScore = scores[house];
            winner = house;
        }
    }

    // Populate result
    houseReveal.textContent = houseData[winner].name;
    houseImg.src = houseImages[winner];

    const descEl = document.getElementById('house-description');
    if (descEl) descEl.textContent = houseData[winner].description;

    // Reveal with animation
    resultContainer.classList.remove('hidden');
    setTimeout(() => resultContainer.classList.add('show'), 20);

    // Background tint
    body.classList.add(`${winner}-bg`);

    // ✨ NEW: Save to Neo4j backend
    (async () => {
    const result = await saveToBackend(studentName || 'Anonymous', winner, scores);
    if (result) {
        loadLeaderboard();
    }
})();
}


// ================= EVENTS =================
if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
        currentQuestionIndex = 0;
        scores = { gryffindor: 0, slytherin: 0, ravenclaw: 0, hufflepuff: 0 };
        studentName = '';

        body.classList.remove('gryffindor-bg', 'slytherin-bg', 'ravenclaw-bg', 'hufflepuff-bg');

        resultContainer.classList.remove('show');
        resultContainer.classList.add('hidden');

        questionContainer.classList.remove('hidden');

        // Ask for name again on retake
        askForName(() => initQuiz());
    });
}

if (startBtn) {
    startBtn.addEventListener('click', () => {
        startContainer.classList.add('hidden');
        // Ask for name before starting the quiz
        askForName(() => {
            questionContainer.classList.remove('hidden');
            initQuiz();
        });
    });
}

if (heroStartBtn) {
    heroStartBtn.addEventListener('click', () => {
        document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
    });
}

// Load leaderboard on page load
window.addEventListener('load', () => {
    initStarfield();
    loadLeaderboard();
});
