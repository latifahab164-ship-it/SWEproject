/* Clubs list page: shows every club account from clubs-data.js, with a name search. */
const grid = document.getElementById("clubsGrid");
const box = document.getElementById("searchBox");
const emptyMsg = document.getElementById("emptyMessage");
const norm = (s) => s.toLowerCase().replace(/[ً-ْـ]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");

function render() {
  const q = norm(box.value.trim());
  const shown = CLUBS.filter((c) => !q || q.split(/\s+/).every((w) => norm(c.name).includes(w)));
  emptyMsg.hidden = shown.length > 0;
  grid.innerHTML = shown.map((c) => `
    <a class="club-card" href="club.html?id=${c.id}&from=clubs">
      <span class="logo"><img src="${c.logo}" alt=""></span>
      <h3>${c.styled || c.name}</h3>
      <span class="view">عــرض الحســاب</span>
    </a>`).join("");
}

box.addEventListener("input", render);
render();
