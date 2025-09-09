

const API_BASE = (window.location.hostname === 'localhost') ? 'http://localhost:4000' : '';

let lessons = [];
let currentLesson = null;
let started = false;

const urlParams = new URLSearchParams(window.location.search);
const requestedLessonId = urlParams.has('lesson') ? parseInt(urlParams.get('lesson'), 10) : null;


const lessonsList = document.getElementById('lessons');
const titleEl = document.getElementById('lesson-title');
const textEl = document.getElementById('lesson-text');
const inputEl = document.getElementById('user-input');
const progressEl = document.getElementById('progress');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const backBtn = document.getElementById('back-btn');
const searchInput = document.getElementById('search');
const categoryPill = document.getElementById('lesson-category');
const difficultyPill = document.getElementById('lesson-difficulty');

async function loadLessons() {
    try {
        const res = await axios.get(`${API_BASE}/database/all-levels`, { withCredentials: true });
        if (res.data && res.data.success) lessons = res.data.data || [];
        else lessons = [];
    } catch (err) {
        lessons = [];
        console.error('Lessons fetch failed', err);
    }
    renderLessonList(lessons);

    if (requestedLessonId && Number.isFinite(requestedLessonId)) {
        const idx = requestedLessonId - 1;
        if (idx >= 0 && idx < lessons.length) {

            setTimeout(() => selectLesson(idx), 80);
        }
    }
}

function renderLessonList(list) {
    lessonsList.innerHTML = '';
    if (!list.length) {
        lessonsList.innerHTML = '<li class="empty">Ders bulunamadı.</li>';
        return;
    }
    list.forEach((l, idx) => {
        const li = document.createElement('li');
        li.className = 'lesson-item';
        li.tabIndex = 0;
        li.innerHTML = `<strong>${escapeHtml(l.name)}</strong><span class="muted">${(l.category || '').toUpperCase()}</span>`;
        li.onclick = () => selectLesson(idx);
        li.onkeydown = (e) => { if (e.key === 'Enter') selectLesson(idx); };
        lessonsList.appendChild(li);
    });
}

function selectLesson(index) {
    currentLesson = lessons[index];
    titleEl.textContent = currentLesson.name || 'Ders';
    const text = (currentLesson.data && currentLesson.data.text) ? currentLesson.data.text : '';
    renderTargetText(text || 'Bu dersin içeriği boş.');
    inputEl.value = '';
    inputEl.readOnly = true;

    inputEl.tabIndex = 0;
    progressEl.style.width = '0%';
    categoryPill.textContent = (currentLesson.category || '').toUpperCase();
    difficultyPill.textContent = (currentLesson.data && currentLesson.data.difficulty) ? currentLesson.data.difficulty : '';
    started = false;
}

function startLesson() {
    if (!currentLesson) return alert('Lütfen önce bir ders seçin.');
    inputEl.readOnly = false;

    inputEl.focus();
    started = true;
    startTimer();
}

function resetLesson() {
    inputEl.value = '';
    progressEl.style.width = '0%';
    inputEl.readOnly = true;
    started = false;
    stopTimer();
}

function updateProgress() {
    if (!currentLesson) return;
    const target = (currentLesson.data && currentLesson.data.text) ? currentLesson.data.text : '';
    const typed = inputEl.value || '';
    let correct = 0;
    for (let i = 0; i < typed.length && i < target.length; i++) {
        if (typed[i] === target[i]) correct++; else break;
    }
    const percent = target.length ? Math.round((correct / target.length) * 100) : 0;
    progressEl.style.width = percent + '%';

    if (correct === target.length && target.length > 0) {
        started = false;
        inputEl.disabled = true;
        titleEl.textContent = 'Tebrikler — Ders Tamamlandı!';
    }
}


function renderTargetText(text) {
    textEl.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = text[i];
        textEl.appendChild(span);
    }
}


let timerId = null;
let startTime = null;

function startTimer() {
    startTime = Date.now();
    document.getElementById('timer').textContent = '00:00';
    timerId = setInterval(() => {
        const diff = Date.now() - startTime;
        const s = Math.floor(diff / 1000);
        const mm = String(Math.floor(s / 60)).padStart(2, '0');
        const ss = String(s % 60).padStart(2, '0');
        document.getElementById('timer').textContent = `${mm}:${ss}`;
        updateWpm();
    }, 1000);
}

function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
}

function updateWpm() {
    const elapsedMin = Math.max(1 / 60, (Date.now() - startTime) / 60000);
    const typed = inputEl.value || '';
    const words = typed.trim().split(/\s+/).filter(Boolean).length;
    const wpm = Math.round(words / elapsedMin);
    document.getElementById('wpm').textContent = isFinite(wpm) ? wpm : 0;
    updateAccuracy();
}

function updateAccuracy() {
    const spans = textEl.querySelectorAll('.char');
    const typed = inputEl.value || '';
    let correct = 0;
    for (let i = 0; i < spans.length; i++) {
        const c = spans[i].textContent;
        const t = typed[i];
        spans[i].classList.remove('correct', 'incorrect', 'current');
        if (t == null) { }
        else if (t === c) { spans[i].classList.add('correct'); correct++; }
        else { spans[i].classList.add('incorrect'); }
    }
    const accuracy = spans.length ? Math.round((correct / Math.min(typed.length, spans.length)) * 100) : 0;
    document.getElementById('accuracy').textContent = isFinite(accuracy) ? accuracy + '%' : '0%';
}


inputEl.addEventListener('input', () => {
    if (!started) return;
    updateProgress();
    updateHighlighting();
});

function updateHighlighting() {
    const spans = textEl.querySelectorAll('.char');
    const typed = inputEl.value || '';
    for (let i = 0; i < spans.length; i++) {
        spans[i].classList.remove('current');
        if (i === typed.length) spans[i].classList.add('current');
    }
    updateAccuracy();
}


function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (c) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[c];
    });
}

startBtn.addEventListener('click', startLesson);
resetBtn.addEventListener('click', resetLesson);
backBtn.addEventListener('click', () => window.location.href = 'levelpage.html');
inputEl.addEventListener('input', () => { if (started) updateProgress(); });
searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) return renderLessonList(lessons);
    const filtered = lessons.filter(l => (l.name || '').toLowerCase().includes(q) || (l.description || '').toLowerCase().includes(q));
    renderLessonList(filtered);
});

loadLessons();

