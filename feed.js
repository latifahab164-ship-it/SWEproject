/* Club posts shown on the home page. To add a post, add one object to POSTS (newest first). */
const POSTS = [
  {
    club: "النادي الرياضي بكلية علوم الحاسب والمعلومات",
    clubId: "ccis",
    clubStyled: "النــادي الريــاضي بكليــة علــوم الحاســب والمعلومــات",
    text: "البطولة بانتظاركم…\nسجّلوا وكونوا جزء من المنافسة🎮💙",
    image: "images/ccis-roblox.jpg",
    imageAlt: "إعلان بطولة روبلوكس من النادي الرياضي بكلية علوم الحاسب والمعلومات",
    register: true,
    links: [],
    likes: 0,
    comments: []
  },
  {
    club: "نادي تقنية المستقبل",
    clubId: "ftc",
    clubStyled: "نــادي تقنيــة المستقبــل",
    text: "نادي تقنية المستقبل يعلن فتح باب الانضمام للفصل الدراسي الأول لعام ١٤٤٨هـ\n\nمساحة تجمعك بالمجتمع التقني، وتمنحك فرصة تجرّب، وتترك بصمتك من خلال تجربة مختلفة ومليئة بالفرص ✨\n\n🔴 آخر موعد للتقديم: نهاية يوم الأربعاء 26 أغسطس",
    image: "images/ftc-join.jpg",
    imageAlt: "إعلان فتح باب الانضمام لنادي تقنية المستقبل",
    register: true,
    links: [],
    likes: 0,
    comments: []
  },
  {
    club: "نادي ضياء",
    clubId: "dhiaa",
    clubStyled: "نــادي ضيــاء",
    text: "في سباقٍ تحكمه الدقائق، وتتتابع مـــراحله، وتتســارع فيه الخطى\n\nسَــنَــن | بدأ العــــدّ\n\n#مسابقة_ضياء_٤٨هـ",
    image: "images/dhiaa-sunan.jpg",
    imageAlt: "إعلان مسابقة سنن من نادي ضياء",
    register: true,
    links: [],
    likes: 0,
    comments: []
  },
  {
    club: "نادي ضياء",
    clubId: "dhiaa",
    clubStyled: "نــادي ضيــاء",
    text: "رِفَــــاد ☀️\nنـورٌ يُحيي الفُــؤاد\n#معرض_ضيـاء ٤٨هـ🤍",
    image: "images/dhiaa-rifad.jpg",
    imageAlt: "إعلان معرض رِفاد من نادي ضياء",
    links: [
      { label: "الريل على إنستقرام", url: "https://www.instagram.com/reel/DeXShOPolu0/?obrf=MTVmZXJkYTFpazg3aQ==" },
      { label: "الستوري على إنستقرام", url: "https://www.instagram.com/stories/dhiaa_ksu/4007145674184866488?utm_source=ig_story_item_share&cplk=MTJpNGVsM2dsb2d3cw==" }
    ],
    likes: 0,
    comments: []
  },
  {
    club: "نادي ضياء",
    clubId: "dhiaa",
    clubStyled: "نــادي ضيــاء",
    text: "نسمــو بعـــزمٍ ســـائلين إلهنا\n\u200Fعونًا.. فمنه الفضل وهو الأكرمُ🌾\n\n\u200Fهـيكلة قيـَــادة نادي ضيـاء لـلفصل الدراسي الأول ٤٨هـ",
    image: "images/dhiaa-structure.jpg",
    imageAlt: "هيكلة قيادة نادي ضياء للفصل الدراسي الأول ٤٨هـ",
    links: [],
    likes: 0,
    comments: []
  }
];


const ICON_HEART = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.1C.9 8.6 2.7 5 6.2 5c2 0 3.3 1.1 3.8 2 .5-.9 1.8-2 3.8-2 3.5 0 5.3 3.600 3.800 6.900C19.500 16.400 12 21 12 21z"/></svg>';
const ICON_COMMENT = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M20 3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3v3.500L12 18h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>';

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const feed = document.getElementById("feed");
const clubsRow = document.getElementById("clubsRow");
/* On a club page (<body data-club="dhiaa">) only that club's posts are shown. */
const onlyClub = document.body.dataset.club || null;

function commentHTML(c) {
  return `<li class="comment"><span class="comment-author">${esc(c.author)}</span><span>${esc(c.text)}</span></li>`;
}

function postHTML(p, i) {
  const club = clubById(p.clubId);
  return `
  <article class="post" data-i="${i}">
    <header class="post-head">
      ${club ? `<a href="club.html?id=${club.id}&from=home" class="post-club"><img class="avatar" src="${club.logo}" alt=""><div class="post-meta"><strong>${esc(p.clubStyled || p.club)}</strong></div></a>` : `<span class="avatar">${esc(p.club.charAt(0))}</span><div class="post-meta"><strong>${esc(p.clubStyled || p.club)}</strong></div>`}
    </header>

    <p class="post-text">${esc(p.text)}</p>

    ${p.image ? `<a class="post-media" href="${p.image}" target="_blank" rel="noopener"><img src="${p.image}" alt="${esc(p.imageAlt || p.club)}" loading="lazy"></a>` : ""}

    ${(p.links && p.links.length) || p.register ? `<div class="post-links">${p.register ? `<a href="#" class="post-register">سجّــل الآن</a>` : ""}${(p.links || []).map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}</div>` : ""}

    <div class="actions">
      <button type="button" class="act like" aria-pressed="${p.liked ? "true" : "false"}">${ICON_HEART}<span>إعجــاب</span><b class="count">${p.likes || ""}</b></button>
      <button type="button" class="act comment-toggle" aria-expanded="false">${ICON_COMMENT}<span>تعليــق</span><b class="ccount">${p.comments.length || ""}</b></button>
    </div>

    <div class="comments" hidden>
      <ul class="comment-list">${p.comments.map(commentHTML).join("")}</ul>
      <form class="comment-form">
        <input type="text" placeholder="اكتب تعليقًا..." aria-label="اكتب تعليقًا" maxlength="300">
        <button type="submit">نشر</button>
      </form>
    </div>
  </article>`;
}

function renderFeed() {
  const shown = POSTS.map((p, i) => ({ p, i })).filter(({ p }) => !onlyClub || p.clubId === onlyClub);
  feed.innerHTML = shown.length
    ? shown.map(({ p, i }) => postHTML(p, i)).join("")
    : '<p class="empty">لا توجد منشورات بعد.</p>';
}

/* Home page: each club circle opens that club's page. */
function renderClubs() {
  if (!clubsRow) return;
  clubsRow.innerHTML = CLUBS.map((c) => `
    <a class="club-circle" href="club.html?id=${c.id}&from=home">
      <span class="ring"><img src="${c.logo}" alt=""></span>
      <span class="club-name">${c.short}</span>
    </a>`).join("");
}

renderClubs();
renderFeed();

feed.addEventListener("click", (e) => {
  const post = e.target.closest(".post");
  if (!post) return;
  const p = POSTS[post.dataset.i];

  const like = e.target.closest(".like");
  if (like) {
    const on = like.getAttribute("aria-pressed") !== "true";
    like.setAttribute("aria-pressed", on);
    p.liked = on;
    p.likes += on ? 1 : -1;
    like.querySelector(".count").textContent = p.likes || "";
  }

  const toggle = e.target.closest(".comment-toggle");
  if (toggle) {
    const box = post.querySelector(".comments");
    box.hidden = !box.hidden;
    toggle.setAttribute("aria-expanded", !box.hidden);
    if (!box.hidden) box.querySelector("input").focus();
  }
});

feed.addEventListener("submit", (e) => {
  e.preventDefault();
  const post = e.target.closest(".post");
  const input = e.target.querySelector("input");
  const text = input.value.trim();
  if (!text) return;
  const p = POSTS[post.dataset.i];
  const c = { author: "أنت", text };
  p.comments.push(c);
  post.querySelector(".comment-list").insertAdjacentHTML("beforeend", commentHTML(c));
  post.querySelector(".ccount").textContent = p.comments.length;
  input.value = "";
});
