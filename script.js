const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const toast = (message) => { const el=$("#toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),2600); };

// Intro screen and scroll reveal
window.addEventListener("load",()=>{setTimeout(()=>$("#introScreen")?.remove(),3300);});
const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.12});
$$(".reveal").forEach(el=>observer.observe(el));
const progress=$("#scrollProgress");
window.addEventListener("scroll",()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+"%";},{passive:true});

// Mobile navigation
const menu=$("#mobileMenu"), nav=$("#mainNav");
menu.addEventListener("click",()=>{const open=menu.getAttribute("aria-expanded")!=="true";menu.setAttribute("aria-expanded",String(open));nav.classList.toggle("open",open);});
$$(".main-nav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false");}));

// Cat behavior translator
const behaviors={
 tail:{symbol:"↟",title:"Ekor tegak",text:"Ekor yang tegak dengan postur tubuh rileks sering menjadi tanda sapaan ramah atau rasa nyaman. Perhatikan juga telinga, mata, dan situasinya."},
 purr:{symbol:"〰",title:"Mendengkur",text:"Dengkuran sering muncul saat kucing merasa nyaman, tetapi juga bisa terjadi ketika mereka cemas atau kurang sehat. Perhatikan bahasa tubuh dan perubahan kebiasaannya."},
 knead:{symbol:"✳",title:"Menguleni",text:"Gerakan menekan-nekan permukaan dengan kedua kaki depan sering terbawa sejak masa menyusu. Kucing dapat melakukannya saat merasa nyaman."},
 blink:{symbol:"◡",title:"Kedip perlahan",text:"Kedipan lambat sering terlihat dalam interaksi yang tenang. Kamu bisa membalas dengan berkedip perlahan tanpa memaksa kucing mendekat."}
};
$$(".behavior-tab").forEach(btn=>btn.addEventListener("click",()=>{ $$(".behavior-tab").forEach(x=>x.classList.remove("active"));btn.classList.add("active");const data=behaviors[btn.dataset.behavior];$("#behaviorSymbol").textContent=data.symbol;$("#behaviorTitle").textContent=data.title;$("#behaviorText").textContent=data.text; }));

// Random facts
const facts=[
"Kucing memiliki indra pendengaran yang sangat peka.",
"Setiap kucing memiliki pola hidung yang unik.",
"Kucing berkomunikasi melalui suara, aroma, dan bahasa tubuh.",
"Kucing menghabiskan banyak waktu untuk tidur dan beristirahat.",
"Kumis membantu kucing merasakan perubahan ruang di sekitarnya.",
"Kucing dapat menggunakan ekornya untuk membantu menjaga keseimbangan."
];
let factIndex=0;
$("#factButton").addEventListener("click",()=>{factIndex=(factIndex+1)%facts.length;const el=$("#factText");el.animate([{opacity:0,transform:"translateY(12px)"},{opacity:1,transform:"translateY(0)"}],{duration:420,easing:"ease-out"});el.textContent=facts[factIndex];$("#factNumber").textContent=String(factIndex+1).padStart(2,"0");});

// Surprise button scrolls to a random section and gives feedback
$("#surpriseButton").addEventListener("click",()=>{const targets=["#history","#behavior","#gallery","#care"];const target=$(targets[Math.floor(Math.random()*targets.length)]);target.scrollIntoView({behavior:"smooth"});toast("A little surprise is waiting for you!");});

// Local photo uploader: add any number of images to the gallery
$("#photoUpload").addEventListener("change",event=>{
 const files=[...event.target.files].filter(f=>f.type.startsWith("image/"));
 if(!files.length)return;
 files.forEach(file=>{
  const url=URL.createObjectURL(file);const figure=document.createElement("figure");figure.className="gallery-item user-gallery-item";
  const img=document.createElement("img");img.src=url;img.alt=file.name;img.className="user-photo";
  const caption=document.createElement("figcaption");const title=document.createElement("b");title.textContent="YOUR CAT / ADDED PHOTO";const name=document.createElement("span");name.textContent=file.name;caption.append(title,name);figure.append(img,caption);$("#galleryGrid").append(figure);
 });
 toast(`${files.length} foto berhasil ditambahkan ke galeri.`);
 event.target.value="";
});

// Care checklist progress
const checks=$$(".care-item input");
function updateCare(){const done=checks.filter(c=>c.checked).length;$("#careCount").textContent=`${done} / ${checks.length} DONE`;$("#careProgress").style.width=(done/checks.length*100)+"%";if(done===checks.length)toast("Checklist selesai. Great cat care!");}
checks.forEach(c=>c.addEventListener("change",updateCare));

// Font picker: loads local font files after user adds them to assets/fonts
const fontPopover=$("#fontPopover");
$("#fontButton").addEventListener("click",()=>fontPopover.classList.toggle("open"));
$("#closeFont").addEventListener("click",()=>fontPopover.classList.remove("open"));
document.addEventListener("click",e=>{if(!fontPopover.contains(e.target)&&!$("#fontButton").contains(e.target))fontPopover.classList.remove("open");});
$$(".font-choice").forEach(btn=>btn.addEventListener("click",()=>{
 const name=btn.dataset.font;document.body.classList.remove("font-matcha-world","font-matcha-style","font-green-matcha","font-avolisse","font-super-waffles");
 if(name!=="default")document.body.classList.add("font-"+name);
 $$(".font-choice").forEach(x=>x.classList.toggle("selected",x===btn));
 fontPopover.classList.remove("open");
 if(name!=="default"){const family={ "matcha-world":"MatchaWorld","matcha-style":"MatchaStyle","green-matcha":"GreenMatcha","avolisse":"Avolisse","super-waffles":"SuperWaffles"}[name];document.fonts.load(`24px ${family}`).then(fonts=>{if(!fonts.length)toast("File font belum ditemukan. Lihat folder assets/fonts.");});}
}));
// FALLING CUTE BACKGROUND
const fallingLayer = document.getElementById("fallingLayer");

const fallingSymbols = [
    { symbol: "✦", color: "#FFD166" },
    { symbol: "✧", color: "#BDA7FF" },
    { symbol: "♡", color: "#FF6F9F" },
    { symbol: "✿", color: "#FF9DBD" },
    { symbol: "✳", color: "#A8E8D2" },
    { symbol: "🐾", color: "#C39BFF" },
    { symbol: "★", color: "#FFE36E" }
];

function createFallingElement() {
    const item = document.createElement("span");

    const randomSymbol =
        fallingSymbols[
            Math.floor(Math.random() * fallingSymbols.length)
        ];

    item.className = "falling-piece";
    item.textContent = randomSymbol.symbol;

    item.style.setProperty("--x", Math.random() * 100 + "%");
    item.style.setProperty("--size", 13 + Math.random() * 18 + "px");
    item.style.setProperty("--color", randomSymbol.color);
    item.style.setProperty("--duration", 12 + Math.random() * 15 + "s");
    item.style.setProperty("--delay", -Math.random() * 25 + "s");
    item.style.setProperty("--drift", -60 + Math.random() * 120 + "px");
    item.style.setProperty("--opacity", 0.3 + Math.random() * 0.5);

    fallingLayer.appendChild(item);
}

// Membuat dekorasi jatuh
if (
    fallingLayer &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
    const totalElements = window.innerWidth < 680 ? 18 : 30;

    for (let i = 0; i < totalElements; i++) {
        createFallingElement();
    }
}