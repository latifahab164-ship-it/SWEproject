const $ = (id) => document.getElementById(id);
const clubSelect = $("clubSelect"), skillSelect = $("skillSelect");
const clubs = [...new Set(ITEMS.map((i) => i.club))];

function fillSelect(sel, placeholder, values) {
  sel.innerHTML = `<option value="">${placeholder}</option>` + values.map((v) => `<option>${v}</option>`).join("");
}
fillSelect(clubSelect, "اختر النادي", clubs);
fillSelect(skillSelect, "اختر المهارة", SKILLS);

let results = ITEMS;

/* General search over every field of an opportunity, applied on top of the active filter. */
const norm = (s) => s.toLowerCase().replace(/[\u064B-\u0652\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
const haystack = (i) => norm([i.title, i.club, i.semester, i.mode, i.location || "", i.tasks, i.skills.join(" "), i.hours + " ساعة"].join(" "));

function render() {
  const q = norm(searchBox.value.trim());
  const shown = q ? results.filter((i) => q.split(/\s+/).every((w) => haystack(i).includes(w))) : results;
  $("emptyMessage").hidden = shown.length > 0;
  $("emptyMessage").textContent = q ? "لا توجد نتائج مطابقة لبحثك." : "لا يوجد فرص متاحة، نقدّر اهتمامك!";
  $("cards").innerHTML = shown.map(cardHTML).join("");
}

function setOption(option) {
  document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.option === option));
  clubSelect.hidden = option !== "club";
  skillSelect.hidden = option !== "skill";
  if (option === "all") results = ITEMS;
  if (option === "now") results = ITEMS.filter((i) => i.deadline.getTime() >= Date.now());
  if (option === "club") { clubSelect.value = ""; }
  if (option === "skill") { skillSelect.value = ""; }
  render();
}

document.querySelectorAll(".chip").forEach((c) => c.addEventListener("click", () => setOption(c.dataset.option)));
clubSelect.addEventListener("change", () => { if (clubSelect.value) { results = ITEMS.filter((i) => i.club === clubSelect.value); render(); } });
skillSelect.addEventListener("change", () => { if (skillSelect.value) { results = ITEMS.filter((i) => i.skills.includes(skillSelect.value)); render(); } });

render();
searchBox.addEventListener("input", render);
