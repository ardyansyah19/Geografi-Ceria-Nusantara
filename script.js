/* =========================================================
   script.js — Logika & data untuk Jelajah Nusantara
   Peta menggunakan bentuk pulau/provinsi ASLI Indonesia
   (sumber garis batas: open-source SVG "indonesia-map" by
   junwatu, viewBox 0 0 2021 922), bukan lagi bentuk blob.
   ========================================================= */

/* ---------------- DATA 38 PROVINSI ----------------
   svgkey  : id grup <path> bentuk asli provinsi tsb di peta (null jika tidak tersedia)
   marker  : koordinat [x,y] penanda titik (dipakai jika svgkey null, atau
             provinsi berbagi satu bentuk gabungan dengan provinsi lain)
   label   : koordinat [x,y] untuk label & efek pulse saat provinsi dipilih
------------------------------------------------------ */
const provinces = [
  {id:1, name:'Aceh', capital:'Banda Aceh', island:'Sumatera', icon:'🕌', fact:'Dikenal sebagai \'Serambi Mekah\' dengan Masjid Raya Baiturrahman yang megah.', svgkey:'Aceh', marker:null, label:[102.2, 227.9]},
  {id:2, name:'Sumatera Utara', capital:'Medan', island:'Sumatera', icon:'🌋', fact:'Rumah bagi Danau Toba, danau vulkanik terbesar di dunia!', svgkey:'Sumatera-Utara', marker:null, label:[199.9, 299.9]},
  {id:3, name:'Sumatera Barat', capital:'Padang', island:'Sumatera', icon:'🍛', fact:'Terkenal dengan masakan Rendang yang lezat dan rumah adat Gadang.', svgkey:'Sumatera-Barat', marker:null, label:[256.0, 436.8]},
  {id:4, name:'Riau', capital:'Pekanbaru', island:'Sumatera', icon:'🌴', fact:'Daerah penghasil karet dan minyak bumi terbesar di Sumatera.', svgkey:'Riau', marker:null, label:[317.8, 366.8]},
  {id:5, name:'Kepulauan Riau', capital:'Tanjung Pinang', island:'Sumatera', icon:'🏝️', fact:'Terdiri dari ribuan pulau indah yang tersebar di Selat Malaka.', svgkey:'Kepulauan-Riau', marker:null, label:[580.5, 229.8]},
  {id:6, name:'Jambi', capital:'Jambi', island:'Sumatera', icon:'🛕', fact:'Punya Candi Muaro Jambi, kompleks candi Buddha terluas di Asia Tenggara.', svgkey:'Jambi', marker:null, label:[358.3, 478.4]},
  {id:7, name:'Bengkulu', capital:'Bengkulu', island:'Sumatera', icon:'🌸', fact:'Rumah bunga Rafflesia arnoldii, bunga terbesar di dunia!', svgkey:'Bengkulu', marker:null, label:[337.3, 558.2]},
  {id:8, name:'Sumatera Selatan', capital:'Palembang', island:'Sumatera', icon:'🍢', fact:'Terkenal dengan Jembatan Ampera dan makanan pempek yang enak.', svgkey:'Sumatera-Selatan', marker:null, label:[407.4, 546.2]},
  {id:9, name:'Kepulauan Bangka Belitung', capital:'Pangkal Pinang', island:'Sumatera', icon:'🪨', fact:'Terkenal dengan pantai berpasir putih dan batu granit raksasa.', svgkey:'Kepulauan-Bangka-Belitung', marker:null, label:[518.0, 505.9]},
  {id:10, name:'Lampung', capital:'Bandar Lampung', island:'Sumatera', icon:'🐘', fact:'Gerbang Pulau Sumatera dan rumah bagi Gajah Sumatera.', svgkey:'Lampung', marker:null, label:[437.4, 614.4]},

  {id:11, name:'DKI Jakarta', capital:'Jakarta', island:'Jawa', icon:'🏙️', fact:'Ibu kota Indonesia! Punya Monas yang menjulang tinggi ke langit.', svgkey:null, marker:[497, 653], label:[497, 653]},
  {id:12, name:'Banten', capital:'Serang', island:'Jawa', icon:'🦏', fact:'Rumah Taman Nasional Ujung Kulon, tempat tinggal Badak Jawa yang langka.', svgkey:'Banten', marker:null, label:[486.7, 682.6]},
  {id:13, name:'Jawa Barat', capital:'Bandung', island:'Jawa', icon:'🌄', fact:'Dikenal sebagai \'Kota Kembang\' dengan udara sejuk pegunungan.', svgkey:'Jawa-Barat', marker:null, label:[554.4, 700.8]},
  {id:14, name:'Jawa Tengah', capital:'Semarang', island:'Jawa', icon:'🛕', fact:'Rumah Candi Borobudur, candi Buddha terbesar di dunia!', svgkey:'Jawa-Tengah', marker:null, label:[659.9, 721.0]},
  {id:15, name:'DI Yogyakarta', capital:'Yogyakarta', island:'Jawa', icon:'👑', fact:'Kota budaya dengan Keraton megah dan jalan Malioboro yang ramai.', svgkey:'DI-Yogyakarta', marker:null, label:[672.5, 746.7]},
  {id:16, name:'Jawa Timur', capital:'Surabaya', island:'Jawa', icon:'🌋', fact:'Kota Pahlawan yang dekat dengan Gunung Bromo yang memesona.', svgkey:'Jawa-Timur', marker:null, label:[770.7, 740.2]},

  {id:17, name:'Bali', capital:'Denpasar', island:'Bali & Nusa Tenggara', icon:'🌺', fact:'Pulau Dewata yang terkenal dengan pantai indah dan pura suci.', svgkey:'Bali', marker:null, label:[868.4, 771.0]},
  {id:18, name:'Nusa Tenggara Barat', capital:'Mataram', island:'Bali & Nusa Tenggara', icon:'⛰️', fact:'Rumah Gunung Rinjani yang megah dan Pulau Lombok yang eksotis.', svgkey:'Nusa-Tenggara-Barat', marker:null, label:[988.4, 776.5]},
  {id:19, name:'Nusa Tenggara Timur', capital:'Kupang', island:'Bali & Nusa Tenggara', icon:'🦎', fact:'Rumah komodo, kadal raksasa purba yang hanya ada di Indonesia!', svgkey:'Nusa-Tenggara-Timur', marker:null, label:[1132.0, 773.4]},

  {id:20, name:'Kalimantan Barat', capital:'Pontianak', island:'Kalimantan', icon:'🌐', fact:'Dilalui garis Khatulistiwa (garis equator) tepat di kotanya!', svgkey:'Kalimantan-Barat', marker:null, label:[718.6, 423.1]},
  {id:21, name:'Kalimantan Tengah', capital:'Palangka Raya', island:'Kalimantan', icon:'🦧', fact:'Hutan hujan luas yang menjadi rumah bagi Orangutan.', svgkey:'Kalimantan-Tengah', marker:null, label:[791.6, 463.3]},
  {id:22, name:'Kalimantan Selatan', capital:'Banjarmasin', island:'Kalimantan', icon:'🛶', fact:'Terkenal dengan pasar terapung yang unik di atas sungai.', svgkey:'Kalimantan-Selatan', marker:null, label:[881.6, 520.1]},
  {id:23, name:'Kalimantan Timur', capital:'Samarinda', island:'Kalimantan', icon:'🏗️', fact:'Lokasi Ibu Kota Nusantara (IKN), ibu kota baru Indonesia!', svgkey:'Kalimantan-Timur', marker:null, label:[923.5, 355.7]},
  {id:24, name:'Kalimantan Utara', capital:'Tanjung Selor', island:'Kalimantan', icon:'🌲', fact:'Provinsi termuda di Kalimantan yang berbatasan langsung dengan Malaysia.', svgkey:null, marker:[900, 233], label:[900, 233]},

  {id:25, name:'Sulawesi Utara', capital:'Manado', island:'Sulawesi', icon:'🐠', fact:'Surga bawah laut untuk menyelam di Taman Nasional Bunaken.', svgkey:'Sulawesi-Utara', marker:null, label:[1247.6, 356.3]},
  {id:26, name:'Gorontalo', capital:'Gorontalo', island:'Sulawesi', icon:'🎉', fact:'Terkenal dengan Pulau Cinta dan karnaval budaya yang meriah.', svgkey:'Gorontalo', marker:null, label:[1166.2, 372.1]},
  {id:27, name:'Sulawesi Tengah', capital:'Palu', island:'Sulawesi', icon:'🗿', fact:'Punya Taman Nasional Lore Lindu dengan patung-patung batu kuno.', svgkey:'Sulawesi-Tengah', marker:null, label:[1135.6, 443.6]},
  {id:28, name:'Sulawesi Barat', capital:'Mamuju', island:'Sulawesi', icon:'🌅', fact:'Provinsi dengan pantai indah menghadap Selat Makassar.', svgkey:'Sulawesi-Barat', marker:null, label:[1045.3, 497.7]},
  {id:29, name:'Sulawesi Selatan', capital:'Makassar', island:'Sulawesi', icon:'⛵', fact:'Rumah suku Bugis, pelaut ulung yang terkenal di seluruh Nusantara.', svgkey:'Sulawesi-Selatan', marker:null, label:[1095.4, 566.5]},
  {id:30, name:'Sulawesi Tenggara', capital:'Kendari', island:'Sulawesi', icon:'🐟', fact:'Punya Taman Nasional Wakatobi, surga snorkeling dunia!', svgkey:'Sulawesi-Tenggara', marker:null, label:[1152.0, 570.3]},

  {id:31, name:'Maluku', capital:'Ambon', island:'Maluku', icon:'🌰', fact:'Dulu disebut \'Pulau Rempah\' karena kaya akan cengkeh dan pala.', svgkey:'Maluku', marker:null, label:[1463.4, 546.6]},
  {id:32, name:'Maluku Utara', capital:'Sofifi', island:'Maluku', icon:'🏰', fact:'Rumah Kesultanan Ternate dan Tidore yang penuh sejarah.', svgkey:'Maluku-Utara', marker:null, label:[1413.9, 372.0]},

  {id:33, name:'Papua Barat', capital:'Manokwari', island:'Papua', icon:'🐬', fact:'Gerbang menuju Raja Ampat, surga bahari yang menakjubkan.', svgkey:'Papua-Barat', marker:null, label:[1613.6, 498.0]},
  {id:34, name:'Papua Barat Daya', capital:'Sorong', island:'Papua', icon:'🐠', fact:'Rumah Raja Ampat, salah satu surga terumbu karang terbaik dunia!', svgkey:null, marker:[1548, 443], label:[1548, 443]},
  {id:35, name:'Papua Tengah', capital:'Nabire', island:'Papua', icon:'🦈', fact:'Dekat Teluk Cendrawasih, rumah hiu paus yang jinak dan besar.', svgkey:null, marker:[1745, 515], label:[1745, 515]},
  {id:36, name:'Papua Pegunungan', capital:'Wamena', island:'Papua', icon:'⛰️', fact:'Rumah Lembah Baliem yang indah dan suku Dani yang unik.', svgkey:null, marker:[1825, 555], label:[1825, 555]},
  {id:37, name:'Papua', capital:'Jayapura', island:'Papua', icon:'🦜', fact:'Rumah burung Cendrawasih, si burung surga yang cantik.', svgkey:'Papua', marker:null, label:[1818.3, 633.8]},
  {id:38, name:'Papua Selatan', capital:'Merauke', island:'Papua', icon:'🦌', fact:'Ujung timur Indonesia, dekat Taman Nasional Wasur yang kaya satwa.', svgkey:null, marker:[1895, 755], label:[1895, 755]},
];

/* Beberapa provinsi baru hasil pemekaran (Kaltara, Papua Barat Daya,
   Papua Tengah, Papua Pegunungan, Papua Selatan) serta DKI Jakarta
   belum punya data batas wilayah tersendiri di berkas peta open-source
   yang dipakai, sehingga ditampilkan sebagai PENANDA TITIK di atas
   bentuk pulau aslinya — sama seperti provinsi lain, titik ini tetap
   bisa diklik, dicari, dan dipakai dalam mode kuis. */

function colorFor(i){
  const hue = (i * 137.508) % 360;
  return `hsl(${hue}, 68%, 55%)`;
}
provinces.forEach((p, i)=>{ p.color = colorFor(i); });

/* ---------------- STATE ---------------- */
const visited = new Set();
let activeId = null;
let quizMode = false;
let quizTarget = null;
let quizScore = 0, quizTotal = 0;
let soundOn = true;

/* ---------------- AUDIO ---------------- */
let actx = null;
function beep(freq, dur, type="sine"){
  if(!soundOn) return;
  try{
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = type; o.frequency.value = freq;
    o.connect(g); g.connect(actx.destination);
    g.gain.setValueAtTime(0.08, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.start(); o.stop(actx.currentTime + dur);
  }catch(e){}
}

/* ---------------- BUILD MAP ---------------- */
const svgNS = "http://www.w3.org/2000/svg";
const svg = document.getElementById('map');
const shapesLayer = document.getElementById('shapesLayer');
const markersLayer = document.getElementById('markersLayer');

/* Colorize every real-shape province + wire up click handling */
provinces.forEach(p=>{
  if(p.svgkey){
    const els = shapesLayer.querySelectorAll(`[data-svgkey="${p.svgkey}"]`);
    els.forEach(g=>{
      g.querySelectorAll('path').forEach(path=>{
        path.style.fill = p.color;
      });
      g.setAttribute('data-province-id', p.id);
      g.addEventListener('click', ()=> selectProvince(p.id));
    });
  }
});

/* Pulse + label + (for marker-only provinces) a clickable dot,
   placed for every province at its `label` coordinate. */
provinces.forEach(p=>{
  const [x, y] = p.label;

  const g = document.createElementNS(svgNS,'g');
  g.setAttribute('class','province-marker-group');
  g.setAttribute('data-marker-id', p.id);

  const pulse = document.createElementNS(svgNS,'circle');
  pulse.setAttribute('cx', x); pulse.setAttribute('cy', y); pulse.setAttribute('r', 10);
  pulse.setAttribute('class','province-pulse');
  pulse.setAttribute('stroke', p.color);
  pulse.setAttribute('id', 'pulse-'+p.id);
  g.appendChild(pulse);

  if(!p.svgkey){
    /* No real shape available: draw a clickable colored dot instead */
    const dot = document.createElementNS(svgNS,'circle');
    dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('r', 9);
    dot.setAttribute('fill', p.color);
    dot.setAttribute('class','province-dot');
    dot.setAttribute('id', 'dot-'+p.id);
    g.appendChild(dot);
    g.addEventListener('click', ()=> selectProvince(p.id));
  }

  const tag = document.createElementNS(svgNS,'text');
  tag.setAttribute('x', x + 9); tag.setAttribute('y', y - 7);
  tag.setAttribute('class','province-label-tag');
  tag.textContent = p.name;
  g.appendChild(tag);

  markersLayer.appendChild(g);
});

/* ---------------- ISLAND CHIPS ---------------- */
const chipsEl = document.getElementById('islandChips');
const islandNames = ["Semua", ...new Set(provinces.map(p=>p.island))];
islandNames.forEach(name=>{
  const chip = document.createElement('div');
  chip.className = 'chip' + (name==="Semua" ? " active" : "");
  chip.textContent = name;
  chip.addEventListener('click', ()=>{
    document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    filterByIsland(name);
  });
  chipsEl.appendChild(chip);
});

function elementsForProvince(p){
  const els = [];
  if(p.svgkey) els.push(...shapesLayer.querySelectorAll(`[data-svgkey="${p.svgkey}"]`));
  const marker = markersLayer.querySelector(`[data-marker-id="${p.id}"]`);
  if(marker) els.push(marker);
  return els;
}

function filterByIsland(name){
  provinces.forEach(p=>{
    const show = (name==="Semua" || p.island===name);
    elementsForProvince(p).forEach(el=>{ el.style.opacity = show ? "1" : "0.12"; });
  });
}

/* ---------------- SELECT PROVINCE ---------------- */
const mascotLines = [
  "Wah, keren! Kamu menemukan {name}! 🎉",
  "Hebat! {name} sudah ada di paspormu sekarang! 📘",
  "Asyik! Yuk simpan fakta seru tentang {name}! ✨",
  "Cap paspor baru: {name}! Terus jelajahi ya! 🧭"
];

function selectProvince(id){
  const p = provinces.find(x=>x.id===id);
  if(!p) return;

  document.querySelectorAll('.province-shape.active, .province-marker-group.active').forEach(g=>g.classList.remove('active'));
  elementsForProvince(p).forEach(el=> el.classList.add('active'));

  activeId = id;
  const wasNew = !visited.has(id);
  visited.add(id);
  updatePassport();

  document.getElementById('infoBadge').style.background = p.color + "33";
  document.getElementById('infoBadge').textContent = p.icon;
  document.getElementById('infoTitle').textContent = p.name;
  document.getElementById('infoSub').textContent = "Ibu kota: " + p.capital;
  document.getElementById('infoFact').textContent = p.fact;
  document.getElementById('infoIsland').textContent = "Pulau: " + p.island;
  document.getElementById('infoNumber').textContent = "Provinsi ke-" + p.id;
  document.getElementById('infoCard').classList.add('show');

  pulseAt(id);
  beep(wasNew ? 660 : 440, 0.18, "triangle");

  if(!quizMode){
    const line = mascotLines[Math.floor(Math.random()*mascotLines.length)].replace("{name}", p.name);
    setMascot(p.icon, line);
  } else {
    handleQuizAnswer(p);
  }
}

function pulseAt(id){
  const el = document.getElementById('pulse-'+id);
  if(!el) return;
  el.style.transition = "none";
  el.setAttribute('r', 10); el.style.opacity = 1;
  requestAnimationFrame(()=>{
    el.style.transition = "all .7s ease-out";
    el.setAttribute('r', 30); el.style.opacity = 0;
  });
}

function updatePassport(){
  const total = provinces.length;
  const count = visited.size;
  document.getElementById('passportCount').textContent = count + "/" + total;
  document.getElementById('passportFill').style.width = (count/total*100) + "%";
  if(count === total){
    setMascot("🏆", "LUAR BIASA! Kamu sudah menjelajahi seluruh 38 provinsi Indonesia! Kamu Explorer Sejati! 🎊");
  }
}

function setMascot(emoji, text){
  document.getElementById('mascotEmoji').textContent = emoji;
  document.getElementById('mascotText').textContent = text;
}

document.getElementById('closeInfo').addEventListener('click', ()=>{
  document.getElementById('infoCard').classList.remove('show');
  document.querySelectorAll('.province-shape.active, .province-marker-group.active').forEach(g=>g.classList.remove('active'));
});

/* ---------------- SEARCH ---------------- */
document.getElementById('searchInput').addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  provinces.forEach(p=>{
    const match = p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q);
    const show = (q==="" || match);
    elementsForProvince(p).forEach(el=>{ el.style.opacity = show ? "1" : "0.1"; });
    const dot = document.getElementById('dot-'+p.id);
    if(dot) dot.setAttribute('r', (q!=="" && match) ? 12 : 9);
  });
  if(q !== ""){
    document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    document.querySelector('.chip').classList.add('active');
  }
});

/* ---------------- RANDOM BUTTON ---------------- */
document.getElementById('randomBtn').addEventListener('click', ()=>{
  const p = provinces[Math.floor(Math.random()*provinces.length)];
  selectProvince(p.id);
  document.getElementById('infoCard').scrollIntoView({behavior:'smooth', block:'nearest'});
});

/* ---------------- SOUND TOGGLE ---------------- */
document.getElementById('soundBtn').addEventListener('click', (e)=>{
  soundOn = !soundOn;
  e.target.textContent = soundOn ? "🔊 Suara: Nyala" : "🔇 Suara: Mati";
});

/* ---------------- QUIZ MODE ---------------- */
const quizBtn = document.getElementById('quizBtn');
const quizPanel = document.getElementById('quizPanel');

quizBtn.addEventListener('click', ()=>{
  quizMode = true;
  quizScore = 0; quizTotal = 0;
  document.getElementById('infoCard').classList.remove('show');
  quizPanel.classList.add('show');
  setMascot("🎯", "Mode kuis aktif! Coba temukan provinsi yang aku sebutkan di peta ya!");
  nextQuizQuestion();
});

document.getElementById('quizStopBtn').addEventListener('click', ()=>{
  quizMode = false;
  quizPanel.classList.remove('show');
  clearQuizHighlight();
  setMascot("🦎", "Selesai berkuis! Skormu " + quizScore + " dari " + quizTotal + ". Yuk lanjut jelajahi peta!");
});

function clearQuizHighlight(){
  if(quizTarget){
    const dot = document.getElementById('dot-'+quizTarget.id);
    if(dot) dot.classList.remove('quiz-target');
    const pulse = document.getElementById('pulse-'+quizTarget.id);
    if(pulse) pulse.classList.remove('quiz-target');
  }
}

function nextQuizQuestion(){
  clearQuizHighlight();
  quizTarget = provinces[Math.floor(Math.random()*provinces.length)];
  document.getElementById('quizQuestion').textContent = "🔎 Klik lokasi provinsi: " + quizTarget.name;
  document.getElementById('quizFeedback').textContent = "";
  document.getElementById('quizScore').textContent = "Skor: " + quizScore + " / " + quizTotal;
}

function handleQuizAnswer(clickedProvince){
  quizTotal++;
  const fb = document.getElementById('quizFeedback');
  if(clickedProvince.id === quizTarget.id){
    quizScore++;
    fb.textContent = "✅ Benar! Kamu hebat!";
    fb.style.color = "#217a45";
    beep(880, 0.2, "square");
  } else {
    fb.textContent = "❌ Belum tepat, itu " + clickedProvince.name + ". Yang benar: " + quizTarget.name + ".";
    fb.style.color = "#c0392b";
    beep(220, 0.25, "sawtooth");
  }
  document.getElementById('quizScore').textContent = "Skor: " + quizScore + " / " + quizTotal;
  setTimeout(nextQuizQuestion, 1400);
}

/* init */
filterByIsland("Semua");
updatePassport();
