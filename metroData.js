const metroData = {
    "line1": {
        name: "1号线",
        color: "#edcf3b",
        textColor: "#000000",
        stations: ["西塱", "坑口", "花地湾", "芳村", "黄沙", "长寿路", "陈家祠", "西门口", "公园前", "农讲所", "烈士陵园", "东山口", "杨箕", "体育西路", "体育中心", "广州东站"],
        stations_en: ["Xilang", "Kengkou", "Huadiwan", "Fangcun", "Huangsha", "Changshou Road", "Chen Clan Academy", "Ximenkou", "Gongyuanqian", "Peasant Movement Institute", "Martyrs' Park", "Dongshankou", "Yangji", "Tiyu Xilu", "Tianhe Sports Center", "Guangzhou East Railway Station"],
        transfers: { "公园前": "2号线", "芳村": "11号线、22号线", "黄沙": "6号线", "陈家祠": "8号线", "东山口": "6号线", "杨箕": "5号线", "体育西路": "3号线", "广州东站": "3号线、11号线", "西塱": "10号线、22号线、广佛线" }
    },
    "line2": {
        name: "2号线",
        color: "#00679e",
        textColor: "#ffffff",
        stations: ["广州南站", "石壁", "会江", "南浦", "洛溪", "南洲", "东晓南", "江泰路", "昌岗", "江南西", "市二宫", "海珠广场", "公园前", "纪念堂", "越秀公园", "广州火车站", "三元里", "飞翔公园", "白云公园", "白云文化广场", "萧岗", "江夏", "黄边", "嘉禾望岗"],
        stations_en: ["Guangzhou South Railway Station", "Shibi", "Huijiang", "Nanpu", "Luoxi", "Nanzhou", "Dongxiao South", "Jiangtai Road", "Changgang", "Jiangnanxi", "The Second Workers' Cultural Palace", "Haizhu Square", "Gongyuanqian", "Sun Yat-sen Memorial Hall", "Yuexiu Park", "Guangzhou Railway Station", "Sanyuanli", "Feixiang Park", "Baiyun Park", "Baiyun Culture Square", "Xiaogang", "Jiangxia", "Huangbian", "Jiahewanggang"],
        transfers: { "广州南站": "7号线、22号线、佛山2号线", "石壁": "7号线", "南洲": "广佛线", "东晓南": "10号线", "江泰路": "11号线", "昌岗": "8号线", "海珠广场": "6号线", "公园前": "1号线", "广州火车站": "5号线", "嘉禾望岗": "3号线、14号线" ,"白云文化广场": "12号线"}
    },
    "line3_tianhe": {
        name: "3号线 (天河客运站 ⇌ 海傍)",
        color: "#e89e47",
        textColor: "#ffffff",
        stations: ["天河客运站", "五山", "华师", "岗顶", "石牌桥", "体育西路", "珠江新城", "广州塔", "客村", "大塘", "沥滘", "厦滘", "大石", "汉溪长隆", "市桥", "番禺广场", "傍江", "石碁南", "海涌路", "海傍"],
        stations_en: ["Tianhe Coach Terminal", "Wushan", "South China Normal University", "Gangding", "Shipaiqiao", "Tiyu Xilu", "Zhujiang New Town", "Canton Tower", "Kecun", "Datang", "Lijiao", "Xiajiao", "Dashi", "Hanxi Changlong", "Shiqiao", "Panyu Square", "Bangjiang", "Shiqinan", "Haiyong Lu", "Haibang"],
        transfers: { "天河客运站": "6号线", "体育西路": "1号线", "珠江新城": "5号线", "客村": "8号线", "大塘": "11号线", "汉溪长隆": "7号线", "番禺广场": "18号线、22号线", "海傍": "4号线","华师": "11号线" }
    },
    "line3_airport": {
        name: "3号线 (机场北 ⇌ 海傍)",
        color: "#e89e47",
        textColor: "#ffffff",
        stations: ["机场北", "机场南", "高增", "人和", "龙归", "嘉禾望岗", "白云大道北", "永泰", "同和", "京溪南方医院", "梅花园", "燕塘", "广州东站", "林和西", "体育西路", "珠江新城", "广州塔", "客村", "大塘", "沥滘", "厦滘", "大石", "汉溪长隆", "市桥", "番禺广场", "傍江", "石碁南", "海涌路", "海傍"],
        stations_en: ["Airport North (Terminal 2)", "Airport South (Terminal 1)", "Gaozeng", "Renhe", "Longgui", "Jiahewanggang", "Baiyun Dadao Bei", "Yongtai", "Tonghe", "Jingxi Nanfang Hospital", "Meihuayuan", "Yantang", "Guangzhou East Railway Station", "Linhexi", "Tiyu Xilu", "Zhujiang New Town", "Canton Tower", "Kecun", "Datang", "Lijiao", "Xiajiao", "Dashi", "Hanxi Changlong", "Shiqiao", "Panyu Square", "Bangjiang", "Shiqinan", "Haiyong Lu", "Haibang"],
        transfers: { "高增": "9号线", "嘉禾望岗": "2号线、14号线", "燕塘": "6号线", "广州东站": "1号线、11号线", "体育西路": "1号线", "珠江新城": "5号线", "客村": "8号线", "大塘": "11号线", "汉溪长隆": "7号线", "番禺广场": "18号线、22号线", "海傍": "4号线" }
    },
    "line4": {
        name: "4号线",
        color: "#00843D",
        textColor: "#ffffff",
        stations: ["黄村", "车陂", "车陂南", "万胜围", "官洲", "大学城北", "大学城南", "新造", "石碁", "海傍", "低涌", "东涌", "庆盛", "黄阁汽车城", "黄阁", "蕉门", "金洲", "飞沙角", "广隆", "大涌", "塘坑", "南横", "南沙客运港"],
        stations_en: ["Huangcun", "Chebei", "Chebeinan", "Wanshengwei", "Guanzhou", "Higher Education Mega Center North", "Higher Education Mega Center South", "Xinzao", "Shiqi", "Haibang", "Diyong", "Dongyong", "Qingsheng", "Huangge Auto Town", "Huangge", "Jiaomen", "Jinzhou", "Feishajiao", "Guanglong", "Dachong", "Tangkeng", "Nanheng", "Nansha Passenger Port"],
        transfers: { "黄村": "21号线", "车陂": "13号线", "车陂南": "5号线", "万胜围": "8号线、11号线", "官洲": "12号线", "大学城南": "7号线、12号线", "海傍": "3号线" }
    },
    "line5": {
        name: "5号线",
        color: "#c70541",
        textColor: "#ffffff",
        stations: ["滘口", "坦尾", "中山八", "西场", "西村", "广州火车站", "小北", "淘金", "区庄", "动物园", "杨箕", "五羊邨", "珠江新城", "猎德", "潭村", "员村", "科韵路", "车陂南", "东圃", "三溪", "鱼珠", "大沙地", "大沙东", "文冲", "双沙", "庙头", "夏园", "保盈大道", "夏港", "黄埔新港"],
        stations_en: ["Jiaokou", "Tanwei", "Zhongshanba", "Xichang", "Xicun", "Guangzhou Railway Station", "Xiaobei", "Taojin", "Ouzhuang", "The Zoo", "Yangji", "Wuyangcun", "Zhujiang New Town", "Liede", "Tancun", "Yuancun", "Keyun Lu", "Chebeinan", "Dongpu", "Sanxi", "Yuzhu", "Dashadi", "Dashadong", "Wenchong", "Shuangsha", "Miaotou", "Xiayuan", "Baoying Dadao", "Xiagang", "Huangpu New Port"],
        transfers: { "坦尾": "6号线", "中山八": "11号线", "西村": "8号线", "广州火车站": "2号线", "区庄": "6号线", "杨箕": "1号线", "五羊邨": "10号线", "珠江新城": "3号线", "员村": "11号线", "车陂南": "4号线", "鱼珠": "13号线", "大沙东": "7号线", "夏园": "13号线" }
    },
    "line6": {
        name: "6号线",
        color: "#7a2a6b",
        textColor: "#ffffff",
        stations: ["浔峰岗", "横沙", "沙贝", "河沙", "坦尾", "如意坊", "黄沙", "文化公园", "一德路", "海珠广场", "北京路", "团一大广场", "东湖", "东山口", "区庄", "黄花岗", "沙河顶", "沙河", "天平架", "燕塘", "天河客运站", "长湴", "植物园", "龙洞", "柯木塱", "高塘石", "黄陂", "金峰", "暹岗", "苏元", "萝岗", "香雪"],
        stations_en: ["Xunfenggang", "Hengsha", "Shabei", "Hesha", "Tanwei", "Ruyifang", "Huangsha", "Cultural Park", "Yide Lu", "Haizhu Square", "Beijing Lu", "Tuanyida Square", "Donghu", "Dongshankou", "Ouzhuang", "Huanghuagang", "Shaheding", "Shahe", "Tianpingjia", "Yantang", "Tianhe Coach Terminal", "Changban", "Botanical Garden", "Longdong", "Kemulang", "Gaotangshi", "Huangpei", "Jinfeng", "Xiangang", "Suyuan", "Luogang", "Xiangxue"],
        transfers: { "浔峰岗": "12号线", "坦尾": "5号线", "如意坊": "11号线", "黄沙": "1号线", "文化公园": "8号线", "海珠广场": "2号线", "东湖": "10号线、12号线", "东山口": "1号线", "区庄": "5号线", "沙河": "11号线", "燕塘": "3号线", "天河客运站": "3号线", "苏元": "21号线", "萝岗": "7号线" }
    },
    "line7": {
        name: "7号线",
        color: "#8EC31D",
        textColor: "#000000",
        stations: ["美的大道", "北滘公园", "美的", "南涌", "锦龙", "陈村", "陈村北", "大洲", "广州南站", "石壁", "谢村", "钟村", "汉溪长隆", "南村万博", "员岗", "板桥", "大学城南", "深井", "长洲", "裕丰围", "大沙东", "姬堂", "加庄", "科丰路", "萝岗", "水西", "燕山"],
        stations_en: ["Meidi Dadao", "Beijiao Park", "Midea", "Nanchong", "Jinlong", "Chencun", "Chencunbei", "Dazhou", "Guangzhou South Railway Station", "Shibi", "Xiecun", "Zhongcun", "Hanxi Changlong", "Nancun Wanbo", "Yuangang", "Banqiao", "Higher Education Mega Center South", "Shenjing", "Changzhou", "Yufengwei", "Dashadong", "Jitang", "Jiazhuang", "Kefeng Lu", "Luogang", "Shuixi", "Yanshan"],
        transfers: { "北滘公园": "佛山3号线", "广州南站": "2号线、22号线、佛山2号线", "石壁": "2号线", "汉溪长隆": "3号线", "南村万博": "18号线", "大学城南": "4号线、12号线", "裕丰围": "13号线", "大沙东": "5号线", "萝岗": "6号线", "水西": "21号线" }
    },
    "line8": {
        name: "8号线",
        color: "#008c95",
        textColor: "#ffffff",
        stations: ["滘心", "亭岗", "石井", "小坪", "石潭", "聚龙", "上步", "同德", "鹅掌坦", "西村", "彩虹桥", "陈家祠", "华林寺", "文化公园", "同福西", "凤凰新村", "沙园", "宝岗大道", "昌岗", "晓港", "中大", "鹭江", "客村", "赤岗", "磨碟沙", "新港东", "琶洲", "万胜围"],
        stations_en: ["Jiaoxin", "Tinggang", "Shijing", "Xiaoping", "Shitan", "Julong", "Shangbu", "Tongde", "Ezhangtan", "Xicun", "Caihongqiao", "Chen Clan Academy", "Hualinsi Temple", "Cultural Park", "Tongfuxi", "Fenghuang Xincun", "Shayuan", "Baogang Dadao", "Changgang", "Xiaogang", "Sun Yat-sen University", "Lujiang", "Kecun", "Chigang", "Modiesha", "Xingangdong", "Pazhou", "Wanshengwei"],
        transfers: { "聚龙": "12号线", "西村": "5号线", "彩虹桥": "11号线", "陈家祠": "1号线", "文化公园": "6号线", "沙园": "11号线", "昌岗": "2号线", "客村": "3号线", "磨碟沙": "18号线", "琶洲": "11号线", "万胜围": "4号线","赤岗": "12号线" }
    },
    "line9": {
        name: "9号线",
        color: "#71cc98",
        textColor: "#000000",
        stations: ["飞鹅岭", "花都汽车城", "广州北站", "花城路", "花果山公园", "花都广场", "马鞍山公园", "莲塘", "清㘵", "清塘", "高增"],
        stations_en: ["Fei'eling", "Huadu Auto City", "Guangzhou North Railway Station", "Huacheng Lu", "Huaguoshan Park", "Huadu Square", "Ma'anshan Park", "Liantang", "Qingbu", "Qingtang", "Gaozeng"],
        transfers: { "高增": "3号线" }
    },
    "line10": {
        name: "10号线",
        color: "#7389B2",
        textColor: "#ffffff",
        stations: ["杨箕东", "五羊邨", "东湖", "滨江东路", "中大南门", "五凤", "东晓南", "工业大道南", "大干围", "东沙", "花围", "西塱"],
        stations_en: ["Yangjidong", "Wuyangcun", "Donghu", "Binjiang Donglu", "Sun Yat-sen University South Gate", "Wufeng", "Dongxiao South", "Gongye Avenue South", "Daganwei", "Dongsha", "Huawei", "Xilang"],
        transfers: { "五羊邨": "5号线", "东湖": "6号线", "五凤": "11号线", "东晓南": "2号线", "西塱": "1号线、22号线、广佛线" }
    },
    "line11": {
        name: "11号线",
        color: "#F0B200",
        textColor: "#000000",
        isCircle: true,
        stations_outer: ["赤沙", "琶洲", "员村", "天河公园", "华景路", "华师", "龙口西", "广州东站", "沙河", "云台花园", "大金钟路", "中医药大学", "梓元岗", "流花", "彩虹桥", "中山八", "如意坊", "石围塘", "芳村", "大冲口", "沙涌", "鹤洞东", "棣园", "燕岗", "江泰路", "五凤", "逸景路", "上涌", "大塘", "龙潭", "赤沙"],
        stations_outer_en: ["Chisha", "Pazhou", "Yuancun", "Tianhe Park", "Huajing Road", "South China Normal University", "Longkou West", "Guangzhou East Railway Station", "Shahe", "Yuntai Garden", "Dajinzhong Road", "Guangzhou University of Chinese Medicine", "Ziyuangang", "Liuhua", "Caihongqiao", "Zhongshanba", "Ruyifang", "Shiweitang", "Fangcun", "Dachongkou", "Shachong", "Hedong East", "Diyuan", "Yangang", "Jiangtai Road", "Wufeng", "Yijing Road", "Shangchong", "Datang", "Longtan", "Chisha"],
        stations_inner: ["赤沙", "龙潭", "大塘", "上涌", "逸景路", "五凤", "江泰路", "燕岗", "棣园", "鹤洞东", "沙涌", "大冲口", "芳村", "石围塘", "如意坊", "中山八", "彩虹桥", "流花", "梓元岗", "中医药大学", "大金钟路", "云台花园", "沙河", "广州东站", "龙口西", "华师", "华景路", "天河公园", "员村", "琶洲", "赤沙"],
        stations_inner_en: ["Chisha", "Longtan", "Datang", "Shangchong", "Yijing Road", "Wufeng", "Jiangtai Road", "Yangang", "Diyuan", "Hedong East", "Shachong", "Dachongkou", "Fangcun", "Shiweitang", "Ruyifang", "Zhongshanba", "Caihongqiao", "Liuhua", "Ziyuangang", "Guangzhou University of Chinese Medicine", "Dajinzhong Road", "Yuntai Garden", "Shahe", "Guangzhou East Railway Station", "Longkou West", "South China Normal University", "Huajing Road", "Tianhe Park", "Yuancun", "Pazhou", "Chisha"],
        transfers: { "彩虹桥": "8号线", "中山八": "5号线", "如意坊": "6号线", "江泰路": "2号线", "五凤": "10号线", "大塘": "3号线", "龙潭": "18号线", "赤沙": "12号线", "琶洲": "8号线", "员村": "5号线", "天河公园": "13号线、21号线", "华师": "3号线", "广州东站": "1号线、3号线", "沙河": "6号线", "沙涌": "广佛线", "燕岗": "广佛线", "芳村": "1号线、22号线" }
    },
    "line12_west": {
        name: "12号线西段",
        color: "#606a38",
        textColor: "#ffffff",
        stations: ["浔峰岗", "浔峰岗北", "西洲", "聚龙", "广州白云站", "堂涌", "新市墟", "白云文化广场", "广州体育馆"],
        stations_en: ["Xunfenggang", "Xunfenggang North", "Xizhou", "Julong", "Guangzhou Baiyun Railway Station", "Tangchong", "Xinshixu", "Baiyun Culture Square", "Guangzhou Gymnasium"],
        transfers: { "浔峰岗": "6号线", "聚龙": "8号线", "新市墟": "14号线", "白云文化广场": "2号线" }
    },
    "line12_east": {
        name: "12号线东段",
        color: "#606a38",
        textColor: "#ffffff",
        stations: ["大学城南", "大学城北", "官洲", "北山", "赤沙", "赤沙北", "赤岗", "赤岗塔", "二沙岛"],
        stations_en: ["Higher Education Mega Center South", "Higher Education Mega Center North", "Guanzhou", "Beishan", "Chisha", "Chisha North", "Chigang", "Chigang Pagoda", "Ersha Island"],
        transfers: { "大学城南": "4号线、7号线","大学城北": "4号线" ,"官洲": "4号线", "赤沙": "11号线", "赤岗": "8号线"}
    },
    "line13": {
        name: "13号线",
        color: "#827919",
        textColor: "#ffffff",
        stations: ["天河公园", "棠下", "车陂", "天河珠村", "鱼珠", "裕丰围", "双岗", "南海神庙", "夏园", "南岗", "沙村", "白江", "新塘", "官湖", "新沙"],
        stations_en: ["Tianhe Park", "Tangxia", "Chebei", "Tianhe Zhucun", "Yuzhu", "Yufengwei", "Shuanggang", "Nanhai God Temple", "Xiayuan", "Nangang", "Shacun", "Baijiang", "Xintang", "Guanhu", "Xinsha"],
        transfers: { "天河公园": "11号线、21号线", "车陂": "4号线", "鱼珠": "5号线", "裕丰围": "7号线", "夏园": "5号线" }
    },
    "line14": {
        name: "14号线",
        color: "#81312f",
        textColor: "#ffffff",
        stations: ["乐嘉路", "云霄路", "新市墟", "马务", "鹤边", "鹤龙", "彭边", "嘉禾望岗", "白云东平", "夏良", "太和", "竹料", "钟落潭", "马沥", "新和", "太平", "神岗", "赤草", "从化客运站", "东风"],
        stations_en: ["Lejia Road", "Yunxiao Road", "Xinshi Xu", "Mawu", "Hebian", "Helong", "Pengbian", "Jiahewanggang", "Baiyun Dongping", "Xialiang", "Taihe", "Zhuliao", "Zhongluotan", "Mali", "Xinhe", "Taiping", "Shengang", "Chicao", "Conghua Coach Terminal", "Dongfeng"],
        transfers: { "新市墟": "12号线", "嘉禾望岗": "2号线、3号线", "新和": "14号线支线" }
    },
    "line14_branch": {
        name: "14号线支线 (知识城线)",
        color: "#81312f",
        textColor: "#ffffff",
        stations: ["新和", "红卫", "新南", "枫下", "知识城", "何棠下", "旺村", "汤村", "镇龙北", "镇龙"],
        stations_en: ["Xinhe", "Hongwei", "Xinnan", "Fengxia", "Sino-Singapore Guangzhou Knowledge City", "Hetangxia", "Wangcun", "Tangcun", "Zhenlongbei", "Zhenlong"],
        transfers: { "新和": "14号线", "镇龙": "21号线" }
    },
    "line18": {
        name: "18号线",
        color: "#0055bc",
        textColor: "#ffffff",
        stations: ["冼村", "磨碟沙", "龙潭", "沙溪", "南村万博", "番禺广场", "横沥", "万顷沙"],
        stations_en: ["Xiancun", "Modiesha", "Longtan", "Shaxi", "Nancun Wanbo", "Panyu Square", "Hengli", "Wanqingsha"],
        transfers: { "磨碟沙": "8号线", "龙潭": "11号线", "南村万博": "7号线", "番禺广场": "3号线、22号线" }
    },
    "line21": {
        name: "21号线",
        color: "#00123f",
        textColor: "#ffffff",
        stations: ["天河公园", "棠东", "黄村", "大观南路", "天河智慧城", "神舟路", "科学城", "苏元", "水西", "长平", "金坑", "镇龙西", "镇龙", "中新", "坑贝", "凤岗", "朱村", "山田", "钟岗", "增城广场"],
        stations_en: ["Tianhe Park", "Tangdong", "Huangcun", "Daguan Nanlu", "Tianhe Smart City", "Shenzhou Lu", "Science City", "Suyuan", "Shuixi", "Changping", "Jinkeng", "Zhenlongxi", "Zhenlong", "Zhongxin", "Kengbei", "Fenggang", "Zhucun", "Shantian", "Zhonggang", "Zengcheng Square"],
        transfers: { "天河公园": "11号线、13号线", "黄村": "4号线", "苏元": "6号线", "水西": "7号线", "镇龙": "14号线" }
    },
    "line22": {
        name: "22号线",
        color: "#c55a11",
        textColor: "#ffffff",
        stations: ["芳村", "西塱", "南漖", "南浦西", "陈头岗", "广州南站", "市广路", "番禺广场"],
        stations_en: ["Fangcun", "Xilang", "Nanjiao", "Nanpu West", "Chentougang", "Guangzhou South Railway Station", "Shiguang Lu", "Panyu Square"],
        transfers: { "广州南站": "2号线、7号线、佛山2号线", "番禺广场": "3号线、18号线","西塱": "1号线、10号线、广佛线","芳村": "1号线、11号线" }
    }
};