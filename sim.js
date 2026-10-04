let currentLineKey = "";
let currentAudio = null;

const dirSelect = document.getElementById('dir-select');
const stationSelect = document.getElementById('station-select');
const simTitle = document.getElementById('sim-title');
const marqueeText = document.getElementById('marquee-text');
const routeMap = document.getElementById('route-map');
const daysElement = document.getElementById('stable-days');
const audioCache = new Map();
let cachedToken = null;
let tokenFetchPromise = null;
let tokenExpireTime = 0;
let currentPlayToken = 0;
let currentFetchController = null;
let isAudioUnlocked = false;
let isRouteArrowMoving = false;

function unlockAudioContext() {
    if (isAudioUnlocked) return;

    isAudioUnlocked = true;
    document.removeEventListener('click', unlockAudioContext);
    document.removeEventListener('touchstart', unlockAudioContext);

    const silentAudio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
    silentAudio.play().catch(() => {
    });
}

function refreshAudioToken() {
    if (cachedToken && Date.now() < tokenExpireTime) {
        return Promise.resolve(cachedToken);
    }
    if (tokenFetchPromise) {
        return tokenFetchPromise;
    }

    const fetchStart = Date.now();
    tokenFetchPromise = fetch('/.netlify/functions/get-audio-token')
        .then(res => res.ok ? res.json() : { token: '' })
        .then(data => {
            cachedToken = data.token;
            tokenExpireTime = Date.now() + 4000;
            tokenFetchPromise = null;
            scheduleTokenRefresh(Date.now() - fetchStart);
            return data.token;
        })
        .catch(() => {
            cachedToken = '';
            tokenFetchPromise = null;
            tokenExpireTime = Date.now() + 1500;
            scheduleTokenRefresh(0);
            return '';
        });

    return tokenFetchPromise;
}

let tokenRefreshTimer = null;
function scheduleTokenRefresh(lastFetchMs = 0) {
    if (tokenRefreshTimer) clearTimeout(tokenRefreshTimer);
    if (!tokenExpireTime) return;
    const margin = Math.min(Math.max(lastFetchMs * 1.5, 800), 2000);
    const delay = Math.max(300, tokenExpireTime - Date.now() - margin);
    tokenRefreshTimer = setTimeout(() => {
        cachedToken = null;
        refreshAudioToken();
    }, delay);
}

function getAudioToken(timeoutMs = 1200) {
    const tokenPromise = refreshAudioToken();
    const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(''), timeoutMs));
    return Promise.race([tokenPromise, timeoutPromise]);
}

refreshAudioToken();

function getAudioBlobUrlSync(url) {
    if (audioCache.has(url)) {
        return audioCache.get(url);
    }
    return null;
}

const AUDIO_FETCH_TIMEOUT_MS = 3500;

function withTimeoutSignal(externalSignal, timeoutMs) {
    const timeoutController = new AbortController();
    const timer = setTimeout(() => timeoutController.abort(), timeoutMs);

    if (externalSignal) {
        if (externalSignal.aborted) {
            clearTimeout(timer);
            timeoutController.abort();
        } else {
            externalSignal.addEventListener('abort', () => {
                clearTimeout(timer);
                timeoutController.abort();
            }, { once: true });
        }
    }

    return { signal: timeoutController.signal, cancelTimer: () => clearTimeout(timer) };
}

async function getAudioBlobUrl(url, signal = null) {
    const cached = getAudioBlobUrlSync(url);
    if (cached) return cached;

    for (let attempt = 0; attempt < 2; attempt++) {
        const token = await getAudioToken();
        if (!token) {
            if (attempt === 1) {
                console.warn(`预加载失败 [${url}]: 无法获取有效 token`);
                return url;
            }
            cachedToken = null;
            tokenExpireTime = 0;
            continue;
        }

        const requestUrl = `${url}?token=${encodeURIComponent(token)}`;
        const { signal: combinedSignal, cancelTimer } = withTimeoutSignal(signal, AUDIO_FETCH_TIMEOUT_MS);
        try {
            const response = await fetch(requestUrl, { signal: combinedSignal });
            cancelTimer();
            if (response.status === 403 && attempt === 0) {
                cachedToken = null;
                tokenExpireTime = 0;
                continue;
            }
            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            audioCache.set(url, blobUrl);
            return blobUrl;
        } catch (err) {
            cancelTimer();
            if (err.name === 'AbortError' && signal && signal.aborted) return url;
            if (attempt === 1) {
                console.warn(`预加载失败 [${url}]:`, err);
                return url;
            }
        }
    }
    return url;
}

async function prefetchCurrentNextAudio() {
    if (!stationSelect.value || !currentLineKey) return;
    const raw = JSON.parse(stationSelect.value);
    const next_zh = raw.next_zh || raw.next;
    const line = metroData[currentLineKey];
    const tasks = [];
    tasks.push(getAudioBlobUrl('关门.mp3'));

    if (currentLineKey.startsWith('line11')) {
        const direction = dirSelect.value;
        const prefix = direction === 'outer' ? 'outer' : 'inner';
        tasks.push(getAudioBlobUrl(`${prefix}/${prefix === 'outer' ? '外环' : '内环'}.mp3`));
        tasks.push(getAudioBlobUrl(`${prefix}/${next_zh}.mp3`));
    } else if (currentLineKey === 'line5' || currentLineKey === 'line18') {
        const direction = dirSelect.value;
        const terminal = direction === "forward"
            ? line.stations[line.stations.length - 1]
            : line.stations[0];
        if (next_zh === terminal) {
            tasks.push(getAudioBlobUrl(`${terminal}/${next_zh}.mp3`));
        } else {
            tasks.push(getAudioBlobUrl(`${terminal}.mp3`));
            tasks.push(getAudioBlobUrl(`${terminal}/${next_zh}.mp3`));
        }
    } else {
        const direction = dirSelect.value;
        const terminal = direction === "forward"
            ? line.stations[line.stations.length - 1]
            : line.stations[0];
        tasks.push(getAudioBlobUrl(`${terminal}/${next_zh}.mp3`));
    }
    await Promise.all(tasks);
}

let nextStationBtnEl = null;
function setNextStationButtonLoading(loading) {
    if (!nextStationBtnEl) {
        nextStationBtnEl = document.getElementById('btn-next-station');
    }
    if (!nextStationBtnEl) return;
    if (loading) {
        if (!nextStationBtnEl.dataset.originalText) {
            nextStationBtnEl.dataset.originalText = nextStationBtnEl.textContent;
        }
        nextStationBtnEl.classList.add('btn-loading');
        nextStationBtnEl.textContent = '⏳ 加载中…';
    } else {
        nextStationBtnEl.classList.remove('btn-loading');
        if (nextStationBtnEl.dataset.originalText) {
            nextStationBtnEl.textContent = nextStationBtnEl.dataset.originalText;
        }
    }
}

async function playAudio(srcs, onEndedCallback) {
    setRouteArrowMoving(typeof onEndedCallback === 'function');
    currentPlayToken++;
    const thisToken = currentPlayToken;

    if (currentAudio) {
        currentAudio.onended = null;
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }

    if (currentFetchController) {
        currentFetchController.abort();
    }
    currentFetchController = new AbortController();
    const currentSignal = currentFetchController.signal;

    const audioQueue = Array.isArray(srcs) ? srcs : [srcs];
    let currentIndex = 0;

    async function playCurrent() {
        if (thisToken !== currentPlayToken) return;

        if (currentIndex >= audioQueue.length) {
            if (typeof onEndedCallback === 'function') {
                setRouteArrowMoving(false);
                onEndedCallback();
            }
            return;
        }

        const rawUrl = audioQueue[currentIndex];
        let playSrc = getAudioBlobUrlSync(rawUrl);

        if (!playSrc) {
            const showLoading = currentIndex === 0;
            if (showLoading) setNextStationButtonLoading(true);
            playSrc = await getAudioBlobUrl(rawUrl, currentSignal);
            if (showLoading) setNextStationButtonLoading(false);
        }

        if (thisToken !== currentPlayToken) return;

        currentAudio = new Audio(playSrc);
        currentAudio.preload = "auto";
        currentAudio.onended = () => {
            if (thisToken !== currentPlayToken) return;
            currentIndex++;
            playCurrent();
        };

        const playPromise = currentAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
                    console.warn("播放失败，跳过该段:", err);
                }
                if (thisToken === currentPlayToken) {
                    currentIndex++;
                    playCurrent();
                }
            });
        }

        if (currentIndex + 1 < audioQueue.length) {
            getAudioBlobUrl(audioQueue[currentIndex + 1], currentSignal);
        }
    }

    playCurrent();
}

function stopAudioPlayback() {
    currentPlayToken++;

    if (currentFetchController) {
        currentFetchController.abort();
        currentFetchController = null;
    }

    if (currentAudio) {
        currentAudio.onended = null;
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }

    setRouteArrowMoving(false);
}

function detectLineFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/\/([^\/]+)\/[^\/]*$/);
    if (match && match[1]) {
        const folderName = match[1];
        if (metroData[folderName]) {
            return folderName;
        }
    }
    return 'line1';
}

function initBackButton() {
    const btnBack = document.getElementById('btn-back');
    if (!btnBack) return;

    btnBack.addEventListener('click', () => {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        if (
            hostname.includes('netlify.app') ||
            (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1' && protocol !== 'file:')
        ) {
            window.location.href = 'https://gzmetro.netlify.app';
        }
        else {
            window.location.href = '../index.html';
        }
    });
}


function initSimulator(lineKey) {
    currentLineKey = lineKey;
    const line = metroData[lineKey];
    simTitle.innerText = line.name;
    document.title = `${line.name} - 广州地铁报站模拟器`;
    const logo = document.querySelector('.metro-logo');
    if (logo) {
        if (lineKey === 'line5' || lineKey === 'line6' || lineKey === 'line14' || lineKey === 'line14_branch' || lineKey === 'line22') {
            logo.style.filter = 'brightness(0) invert(1)';
        } else {
            logo.style.filter = 'none';
        }
    }
    const header = document.querySelector('header');
    if (header) {
        header.style.backgroundColor = line.color;
        header.style.color = line.textColor;
    }

    const actionButtons = document.querySelectorAll('.button-group button');
    actionButtons.forEach(btn => {
        btn.style.backgroundColor = line.color;
        btn.style.color = line.textColor;
    });

    const displayScreen = document.querySelector('.display-screen');
    if (displayScreen) {
        displayScreen.style.borderColor = line.color;
    }

    dirSelect.innerHTML = '';
    if (line.isCircle) {
        let opt1 = document.createElement('option');
        opt1.value = "inner";
        opt1.innerText = "内环 (顺时针环行)";
        let opt2 = document.createElement('option');
        opt2.value = "outer";
        opt2.innerText = "外环 (逆时针环行)";
        dirSelect.appendChild(opt1);
        dirSelect.appendChild(opt2);
    } else {
        let opt1 = document.createElement('option');
        opt1.value = "forward";
        opt1.innerText = `开往：${line.stations[line.stations.length - 1]}`;
        let opt2 = document.createElement('option');
        opt2.value = "backward";
        opt2.innerText = `开往：${line.stations[0]}`;
        dirSelect.appendChild(opt1);
        dirSelect.appendChild(opt2);
    }
    updateStations();
    renderRouteMap();
    updateLED("欢迎乘坐广州地铁！ Welcome to Guangzhou Metro! ");
    prefetchCurrentNextAudio();
}

function updateStations() {
    if (!currentLineKey) return;
    const direction = dirSelect.value;
    const line = metroData[currentLineKey];

    let stationList = [];
    stationSelect.innerHTML = '';

    if (line.isCircle) {
        let zhList, enList;
        if (direction === "inner") {
            zhList = [...line.stations_inner];
            enList = [...line.stations_inner_en];
        } else {
            zhList = [...line.stations_outer];
            enList = [...line.stations_outer_en];
        }
        for (let i = 0; i < zhList.length - 1; i++) {
            let opt = document.createElement('option');
            opt.value = JSON.stringify({
                current_zh: zhList[i],
                current_en: enList ? enList[i] : zhList[i],
                next_zh: zhList[i + 1],
                next_en: enList ? enList[i + 1] : zhList[i + 1]
            });
            opt.innerText = `${zhList[i]} -> ${zhList[i + 1]}`;
            stationSelect.appendChild(opt);
        }
        return;
    } else {
        stationList = [...line.stations];
        let stationEnList = line.stations_en ? [...line.stations_en] : [];
        if (direction === "backward") {
            stationList.reverse();
            if (stationEnList.length > 0) {
                stationEnList.reverse();
            }
        }
        for (let i = 0; i < stationList.length - 1; i++) {
            let opt = document.createElement('option');
            let data = {
                current_zh: stationList[i],
                current: stationList[i],
                next_zh: stationList[i + 1],
                next: stationList[i + 1]
            };
            if (stationEnList.length > 0) {
                if (stationEnList[i]) data.current_en = stationEnList[i];
                if (stationEnList[i + 1]) data.next_en = stationEnList[i + 1];
            }
            opt.value = JSON.stringify(data);
            opt.innerText = `${stationList[i]} -> ${stationList[i + 1]}`;
            stationSelect.appendChild(opt);
        }
    }
    renderRouteMap();
    prefetchCurrentNextAudio();
}

function renderRouteMap() {
    if (!routeMap || !currentLineKey) return;
    const direction = dirSelect.value;
    const line = metroData[currentLineKey];

    routeMap.style.setProperty('--line-color', line.color);

    let stationList = [];
    if (line.isCircle) {
        stationList = direction === "inner" ? [...line.stations_inner] : [...line.stations_outer];
    } else {
        stationList = [...line.stations];
        if (direction === "backward") {
            stationList.reverse();
        }
    }

    routeMap.innerHTML = `
        <div class="route-map-inner" id="route-map-inner">
            <div class="route-track"></div>
            <div class="route-track-active" id="route-track-active"></div>
            <div class="route-track-arrow" id="route-track-arrow"></div>
        </div>
    `;

    const innerContainer = document.getElementById('route-map-inner');
    stationList.forEach((stationName, index) => {
        const node = document.createElement('div');
        node.className = 'station-node';
        node.dataset.index = index;

        const transferInfo = line.transfers[stationName];
        let transferHTML = '';
        if (transferInfo) {
            transferHTML = `<span class="transfer-tag">${transferInfo}</span>`;
        }

        node.innerHTML = `
            ${transferHTML}
            <div class="station-dot"></div>
            <div class="station-label">${stationName}</div>
        `;

        node.addEventListener('click', () => {
            const targetIndex = Math.max(0, index - 1);
            stationSelect.selectedIndex = targetIndex;
            stationSelect.dispatchEvent(new Event('change'));
        });

        innerContainer.appendChild(node);
    });
    updateActiveMapNodes(stationSelect.selectedIndex || 0);
}

function updateActiveMapNodes(activeIndex, shouldScroll = true) {
    const nodes = document.querySelectorAll('.station-node');
    const trackActive = document.getElementById('route-track-active');
    const arrow = document.getElementById('route-track-arrow');
    if (!nodes.length) return;

    nodes.forEach((node, idx) => {
        node.classList.remove('active', 'next-active');
        if (idx === activeIndex) {
            node.classList.add('active');
        } else if (idx === activeIndex + 1) {
            node.classList.add('next-active');
        }
    });

    const firstNode = nodes[0];
    const activeNode = nodes[activeIndex];
    let activeCenter = 0;

    if (trackActive && firstNode && activeNode) {
        const firstCenter = firstNode.offsetLeft + firstNode.offsetWidth / 2;
        activeCenter = activeNode.offsetLeft + activeNode.offsetWidth / 2;
        trackActive.style.width = `${activeCenter - firstCenter}px`;
    } else if (trackActive) {
        trackActive.style.width = '0px';
    }

    const nextNode = nodes[activeIndex + 1];
    if (activeNode && nextNode && arrow) {
        const nextCenter = nextNode.offsetLeft + nextNode.offsetWidth / 2;
        const isMoving = isRouteArrowMoving;
        const arrowCenter = isMoving ? activeCenter : (activeCenter + nextCenter) / 2;
        arrow.style.left = `${arrowCenter}px`;
        arrow.style.setProperty('--arrow-distance', `${nextCenter - activeCenter}px`);
        arrow.style.display = 'block';
        arrow.classList.toggle('moving', isMoving);
    } else if (arrow) {
        arrow.style.display = 'none';
        arrow.classList.remove('moving');
    }

    if (shouldScroll && activeNode && routeMap) {
        const mapWidth = routeMap.clientWidth;
        const targetScrollLeft = activeCenter - (mapWidth / 2.5);

        if (window.routeScrollTimer) {
            clearTimeout(window.routeScrollTimer);
        }

        window.routeScrollTimer = setTimeout(() => {
            smoothScrollTo(routeMap, targetScrollLeft, 800);
        }, 250);
    }
}

function setRouteArrowMoving(moving) {
    isRouteArrowMoving = moving;
    updateActiveMapNodes(stationSelect.selectedIndex, false);
}

function smoothScrollTo(element, target, duration = 600) {
    const start = element.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    function animateScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const ease = progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;

        element.scrollLeft = start + change * ease;

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }
    requestAnimationFrame(animateScroll);
}

// 监听下拉菜单改变事件
stationSelect.addEventListener('change', () => {
    stopAudioPlayback();
    updateActiveMapNodes(stationSelect.selectedIndex);
    if (stationSelect.value) {
        const station = JSON.parse(stationSelect.value);
        const stationZh = station.current_zh || station.current;
        showThisStationLED(stationZh, station.current_en || stationZh);
    }
    prefetchCurrentNextAudio();
});

function updateLED(textContent) {
    if (!marqueeText) return;
    marqueeText.style.animation = 'none';
    marqueeText.innerHTML = `<span class="led-red">${textContent}</span>`;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const containerWidth = marqueeText.parentElement ? marqueeText.parentElement.clientWidth : 600;
            const textWidth = marqueeText.scrollWidth || marqueeText.offsetWidth;
            let totalDistance = containerWidth + textWidth;

            if (totalDistance === 0) {
                const containerWidth = 600;
                let textWidth = 0;
                for (let i = 0; i < textContent.length; i++) {
                    textWidth += (textContent.charCodeAt(i) > 255) ? 38 : 19;
                }
                totalDistance = containerWidth + textWidth;
            }

            const speedPixelsPerSecond = 200;
            const duration = totalDistance / speedPixelsPerSecond;

            marqueeText.style.animationName = 'ledScroll';
            marqueeText.style.animationDuration = `${duration}s`;
            marqueeText.style.animationTimingFunction = 'linear';
            marqueeText.style.animationIterationCount = 'infinite';
        });
    });
}

// 方向切换
dirSelect.addEventListener('change', () => {
    updateStations();
    renderRouteMap();
    prefetchCurrentNextAudio();
});

document.getElementById('btn-door-close').addEventListener('click', () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    playAudio([`关门.mp3`]);
    updateLED("车门即将关闭，请注意安全，谨防被夹！ The doors are closing, take care your safety, and beware of being clamped! ");
});

function showThisStationLED(stationZh, stationEn) {
    if (!stationZh || !currentLineKey) return;
    const line = metroData[currentLineKey];
    const transfer = line && line.transfers ? line.transfers[stationZh] : null;

    let transferZh = transfer ? `，可换乘${transfer}` : "";
    let transferEn = "";

    if (transfer) {
        const lines = transfer.match(/\d+/g) || [];

        if (lines.length === 0) {
            transferEn = `, the interchange with ${transfer}`;
        } else if (lines.length === 1) {
            transferEn = `, the interchange with Line ${lines[0]}`;
        } else {
            transferEn = ", the interchange with " + lines.map(line => `Line ${line}`).join(" and ");
        }
    }

    const enName = stationEn || stationZh;
    const fullText = `本站：${stationZh}${transferZh}， This station is ${enName}${transferEn} `;
    updateLED(fullText);
}

document.getElementById('btn-next-station').addEventListener('click', () => {
    if (!stationSelect.value || !currentLineKey) return;
    const raw = JSON.parse(stationSelect.value);
    const next_zh = raw.next_zh || raw.next;
    const next_en = raw.next_en || next_zh;
    const line = metroData[currentLineKey];
    const transfer = line.transfers[next_zh];

    let transferZh = transfer ? `，可换乘${transfer}` : "";
    let transferEn = "";

    if (transfer) {
        const lines = transfer.match(/\d+/g) || [];

        if (lines.length === 0) {
            transferEn = `, the interchange with ${transfer}`;
        } else if (lines.length === 1) {
            transferEn = `, the interchange with Line ${lines[0]}`;
        } else {
            transferEn = ", the interchange with " + lines.map(line => `Line ${line}`).join(" and ");
        }
    }

    const fullText = `下一站：${next_zh}${transferZh}， The Next station is ${next_en}${transferEn} `;
    updateLED(fullText);

    const onAudioEnded = () => {
        if (stationSelect.selectedIndex < stationSelect.options.length - 1) {
            stationSelect.selectedIndex += 1;
            stationSelect.dispatchEvent(new Event('change'));

            const newRaw = JSON.parse(stationSelect.value);
            const this_zh = newRaw.current_zh || newRaw.current;
            const this_en = newRaw.current_en || this_zh;
            showThisStationLED(this_zh, this_en);
        } else {
            showThisStationLED(next_zh, next_en);
        }
    };

    if (currentLineKey.startsWith('line11')) {
        const direction = dirSelect.value;
        if (direction === 'outer') {
            playAudio([`outer/外环.mp3`, `outer/${next_zh}.mp3`], onAudioEnded);
        } else {
            playAudio([`inner/内环.mp3`, `inner/${next_zh}.mp3`], onAudioEnded);
        }
    } else if (currentLineKey === 'line5' || currentLineKey === 'line18') {
        const direction = dirSelect.value;
        const terminal = direction === "forward"
            ? line.stations[line.stations.length - 1]
            : line.stations[0];
        if (next_zh === terminal) {
            playAudio([`${terminal}/${next_zh}.mp3`], onAudioEnded);
        } else {
            playAudio([`${terminal}.mp3`, `${terminal}/${next_zh}.mp3`], onAudioEnded);
        }
    } else {
        const direction = dirSelect.value;
        const terminal = direction === "forward"
            ? line.stations[line.stations.length - 1]
            : line.stations[0];
        playAudio([`${terminal}/${next_zh}.mp3`], onAudioEnded);
    }
    prefetchCurrentNextAudio();
});

function updateRunningDays() {
    if (!daysElement) return;
    const urodz = new Date(2026, 6, 17);
    const now = new Date();
    const ile = now.getTime() - urodz.getTime();
    const dni = Math.floor(ile / (1000 * 60 * 60 * 24));
    daysElement.textContent = dni >= 0 ? dni : 0;
}

document.addEventListener('DOMContentLoaded', () => {
    const autoLineKey = detectLineFromUrl();
    initSimulator(autoLineKey);
    initBackButton();
    autoScaleContainer();
    document.addEventListener('click', unlockAudioContext, { once: true });
    document.addEventListener('touchstart', unlockAudioContext, { once: true });
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

document.addEventListener('dragstart', (e) => {
    const forbiddenTags = ['IMG', 'AUDIO', 'VIDEO', 'SVG', 'A'];
    if (forbiddenTags.includes(e.target.tagName)) {
        e.preventDefault();
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


function autoScaleContainer() {
    const container = document.querySelector('.container');
    if (!container) return;
    let wrapper = container.parentElement;
    if (!wrapper || !wrapper.classList.contains('scale-wrapper')) {
        wrapper = document.createElement('div');
        wrapper.className = 'scale-wrapper';
        wrapper.style.margin = '0 auto';
        wrapper.style.overflow = 'visible';
        container.parentNode.insertBefore(wrapper, container);
        wrapper.appendChild(container);
    }

    const currentWidth = document.documentElement.clientWidth || window.innerWidth;
    const designWidth = 800;
    const isRealMobile = currentWidth < 480 ||
        (/Android|iPhone|iPod|Mobile/i.test(navigator.userAgent) && currentWidth < 600);

    if (isRealMobile) {
        container.style.cssText = '';
        container.style.width = '100%';
        container.style.maxWidth = '100%';
        container.style.transform = 'none';
        wrapper.style.width = '100%';
        wrapper.style.height = 'auto';
        wrapper.style.borderRadius = '0';
        wrapper.style.overflow = 'visible';
        return;
    }

    let paddingTotal = 24;
    if (currentWidth > designWidth) {
        paddingTotal = Math.max(4, 24 - Math.floor((currentWidth - designWidth) * 0.08));
    }

    const availableWidth = Math.max(currentWidth - paddingTotal, 320);
    let scale = availableWidth / designWidth;
    scale = Math.min(scale, 1.15);
    scale = Math.max(scale, 0.5);

    const visualWidth = Math.min(designWidth * scale, currentWidth);

    wrapper.style.width = visualWidth + 'px';
    wrapper.style.maxWidth = '100%';
    wrapper.style.overflow = 'visible';

    container.style.width = designWidth + 'px';
    container.style.maxWidth = designWidth + 'px';
    container.style.margin = '0';
    container.style.transformOrigin = 'left top';
    container.style.transform = `scale(${scale})`;
    container.style.height = 'auto';

    const realHeight = container.offsetHeight;
    const visualHeight = (realHeight + 10) * scale;
    wrapper.style.height = visualHeight + 'px';
}
window.addEventListener('resize', autoScaleContainer);