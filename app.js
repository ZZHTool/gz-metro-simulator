const metroData = {
    "line1": {
        name: "1号线",
        color: "#edcf3b",
        textColor: "#000000",
    },
    "line2": {
        name: "2号线",
        color: "#00679e",
        textColor: "#ffffff",
    },
    "line3_tianhe": {
        name: "3号线 (天河客运站 ⇌ 海傍)",
        color: "#e89e47",
        textColor: "#ffffff",
    },
    "line3_airport": {
        name: "3号线 (机场北 ⇌ 海傍)",
        color: "#e89e47",
        textColor: "#ffffff",
    },
    "line4": {
        name: "4号线",
        color: "#00843D",
        textColor: "#ffffff",
    },
    "line5": {
        name: "5号线",
        color: "#c70541",
        textColor: "#ffffff",
    },
    "line6": {
        name: "6号线",
        color: "#7a2a6b",
        textColor: "#ffffff",
    },
    "line7": {
        name: "7号线",
        color: "#8EC31D",
        textColor: "#000000",
    },
    "line8": {
        name: "8号线",
        color: "#008c95",
        textColor: "#ffffff",
    },
    "line9": {
        name: "9号线",
        color: "#71cc98",
        textColor: "#000000",
    },
    "line10": {
        name: "10号线",
        color: "#7389B2",
        textColor: "#ffffff",
    },
    "line11": {
        name: "11号线",
        color: "#F0B200",
        textColor: "#000000",
    },
    "line13": {
        name: "13号线",
        color: "#827919",
        textColor: "#ffffff",
    },
    "line14": {
        name: "14号线",
        color: "#81312f",
        textColor: "#ffffff",
    },
    "line14_branch": {
        name: "14号线支线 (知识城线)",
        color: "#81312f",
        textColor: "#ffffff",
    },
    "line18": {
        name: "18号线",
        color: "#0055bc",
        textColor: "#ffffff",
    },
    "line21": {
        name: "21号线",
        color: "#00123f",
        textColor: "#ffffff",
    },
    "line22": {
        name: "22号线",
        color: "#c55a11",
        textColor: "#ffffff",
    }
};

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

// 欢迎页开门特效控制逻辑
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

// 运行天数计算
function updateRunningDays() {
    if (!daysElement) return;
    const urodz = new Date("07/15/2026");
    const now = new Date();
    const ile = now.getTime() - urodz.getTime();
    const dni = Math.floor(ile / (1000 * 60 * 60 * 24));
    daysElement.textContent = dni >= 0 ? dni : 0;
}

// 初始化首
document.addEventListener('DOMContentLoaded', () => {
    renderLineGrid();
    updateRunningDays();
});