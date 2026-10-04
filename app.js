// 获取首页所需的 DOM 元素
const portalView = document.getElementById('portal-view');
const aboutView = document.getElementById('about-view');
const lineGrid = document.getElementById('line-grid');
const btnAbout = document.getElementById('btn-about');
const btnAboutBack = document.getElementById('btn-about-back');
const daysElement = document.getElementById('stable-days');

// 渲染线路卡片网格
function renderLineGrid() {
    lineGrid.innerHTML = '';
    for (const [lineKey, lineInfo] of Object.entries(metroData)) {
        const card = document.createElement('div');
        card.className = 'line-card';
        card.style.backgroundColor = lineInfo.color;
        card.style.color = lineInfo.textColor;
        card.textContent = lineInfo.name;

        card.addEventListener('click', () => {
            window.location.href = `${lineKey}`;
        });

        lineGrid.appendChild(card);
    }
}

// “关于”页面切换逻辑
if (btnAbout && portalView && aboutView) {
    btnAbout.addEventListener("click", () => {
        portalView.classList.remove("active");
        aboutView.classList.add("active");
        const footer = document.querySelector('.site-footer');
        if (footer) {
            footer.style.display = 'none';
            footer.classList.remove('fade-in');
        }
    });
}

if (btnAboutBack && portalView && aboutView) {
    btnAboutBack.addEventListener("click", () => {
        aboutView.classList.remove("active");
        portalView.classList.add("active");
        const footer = document.querySelector('.site-footer');
        if (footer) {
            footer.style.display = 'block';
            setTimeout(() => {
                footer.classList.add('fade-in');
            }, 10);
        }
    });
}

const welcomeScreen = document.getElementById('welcome-screen');
if (welcomeScreen) {
    welcomeScreen.addEventListener('click', () => {
        welcomeScreen.classList.add('opened');
        document.body.classList.remove('no-scroll');
        const footer = document.querySelector('.site-footer');
        if (footer) {
            footer.style.display = 'block';
            setTimeout(() => {
                footer.classList.add('fade-in');
            }, 10);
        }
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
        }, 1000);
    });
}

function updateRunningDays() {
    if (!daysElement) return;
    const urodz = new Date("07/17/2026");
    const now = new Date();
    const ile = now.getTime() - urodz.getTime();
    const dni = Math.floor(ile / (1000 * 60 * 60 * 24));
    daysElement.textContent = dni >= 0 ? dni : 0;
}

document.addEventListener('DOMContentLoaded', () => {
    renderLineGrid();
    updateRunningDays();
});

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});
document.addEventListener('keydown', function (e) {
    const keyCode = e.keyCode || e.which || e.charCode;
    const ctrlKey = e.ctrlKey || e.metaKey;
    if (keyCode === 123) {
        e.preventDefault();
        return false;
    }
    if (ctrlKey && (keyCode === 83 || keyCode === 85 || keyCode === 73)) {
        e.preventDefault();
        return false;
    }
    if (ctrlKey && e.shiftKey && (keyCode === 67 || keyCode === 74)) {
        e.preventDefault();
        return false;
    }
});

setInterval(function () {
    if (document.visibilityState === 'visible') {
        const startTime = performance.now();
        (function () { }.constructor("debugger")());
        const endTime = performance.now();
        if (endTime - startTime > 500) {
            window.location.href = "about:blank";
        }
    }
}, 3000);
document.addEventListener('dragstart', (e) => {
    const forbiddenTags = ['IMG', 'AUDIO', 'VIDEO', 'SVG', 'A'];
    if (forbiddenTags.includes(e.target.tagName)) {
        e.preventDefault();
    }
});