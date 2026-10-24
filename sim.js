let currentLineKey = "";
let currentAudio = null;

const dirSelect = document.getElementById('dir-select');
const stationSelect = document.getElementById('station-select');
const simTitle = document.getElementById('sim-title');
const marqueeText = document.getElementById('marquee-text');
const routeMap = document.getElementById('route-map');
const daysElement = document.getElementById('stable-days');
const audioCache = new Map();
const audioRequests = new Map();
const AUDIO_CACHE_MAX_ENTRIES = 16;
const AUDIO_CACHE_MAX_BYTES = 24 * 1024 * 1024;
let audioCacheBytes = 0;
let prefetchController = null;

let currentPlayToken = 0;
let currentFetchController = null;
let isRouteArrowMoving = false;
let routeMapResizeTimer = null;
const ROUTE_SEGMENT_EXPANSION = 24;

function getAudioBlobUrlSync(url) {
    const entry = audioCache.get(url);
    if (!entry) return null;
    audioCache.delete(url);
    audioCache.set(url, entry);
    return entry.blobUrl;
}

const AUDIO_FETCH_TIMEOUT_MS = 3500;

function cacheAudioBlobUrl(url, blob) {
    const existing = audioCache.get(url);
    if (existing) return existing.blobUrl;
    if (blob.size > AUDIO_CACHE_MAX_BYTES) return null;

    const blobUrl = URL.createObjectURL(blob);
    audioCache.set(url, { blobUrl, size: blob.size });
    audioCacheBytes += blob.size;

    while (audioCache.size > AUDIO_CACHE_MAX_ENTRIES || audioCacheBytes > AUDIO_CACHE_MAX_BYTES) {
        let oldestUrl = null;
        for (const [cachedUrl, entry] of audioCache) {
            if (!currentAudio || currentAudio.src !== entry.blobUrl) {
                oldestUrl = cachedUrl;
                break;
            }
        }
        if (oldestUrl === null) break;

        const entry = audioCache.get(oldestUrl);
        audioCache.delete(oldestUrl);
        audioCacheBytes -= entry.size;
        URL.revokeObjectURL(entry.blobUrl);
    }

    return blobUrl;
}

function getAudioBlobUrl(url, signal = null) {
    const cached = getAudioBlobUrlSync(url);
    if (cached) return Promise.resolve(cached);
    if (signal && signal.aborted) return Promise.resolve(null);

    let request = audioRequests.get(url);
    if (!request || request.done || request.controller.signal.aborted) {
        const controller = new AbortController();
        request = { controller, consumers: 0, done: false, promise: null };
        const timer = setTimeout(() => controller.abort(), AUDIO_FETCH_TIMEOUT_MS);
        audioRequests.set(url, request);
        request.promise = Promise.resolve()
            .then(() => fetch(url, { signal: controller.signal }))
            .then(response => {
                if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
                return response.blob();
            })
            .then(blob => controller.signal.aborted ? null : cacheAudioBlobUrl(url, blob))
            .catch(err => {
                if (err.name !== 'AbortError') {
                    console.warn(`预加载失败 [${url}]:`, err);
                }
                return null;
            })
            .finally(() => {
                clearTimeout(timer);
                request.done = true;
                if (audioRequests.get(url) === request) {
                    audioRequests.delete(url);
                }
            });
    }

    request.consumers++;
    return new Promise(resolve => {
        let released = false;
        const release = () => {
            if (released) return;
            released = true;
            if (signal) signal.removeEventListener('abort', onAbort);
            request.consumers--;
            if (request.consumers === 0 && !request.done) {
                request.controller.abort();
            }
        };
        const onAbort = () => {
            release();
            resolve(null);
        };

        if (signal) {
            if (signal.aborted) {
                onAbort();
                return;
            }
            signal.addEventListener('abort', onAbort, { once: true });
        }

        request.promise.then(blobUrl => {
            if (released) return;
            release();
            resolve(blobUrl);
        });
    });
}


function prefetchCurrentNextAudio() {
    if (prefetchController) {
        prefetchController.abort();
    }

    prefetchController = new AbortController();

    if (!stationSelect.value || !currentLineKey) return;

    const signal = prefetchController.signal;
    const raw = JSON.parse(stationSelect.value);
    const next_zh = raw.next_zh || raw.next;

    if (!next_zh) return;

    const line = metroData[currentLineKey];
    const direction = dirSelect.value;

    if (currentLineKey.startsWith('line11')) {
        const prefix = direction === 'outer' ? 'outer' : 'inner';

        getAudioBlobUrl(
            `${prefix}/${prefix === 'outer' ? '外环' : '内环'}.mp3`,
            signal
        );

        getAudioBlobUrl(`${prefix}/${next_zh}.mp3`, signal);
        return;
    }

    const terminal = direction === 'forward'
        ? line.stations[line.stations.length - 1]
        : line.stations[0];

    if (currentLineKey === 'line1' || currentLineKey === 'line2') {
        getAudioBlobUrl(`${terminal}/${next_zh}.mp3`, signal);
        return;
    }

    if (next_zh !== terminal) {
        getAudioBlobUrl(`${terminal}.mp3`, signal);
    }

    getAudioBlobUrl(`${terminal}/${next_zh}.mp3`, signal);
}


function playAudio(srcs, onEndedCallback, retryButton = null) {
    if (retryButton && retryButton.dataset.audioOriginalText) {
        retryButton.textContent = retryButton.dataset.audioOriginalText;
    }
    setRouteArrowMoving(typeof onEndedCallback === 'function');
    currentPlayToken++;
    const thisToken = currentPlayToken;

    if (currentAudio) {
        currentAudio.onended = null;
        currentAudio.onerror = null;
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
            if (currentFetchController && thisToken === currentPlayToken) {
                currentFetchController.abort();
                currentFetchController = null;
            }
            setRouteArrowMoving(false);
            if (typeof onEndedCallback === 'function') {
                onEndedCallback();
            }
            return;
        }

        const rawUrl = audioQueue[currentIndex];
        const playSrc = getAudioBlobUrlSync(rawUrl) || rawUrl;

        const audio = new Audio(playSrc);
        currentAudio = audio;
        audio.preload = "auto";
        let trackHandled = false;

        const advanceTrack = () => {
            if (trackHandled || thisToken !== currentPlayToken) return;
            trackHandled = true;
            audio.onended = null;
            audio.onerror = null;
            if (currentAudio === audio) currentAudio = null;
            currentIndex++;
            playCurrent();
        };

        audio.onended = advanceTrack;
        audio.onerror = () => {
            if (trackHandled || thisToken !== currentPlayToken) return;
            console.warn(`音频加载失败 [${rawUrl}]，跳过该段。`, audio.error);
            advanceTrack();
        };

        const handlePlayError = err => {
            if (trackHandled || thisToken !== currentPlayToken || err.name === 'AbortError') return;

            if (err.name === 'NotAllowedError') {
                setRouteArrowMoving(false);
                const button = retryButton || document.getElementById('btn-next-station');
                if (button) {
                    button.dataset.audioOriginalText ||= button.textContent;
                    button.textContent = '⚠️ 点击重试音频';
                }
                console.warn('浏览器拒绝了音频播放；请再次点击播放按钮。', err);
                return;
            }

            console.warn(`播放失败 [${rawUrl}]，跳过该段:`, err);
            advanceTrack();
        };

        try {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(handlePlayError);
            }
        } catch (err) {
            handlePlayError(err);
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
        currentAudio.onerror = null;
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
        window.location.href = '../index.html';
    });
}

function initSimulator(lineKey) {
    currentLineKey = lineKey;
    if (!['line1', 'line2', 'line5', 'line7', 'line11', 'line13', 'line18'].includes(lineKey)) {
        alert('当前线路音频正在录入中，敬请期待！');
    }
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
        const terminalIndex = stationList.length - 1;
        const terminalOption = document.createElement('option');
        const terminalData = {
            current_zh: stationList[terminalIndex],
            current: stationList[terminalIndex],
            terminal: true
        };
        if (stationEnList[terminalIndex]) {
            terminalData.current_en = stationEnList[terminalIndex];
        }
        terminalOption.value = JSON.stringify(terminalData);
        terminalOption.innerText = `${stationList[terminalIndex]} (终点站)`;
        stationSelect.appendChild(terminalOption);
    }
    renderRouteMap();
}

function getTransferLineData(lineName) {
    const match = lineName.match(/^(\d+)号线/);
    if (!match) return null;
    const prefix = `${match[1]}号线`;
    return Object.values(metroData).find(line => line.name.replace(/\s/g, '').startsWith(prefix)) || null;
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
        node.classList.toggle('station-node--upper', index % 2 === 0);

        const transferRoutes = (line.transfers[stationName] || '')
            .split(/[、,，]/)
            .map(name => name.trim())
            .filter(Boolean)
            .map(name => ({ name, line: getTransferLineData(name) }));
        const transferGradient = transferRoutes.map(({ line: transferLine }, transferIndex) => {
            const start = transferIndex * 100 / transferRoutes.length;
            const end = (transferIndex + 1) * 100 / transferRoutes.length;
            return `${transferLine ? transferLine.color : '#cbd5e1'} ${start}% ${end}%`;
        }).join(', ');
        const transferHTML = transferRoutes.length
            ? `<span class="transfer-tag" style="--transfer-gradient: linear-gradient(to bottom, ${transferGradient})">${transferRoutes.map(({ name, line: transferLine }) => {
                const style = transferLine
                    ? ` style="--transfer-color: ${transferLine.color}; --transfer-text-color: ${transferLine.textColor};"`
                    : '';
                return `<span class="transfer-line-tag"${style}>${name}</span>`;
            }).join('')}</span>`
            : '';

        node.innerHTML = `
            ${transferHTML}
            <div class="station-dot"></div>
            <div class="station-label">${stationName}</div>
        `;

        node.addEventListener('click', () => {
            const targetIndex = index % stationSelect.options.length;
            stationSelect.selectedIndex = targetIndex;
            stationSelect.dispatchEvent(new Event('change'));
        });

        innerContainer.appendChild(node);
    });

    const nodeLayouts = [...innerContainer.querySelectorAll('.station-node')].map(node => {
        const stationLabel = node.querySelector('.station-label');
        let leftExtent = stationLabel.offsetWidth / 2;
        let rightExtent = leftExtent;
        const transferTag = node.querySelector('.transfer-tag');

        if (transferTag) {
            const transferLabels = [...transferTag.children];
            const labelWidths = transferLabels.map(label => label.offsetWidth);
            const totalLabelWidth = labelWidths.reduce((total, width) => total + width, 0);
            const gap = transferLabels.length > 1
                ? (transferTag.offsetWidth - totalLabelWidth) / (transferLabels.length - 1)
                : 0;
            const centerIndex = transferLabels.length % 2
                ? Math.floor(transferLabels.length / 2)
                : null;
            const transferAnchor = centerIndex === null
                ? transferTag.offsetWidth / 2
                : labelWidths.slice(0, centerIndex).reduce((total, width) => total + width, 0)
                    + gap * centerIndex + labelWidths[centerIndex] / 2;

            transferTag.style.left = `${node.offsetWidth / 2 - transferAnchor}px`;
            transferTag.style.transform = 'none';
            transferTag.style.setProperty('--transfer-anchor', `${transferAnchor}px`);
            leftExtent = Math.max(leftExtent, transferAnchor);
            rightExtent = Math.max(rightExtent, transferTag.offsetWidth - transferAnchor);
        }

        return { node, leftExtent, rightExtent };
    });

    nodeLayouts.forEach((layout, index) => {
        const nextLayout = nodeLayouts[index + 1];
        if (!nextLayout) return;
        const baseGap = (layout.node.offsetWidth + nextLayout.node.offsetWidth) / 2;
        const requiredGap = layout.rightExtent + nextLayout.leftExtent + 8;
        const baseMargin = Math.max(0, requiredGap - baseGap);
        layout.node.dataset.baseMarginRight = baseMargin;
        layout.node.style.marginRight = `${baseMargin}px`;
    });

    const firstLayout = nodeLayouts[0];
    if (firstLayout) {
        const firstCenter = firstLayout.node.offsetLeft + firstLayout.node.offsetWidth / 2;
        const startSpace = Math.max(0, firstLayout.leftExtent + 4 - firstCenter);
        innerContainer.style.setProperty('--route-start-space', `${startSpace}px`);
    }

    const lastLayout = nodeLayouts[nodeLayouts.length - 1];
    if (lastLayout) {
        const lastCenter = lastLayout.node.offsetLeft + lastLayout.node.offsetWidth / 2;
        const endSpace = Math.max(0, lastLayout.rightExtent + 4 - (innerContainer.clientWidth - lastCenter));
        innerContainer.style.setProperty('--route-end-space', `${endSpace}px`);
    }

    updateActiveMapNodes(stationSelect.selectedIndex || 0);

    const routeMapWrapper = routeMap.parentElement;
    if (routeMapWrapper && !routeMapWrapper.querySelector('.route-map-locate')) {
        const locateButton = document.createElement('button');
        locateButton.type = 'button';
        locateButton.className = 'route-map-locate';
        locateButton.setAttribute('aria-label', '定位到当前区间');
        locateButton.title = '定位到当前区间';
        locateButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="2"></circle><path d="M12 2v3m0 14v3M2 12h3m14 0h3"></path></svg>';
        locateButton.addEventListener('click', scrollToActiveRouteSegment);
        routeMapWrapper.appendChild(locateButton);
    }
}

function scrollToActiveRouteSegment() {
    if (!routeMap) return;

    const nodes = routeMap.querySelectorAll('.station-node');
    const activeIndex = stationSelect.selectedIndex;
    const activeNode = nodes[activeIndex];
    if (!activeNode) return;

    if (window.routeScrollTimer) {
        clearTimeout(window.routeScrollTimer);
        window.routeScrollTimer = null;
    }

    const nextNode = nodes[activeIndex + 1];
    const activeCenter = activeNode.offsetLeft + activeNode.offsetWidth / 2;
    const targetCenter = nextNode
        ? (activeCenter + nextNode.offsetLeft + nextNode.offsetWidth / 2) / 2
        : activeCenter;
    const maxScrollLeft = routeMap.scrollWidth - routeMap.clientWidth;
    const targetScrollLeft = Math.max(0, Math.min(maxScrollLeft, targetCenter - routeMap.clientWidth / 2));
    smoothScrollTo(routeMap, targetScrollLeft, 600);
}

function updateActiveMapNodes(activeIndex, shouldScroll = true) {
    const nodes = document.querySelectorAll('.station-node');
    const trackActive = document.getElementById('route-track-active');
    const arrow = document.getElementById('route-track-arrow');
    if (!nodes.length) return;

    nodes.forEach((node, idx) => {
        node.classList.remove('active', 'next-active', 'segment-expanded');
        if (idx === activeIndex) {
            node.classList.add('active');
        } else if (idx === activeIndex + 1) {
            node.classList.add('next-active');
        }

        const baseMargin = Number(node.dataset.baseMarginRight || 0);
        const segmentExpansion = isRouteArrowMoving && idx === activeIndex && idx < nodes.length - 1
            ? ROUTE_SEGMENT_EXPANSION
            : 0;
        node.style.marginRight = `${baseMargin + segmentExpansion}px`;
    });

    if (isRouteArrowMoving && nodes[activeIndex + 1]) {
        nodes[activeIndex].classList.add('segment-expanded');
    }

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
        const arrowInset = 23;
        const arrowDistance = Math.max(0, nextCenter - activeCenter - arrowInset * 2);
        const arrowStart = activeCenter + arrowInset;
        const arrowCenter = isMoving ? arrowStart : arrowStart + arrowDistance / 2;
        arrow.style.left = `${arrowCenter}px`;
        arrow.style.setProperty('--arrow-distance', `${arrowDistance}px`);
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
    stopAudioPlayback();
    updateStations();
    renderRouteMap();
    if (stationSelect.value) {
        const station = JSON.parse(stationSelect.value);
        const stationZh = station.current_zh || station.current;
        showThisStationLED(stationZh, station.current_en || stationZh);
    }
    prefetchCurrentNextAudio();
});

document.getElementById('btn-door-close').addEventListener('click', (event) => {
    playAudio([`关门.mp3`], null, event.currentTarget);
    updateLED("车门即将关闭，请注意安全，谨防被夹！ The doors are closing, take care your safety, and beware of being clamped! ");
});

function getTransferEnglish(transfer) {
    const transfers = transfer.split(/[、,，]/).map(item => {
        const foshanLine = item.match(/佛山\s*(\d+)号线/);
        if (foshanLine) return `Foshan Line ${foshanLine[1]}`;
        if (item.includes("广佛线")) return "Guangfo Line";

        const line = item.match(/(\d+)号线/);
        return line ? `Line ${line[1]}` : item;
    });
    return `, the interchange with ${transfers.join(" and ")}`;
}

function showThisStationLED(stationZh, stationEn) {
    if (!stationZh || !currentLineKey) return;
    setRouteArrowMoving(false);
    const line = metroData[currentLineKey];
    const transfer = line && line.transfers ? line.transfers[stationZh] : null;

    let transferZh = transfer ? `，可换乘${transfer}` : "";
    const transferEn = transfer ? getTransferEnglish(transfer) : "";

    const enName = stationEn || stationZh;
    const fullText = `本站：${stationZh}${transferZh}， This station is ${enName}${transferEn} `;
    updateLED(fullText);
}

document.getElementById('btn-next-station').addEventListener('click', (event) => {
    if (!stationSelect.value || !currentLineKey) return;
    const raw = JSON.parse(stationSelect.value);
    const next_zh = raw.next_zh || raw.next;
    if (!next_zh) {
        showThisStationLED(raw.current_zh || raw.current, raw.current_en || raw.current_zh || raw.current);
        return;
    }
    const next_en = raw.next_en || next_zh;
    const line = metroData[currentLineKey];
    const transfer = line.transfers[next_zh];

    let transferZh = transfer ? `，可换乘${transfer}` : "";
    const transferEn = transfer ? getTransferEnglish(transfer) : "";
    let destinationText = "";
    if (currentLineKey === 'line13') {
        const terminalIndex = dirSelect.value === "backward" ? 0 : line.stations.length - 1;
        const terminalZh = line.stations[terminalIndex];
        const terminalEn = line.stations_en && line.stations_en[terminalIndex] || terminalZh;
        destinationText = `终点站：${terminalZh}， The destination of this train is ${terminalEn}。 `;
    }

    const fullText = `${destinationText}下一站：${next_zh}${transferZh}， The Next station is ${next_en}${transferEn} `;
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

    if (currentLineKey === 'line11') {
        const direction = dirSelect.value;
        if (direction === 'outer') {
            playAudio([`outer/外环.mp3`, `outer/${next_zh}.mp3`], onAudioEnded, event.currentTarget);
        } else {
            playAudio([`inner/内环.mp3`, `inner/${next_zh}.mp3`], onAudioEnded, event.currentTarget);
        }
    }
    else if (currentLineKey === 'line1' || currentLineKey === 'line2') {
        const direction = dirSelect.value;
        const terminal = direction === "forward"
            ? line.stations[line.stations.length - 1]
            : line.stations[0];
        const audioQueue = [`${terminal}/${next_zh}.mp3`];
        playAudio(audioQueue, onAudioEnded, event.currentTarget);
    }
    else {
        const direction = dirSelect.value;
        const terminal = direction === "forward"
            ? line.stations[line.stations.length - 1]
            : line.stations[0];
        const audioQueue = [`${terminal}/${next_zh}.mp3`];
        audioQueue.unshift(`${terminal}.mp3`);
        playAudio(audioQueue, onAudioEnded, event.currentTarget);
    }
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
window.addEventListener('resize', () => {
    autoScaleContainer();
    clearTimeout(routeMapResizeTimer);
    routeMapResizeTimer = setTimeout(() => {
        renderRouteMap();
        routeMapResizeTimer = null;
    }, 100);
});