const params = new URLSearchParams(location.search);
/* Club profile page. Reads ?id=dhiaa from the address and fills the page from clubs-data.js.
   (Posts are rendered by feed.js, which reads <body data-club>.) */
const club = clubById(params.get("id"));
const $c = (id) => document.getElementById(id);

/* Back: links into this page add &from=home or &from=clubs. Back returns there (restoring the scroll position);
   opened directly (no "from"), it goes to the clubs list. */
const from = params.get("from");
const backHref = from === "home" ? "home.html" : "clubs.html";
$c("backBtn").href = backHref;
$c("backBtn").addEventListener("click", (e) => {
  if (from && history.length > 1) { e.preventDefault(); history.back(); }
});

if (!club) {
  document.body.dataset.club = "none";
  document.querySelectorAll(".profile, .tabs, .panel").forEach((e) => { e.hidden = true; });
  document.querySelector(".club-page").insertAdjacentHTML("beforeend",
    '<div class="not-found"><h1>لم نجد هذا النادي</h1><a href="home.html">العودة للرئيســية</a></div>');
} else {
  document.title = "مِراس - " + club.name;
  document.body.dataset.club = club.id;

  $c("profile").innerHTML = `
    <div class="profile-cover${club.cover ? " has-image" : ""}"${club.cover ? ` style="background-image:url('${club.cover}')"` : ""}></div>
    <div class="profile-body">
      <span class="profile-logo"><img src="${club.logo}" alt=""></span>
      <h1>${club.styled || club.name}</h1>
      ${club.founded ? `<p class="profile-founded">تأسس عام ${club.founded}</p>` : ""}
      ${club.bio ? `<p class="profile-bio">${club.bio}</p>` : ""}
    </div>`;

  /* Opportunities tab: this club's opportunities that are still open. */
  const open = ITEMS.filter((i) => i.club === club.name && i.deadline.getTime() >= now);
  $c("oppsEmpty").hidden = open.length > 0;
  $c("cards").innerHTML = open.map(cardHTML).join("");

  /* Structure tab */
  $c("panel-structure").innerHTML = club.structure
    ? `<a class="structure" href="${club.structure}" target="_blank" rel="noopener"><img src="${club.structure}" alt="${club.structureAlt || "هيكلة النادي"}"></a>`
    : '<p class="empty">لم تُضف هيكلة هذا الفصل بعد.</p>';

  /* Tabs */
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((t) => t.addEventListener("click", () => {
    tabs.forEach((x) => { const on = x === t; x.classList.toggle("active", on); x.setAttribute("aria-selected", on); });
    ["posts", "opps", "structure"].forEach((n) => { $c("panel-" + n).hidden = n !== t.dataset.tab; });
  }));
}
