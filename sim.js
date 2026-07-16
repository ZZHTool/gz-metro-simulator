const metroData = {
    "line1": {
        name: "1号线",
        color: "#edcf3b",
        textColor: "#000000",
        stations: ["西塱", "坑口", "花地湾", "芳村", "黄沙", "长寿路", "陈家祠", "西门口", "公园前", "农讲所", "烈士陵园", "东山口", "杨箕", "体育西路", "体育中心", "广州东站"],
        transfers: { "公园前": "2号线", "黄沙": "6号线", "陈家祠": "8号线", "东山口": "6号线", "杨箕": "5号线", "体育西路": "3号线", "广州东站": "3号线、11号线", "西塱": "10号线、22号线" }
    },
    "line2": {
        name: "2号线",
        color: "#00679e",
        textColor: "#ffffff",
        stations: ["广州南站", "石壁", "会江", "南浦", "洛溪", "南洲", "东晓南", "江泰路", "昌岗", "江南西", "市二宫", "海珠广场", "公园前", "纪念堂", "越秀公园", "广州火车站", "三元里", "飞翔公园", "白云公园", "白云文化广场", "萧岗", "江夏", "黄边", "嘉禾望岗"],
        transfers: { "广州南站": "7号线、22号线", "石壁": "7号线", "东晓南": "10号线", "昌岗": "8号线", "海珠广场": "6号线", "公园前": "1号线", "广州火车站": "5号线、11号线", "嘉禾望岗": "3号线、14号线" }
    },
    "line3_tianhe": {
        name: "3号线 (天河客运站 ⇌ 海傍)",
        color: "#e89e47",
        textColor: "#ffffff",
        stations: ["天河客运站", "五山", "华师", "岗顶", "石牌桥", "体育西路", "珠江新城", "广州塔", "客村", "大塘", "沥滘", "厦滘", "大石", "汉溪长隆", "市桥", "番禺广场", "傍江", "石碁南", "海涌路", "海傍"],
        transfers: { "天河客运站": "6号线", "体育西路": "1号线", "珠江新城": "5号线", "客村": "8号线", "大塘": "11号线", "汉溪长隆": "7号线", "番禺广场": "18号线、22号线", "海傍": "4号线" }
    },
    "line3_airport": {
        name: "3号线 (机场北 ⇌ 海傍)",
        color: "#e89e47",
        textColor: "#ffffff",
        stations: ["机场北", "机场南", "高增", "人和", "龙归", "嘉禾望岗", "白云大道北", "永泰", "同和", "京溪南方医院", "梅花园", "燕塘", "广州东站", "林和西", "体育西路", "珠江新城", "广州塔", "客村", "大塘", "沥滘", "厦滘", "大石", "汉溪长隆", "市桥", "番禺广场", "傍江", "石碁南", "海涌路", "海傍"],
        transfers: { "高增": "9号线", "嘉禾望岗": "2号线、14号线", "燕塘": "6号线", "广州东站": "1号线、11号线", "体育西路": "1号线", "珠江新城": "5号线", "客村": "8号线", "大塘": "11号线", "汉溪长隆": "7号线", "番禺广场": "18号线、22号线", "海傍": "4号线" }
    },
    "line4": {
        name: "4号线",
        color: "#00843D",
        textColor: "#ffffff",
        stations: ["黄村", "车陂", "车陂南", "万胜围", "官洲", "大学城北", "大学城南", "新造", "石碁", "海傍", "低涌", "东涌", "庆盛", "黄阁汽车城", "黄阁", "蕉门", "金洲", "飞沙角", "广隆", "大涌", "塘坑", "南横", "南沙客运港"],
        transfers: { "黄村": "21号线", "车陂": "13号线", "车陂南": "5号线", "万胜围": "8号线、11号线", "大学城南": "7号线", "海傍": "3号线" }
    },
    "line5": {
        name: "5号线",
        color: "#c70541",
        textColor: "#ffffff",
        stations: ["滘口", "坦尾", "中山八", "西场", "西村", "广州火车站", "小北", "淘金", "区庄", "动物园", "杨箕", "五羊邨", "珠江新城", "猎德", "潭村", "员村", "科韵路", "车陂南", "东圃", "三溪", "鱼珠", "大沙地", "大沙东", "文冲", "双沙", "庙头", "夏园", "保盈大道", "夏港", "黄埔新港"],
        transfers: { "坦尾": "6号线", "中山八": "11号线", "西村": "8号线", "广州火车站": "2号线、11号线", "区庄": "6号线", "杨箕": "1号线", "五羊邨": "10号线", "珠江新城": "3号线", "员村": "21号线、11号线", "车陂南": "4号线", "鱼珠": "13号线", "大沙东": "7号线", "夏园": "13号线" }
    },
    "line6": {
        name: "6号线",
        color: "#7a2a6b",
        textColor: "#ffffff",
        stations: ["浔峰岗", "横沙", "沙贝", "河沙", "坦尾", "如意坊", "黄沙", "文化公园", "一德路", "海珠广场", "北京路", "团一大广场", "东湖", "东山口", "区庄", "黄花岗", "沙河顶", "沙河", "天平架", "燕塘", "天河客运站", "长湴", "植物园", "龙洞", "柯木塱", "高塘石", "黄陂", "金峰", "暹岗", "苏元", "萝岗", "香雪"],
        transfers: { "坦尾": "5号线", "如意坊": "11号线", "黄沙": "1号线", "文化公园": "8号线", "海珠广场": "2号线", "东湖": "10号线、12号线", "东山口": "1号线", "区庄": "5号线", "沙河": "11号线", "燕塘": "3号线", "天河客运站": "3号线", "苏元": "21号线", "萝岗": "7号线" }
    },
    "line7": {
        name: "7号线",
        color: "#8EC31D",
        textColor: "#000000",
        stations: ["美的大道", "北滘公园", "美的", "南涌", "锦龙", "陈村", "陈村北", "大洲", "广州南站", "石壁", "谢村", "钟村", "汉溪长隆", "南村万博", "员岗", "板桥", "大学城南", "深井", "长洲", "洪圣沙", "裕丰围", "大沙东", "姬堂", "加庄", "科丰路", "萝岗", "水西", "燕山"],
        transfers: { "广州南站": "2号线、22号线", "石壁": "2号线", "汉溪长隆": "3号线", "南村万博": "18号线", "大学城南": "4号线", "裕丰围": "13号线、11号线", "大沙东": "5号线", "萝岗": "6号线", "水西": "21号线" }
    },
    "line8": {
        name: "8号线",
        color: "#008c95",
        textColor: "#ffffff",
        stations: ["滘心", "亭岗", "石井", "小坪", "石潭", "聚龙", "上步", "同德", "鹅掌坦", "西村", "彩虹桥", "陈家祠", "华林寺", "文化公园", "同福西", "凤凰新村", "沙园", "宝岗大道", "昌岗", "晓港", "中大", "鹭江", "客村", "赤岗", "磨碟沙", "新港东", "琶洲", "万胜围"],
        transfers: { "聚龙": "12号线", "西村": "5号线", "彩虹桥": "11号线", "陈家祠": "1号线", "文化公园": "6号线", "沙园": "11号线", "昌岗": "2号线", "客村": "3号线", "磨碟沙": "18号线、11号线", "琶洲": "11号线", "万胜围": "4号线" }
    },
    "line9": {
        name: "9号线",
        color: "#71cc98",
        textColor: "#000000",
        stations: ["飞鹅岭", "花都汽车城", "广州北站", "花城路", "花果山公园", "花都广场", "马鞍山公园", "莲塘", "清㘵", "清塘", "高增"],
        transfers: { "高增": "3号线" }
    },
    "line10": {
        name: "10号线",
        color: "#7389B2",
        textColor: "#ffffff",
        stations: ["杨箕东", "五羊邨", "东湖", "滨江东路", "中大南门", "五凤", "东晓南", "工业大道南", "大干围", "东沙", "花围", "西塱"],
        transfers: { "五羊邨": "5号线", "东湖": "6号线、12号线", "五凤": "11号线", "东晓南": "2号线", "西塱": "1号线、22号线" }
    },
    "line11": {
        name: "11号线",
        color: "#F0B200",
        textColor: "#000000",
        isCircle: true,
        stations_outer: ["赤沙", "琶洲", "员村", "天河公园", "华景路", "华师", "龙口西", "广州东站", "沙河", "云台花园", "大金钟路", "中医药大学", "梓元岗", "流花", "彩虹桥", "中山八", "如意坊", "芳村", "大冲口", "沙涌", "鹤洞东", "棣园", "燕岗", "江泰路", "五凤", "逸景路", "上涌", "大塘", "龙潭", "赤沙"],
        stations_outer_en: ["Chisha", "Pazhou", "Yuancun", "Tianhe Park", "Huangjing Road", "South China Normal University", "Longkou West", "Guangzhou East Railway Station", "Shahe", "Yuntai Garden", "Dajinzhong Road", "Guangzhou University of Chinese Medicine", "Ziyuangang", "Liuhua", "Caihongqiao", "Zhongshanba", "Ruyifang", "Shiweitang", "Fangcun", "Dachongkou", "Shachong", "Hedong East", "Diyuan", "Yangang", "Yangang", "Jiangtai Road", "Wufeng", "Yijing Road", "Shangchong", "Datang", "Longtan", "Chisha"],
        stations_inner: ["赤沙", "龙潭", "大塘", "上涌", "逸景路", "五凤", "江泰路", "燕岗", "棣园", "鹤洞东", "沙涌", "大冲口", "芳村", "石围塘", "如意坊", "中山八", "彩虹桥", "流花", "梓元岗", "中医药大学", "大金钟路", "云台花园", "沙河", "广州东站", "龙口西", "华师", "华景路", "天河公园", "员村", "琶洲", "赤沙"],
        stations_inner_en: ["Chisha", "Longtan", "Datang", "Shangchong", "Yijing Road", "Wufeng", "Jiangtai Road", "Yangang", "Diyuan", "Hedong East", "Shachong", "Dachongkou", "Fangcun", "Shiweitang", "Ruyifang", "Zhongshanba", "Caihongqiao", "Liuhua", "Ziyuangang", "Guangzhou University of Chinese Medicine", "Dajinzhong Road", "Yuntai Garden", "Shahe", "Guangzhou East Railway Station", "Longkou West", "South China Normal University", "Huajing Road", "Tianhe Park", "Yuancun", "Pazhou", "Chisha"],
        transfers: { "彩虹桥": "8号线", "中山八": "5号线", "如意坊": "6号线", "江泰路": "2号线", "五凤": "10号线", "大塘": "3号线", "龙潭": "18号线", "琶洲": "8号线", "员村": "5号线、21号线", "天河公园": "21号线", "广州东站": "1号线、3号线", "沙河": "6号线", "芳村": "1号线、22号线" }
    },
    "line13": {
        name: "13号线",
        color: "#827919",
        textColor: "#ffffff",
        stations: ["鱼珠", "裕丰围", "双岗", "南海神庙", "夏园", "南岗", "沙村", "白江", "新塘", "官湖", "新沙"],
        transfers: { "鱼珠": "5号线", "裕丰围": "7号线、11号线", "夏园": "5号线" }
    },
    "line14": {
        name: "14号线",
        color: "#81312f",
        textColor: "#ffffff",
        stations: ["嘉禾望岗", "白云东平", "夏良", "太和", "竹料", "钟落潭", "马沥", "新和", "太平", "神岗", "赤草", "从化客运站", "东风"],
        transfers: { "嘉禾望岗": "2号线、3号线", "新和": "14号线支线" }
    },
    "line14_branch": {
        name: "14号线支线 (知识城线)",
        color: "#81312f",
        textColor: "#ffffff",
        stations: ["新和", "红卫", "新南", "枫下", "知识城", "何棠下", "旺村", "汤村", "镇龙北", "镇龙"],
        transfers: { "新和": "14号线", "镇龙": "21号线" }
    },
    "line18": {
        name: "18号线",
        color: "#0055bc",
        textColor: "#ffffff",
        stations: ["冼村", "磨碟沙", "龙潭", "沙溪", "南村万博", "番禺广场", "横沥", "万顷沙"],
        transfers: { "磨碟沙": "8号线、11号线", "龙潭": "11号线", "南村万博": "7号线", "番禺广场": "3号线、22号线" }
    },
    "line21": {
        name: "21号线",
        color: "#00123f",
        textColor: "#ffffff",
        stations: ["天河公园", "棠东", "黄村", "大观南路", "天河智慧城", "神舟路", "科学城", "苏元", "水西", "长平", "金坑", "镇龙西", "镇龙", "中新", "坑贝", "凤岗", "朱村", "山田", "钟岗", "增城广场"],
        transfers: { "天河公园": "11号线、13号线", "黄村": "4号线", "苏元": "6号线", "水西": "7号线", "镇龙": "14号线支线" }
    },
    "line22": {
        name: "22号线",
        color: "#c55a11",
        textColor: "#ffffff",
        stations: ["陈头岗", "广州南站", "市广路", "番禺广场"],
        transfers: { "广州南站": "2号线、7号线", "番禺广场": "3号线、18号线" }
    }
};

let currentLineKey = "";
let currentAudio = null;

const dirSelect = document.getElementById('dir-select');
const stationSelect = document.getElementById('station-select');
const simTitle = document.getElementById('sim-title');
const marqueeText = document.getElementById('marquee-text');
const routeMap = document.getElementById('route-map');
const daysElement = document.getElementById('stable-days');

// 智能路由检测：自动通过网址判断当前属于哪条线路
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

// 自动检测并绑定返回首页按钮
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

// 音频播放函数
function playAudio(srcs) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.onended = null;
    }
    const audioQueue = Array.isArray(srcs) ? srcs : [srcs];
    let currentIndex = 0;
    function playNext() {
        if (currentIndex < audioQueue.length) {
            let audioSrc = audioQueue[currentIndex].startsWith('/')
                ? audioQueue[currentIndex]
                : `/${audioQueue[currentIndex]}`;

            currentAudio = new Audio(audioSrc);

            currentAudio.onended = () => {
                currentIndex++;
                playNext();
            };

            currentAudio.play().catch(err => {
                console.warn(`音频播放失败 [${audioSrc}]:`, err);
                currentIndex++;
                playNext();
            });
        }
    }
    playNext();
}

// 初始化当前线路的模拟器界面
function initSimulator(lineKey) {
    currentLineKey = lineKey;
    const line = metroData[lineKey];
    // 动态同步 H1 标题
    if (simTitle) {
        simTitle.innerText = line.name;
    }
    // UI 主色调替换
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

    // 初始化方向下拉菜单
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
}

// 更新下拉框的站点列表
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
                next_zh: zhList[i + 1],
                next_en: enList[i + 1]
            });
            opt.innerText = `${zhList[i]} -> ${zhList[i + 1]}`;
            stationSelect.appendChild(opt);
        }
        return;
    } else {
        stationList = [...line.stations];
        if (direction === "backward") {
            stationList.reverse();
        }
        for (let i = 0; i < stationList.length - 1; i++) {
            let opt = document.createElement('option');
            opt.value = JSON.stringify({ current: stationList[i], next: stationList[i + 1] });
            opt.innerText = `${stationList[i]} -> ${stationList[i + 1]}`;
            stationSelect.appendChild(opt);
        }
    }
    renderRouteMap();
}

// 渲染可视化路线图
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

    // 1. 创建内层画布容器，和底色背景轨道、彩色高亮轨道
    routeMap.innerHTML = `
        <div class="route-map-inner" id="route-map-inner">
            <div class="route-track"></div>
            <div class="route-track-active" id="route-track-active"></div>
            <div class="route-track-arrow" id="route-track-arrow"></div>
        </div>
    `;

    const innerContainer = document.getElementById('route-map-inner');

    // 2. 动态生成每一个站点节点
    stationList.forEach((stationName, index) => {
        const node = document.createElement('div');
        node.className = 'station-node';
        node.dataset.index = index;

        const transferInfo = line.transfers[stationName];
        let transferHTML = '';
        if (transferInfo) {
            const match = transferInfo.match(/\d+/);
            const label = match ? `${match[0]}号线` : '换乘';
            transferHTML = `<span class="transfer-tag">${label}</span>`;
        }

        node.innerHTML = `
            ${transferHTML}
            <div class="station-dot"></div>
            <div class="station-label">${stationName}</div>
        `;

        node.addEventListener('click', () => {
            const targetIndex = Math.min(index, stationSelect.options.length - 1);
            stationSelect.selectedIndex = targetIndex;
            stationSelect.dispatchEvent(new Event('change'));
        });

        innerContainer.appendChild(node);
    });

    // 默认点亮当前选中的区间
    updateActiveMapNodes(stationSelect.selectedIndex || 0);
}

// 动态高亮更新函数：更新圆点、拉伸已驶过轨道、定位前进箭头，并自动平滑滚动至当前站
function updateActiveMapNodes(activeIndex) {
    const nodes = document.querySelectorAll('.station-node');
    const trackActive = document.getElementById('route-track-active');
    const arrow = document.getElementById('route-track-arrow');
    if (!nodes.length) return;

    // 1. 更新站点节点状态
    nodes.forEach((node, idx) => {
        node.classList.remove('active', 'next-active');
        if (idx === activeIndex) {
            node.classList.add('active');
        } else if (idx === activeIndex + 1) {
            node.classList.add('next-active');
        }
    });

    // 2. 拉伸已行驶轨道的长度
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

    // 3.定位箭头在“当前站”和“下一站”之间
    const nextNode = nodes[activeIndex + 1];
    if (activeNode && nextNode && arrow) {
        const nextCenter = nextNode.offsetLeft + nextNode.offsetWidth / 2;
        const arrowCenter = (activeCenter + nextCenter) / 2;
        arrow.style.left = `${arrowCenter}px`;
        arrow.style.display = 'block';
    } else if (arrow) {
        arrow.style.display = 'none';
    }

    // 4.平滑弹性滚动逻辑
    if (activeNode && routeMap) {
        const mapWidth = routeMap.clientWidth;
        const targetScrollLeft = activeCenter - (mapWidth / 2.5);

        if (window.routeScrollTimer) {
            clearTimeout(window.routeScrollTimer);
        }

        window.routeScrollTimer = setTimeout(() => {
            smoothScrollTo(routeMap, targetScrollLeft, 800);
        }, 150);
    }
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
// 监听下拉菜单改变事件，保持双向同步
stationSelect.addEventListener('change', () => {
    updateActiveMapNodes(stationSelect.selectedIndex);
});
// LED 文字滚动引擎
function updateLED(textContent) {
    if (!marqueeText) return;
    marqueeText.innerHTML = `<span class="led-red">${textContent}</span>`;

    marqueeText.style.animation = 'none';
    marqueeText.offsetHeight;

    let totalDistance = marqueeText.offsetWidth;

    if (totalDistance === 0) {
        const containerWidth = 600;
        let textWidth = 0;
        for (let i = 0; i < textContent.length; i++) {
            textWidth += (textContent.charCodeAt(i) > 255) ? 38 : 19;
        }
        totalDistance = containerWidth + textWidth;
    }

    const speedPixelsPerSecond = 152;
    const duration = totalDistance / speedPixelsPerSecond;

    marqueeText.style.animationName = 'ledScroll';
    marqueeText.style.animationDuration = `${duration}s`;
    marqueeText.style.animationTimingFunction = 'linear';
    marqueeText.style.animationIterationCount = 'infinite';
}


// 方向切换
dirSelect.addEventListener('change', () => {
    updateStations();
    renderRouteMap();
});

// 关门提示音
document.getElementById('btn-door-close').addEventListener('click', () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    updateLED("车门即将关闭，请注意安全，谨防被夹！ The doors are closing, take care your safety, and beware of being clamped! ");
});

// 下一站报站
document.getElementById('btn-next-station').addEventListener('click', () => {
    if (!stationSelect.value || !currentLineKey) return;
    const raw = JSON.parse(stationSelect.value);
    const next_zh = raw.next_zh || raw.next;
    const next_en = raw.next_en || next_zh;
    const transfer = metroData[currentLineKey].transfers[next_zh];

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

    if (currentLineKey.startsWith('line11')) {
        const direction = dirSelect.value;
        if (direction === 'outer') {
            playAudio([`line11/outer/外环.mp3`, `line11/outer/${next_zh}.mp3`]);
        } else {
            playAudio([`line11/inner/内环.mp3`, `line11/inner/${next_zh}.mp3`]);
        }
    }
});
// 运行天数计算
function updateRunningDays() {
    if (!daysElement) return;
    const urodz = new Date("07/15/2026");
    const now = new Date();
    const ile = now.getTime() - urodz.getTime();
    const dni = Math.floor(ile / (1000 * 60 * 60 * 24));
    daysElement.textContent = dni >= 0 ? dni : 0;
}

document.addEventListener('DOMContentLoaded', () => {
    const autoLineKey = detectLineFromUrl();
    initSimulator(autoLineKey);
    initBackButton();
    updateRunningDays();
});