/* Shared header and footer. Edit them here once and every page changes.
   A page picks its menu with:  <body data-role="student" data-page="home">  */
(function () {
  var role = document.body.dataset.role || "student";
  var page = document.body.dataset.page || "";

  var NAV = {
    student: [
      ["home", "الرئيســية", "home.html"],
      ["opportunities", "الفــرص", "opportunities.html"],
      ["clubs", "الأنــدية", "#"],
      ["requests", "طلبــاتي", "#"],
      ["profile", "الملــف الشخصــي", "#"]
    ],
    club: [
      ["home", "الرئيســية", "clubAdmin.html"],
      ["manage-opportunities", "إدارة الفــرص", "#"],
      ["manage-requests", "إدارة الطلبــات", "#"],
      ["posts", "المنشــورات", "#"],
      ["achievements", "توثيــق الإنجــازات", "#"],
      ["club-info", "معلومــات النــادي", "#"]
    ]
  };

  var homeHref = role === "club" ? "clubAdmin.html" : "home.html";

  var links = NAV[role].map(function (l) {
    return '<a href="' + l[2] + '"' + (l[0] === page ? ' class="active"' : "") + ">" + l[1] + "</a>";
  }).join("");

  var header = document.getElementById("site-header");
  if (header) {
    header.innerHTML =
      '<a href="' + homeHref + '" class="logo"><img src="logoMeras.png" alt="شعار مِراس"></a>' +
      '<button type="button" class="menu-btn" aria-label="القائمة" aria-expanded="false" aria-controls="nav">' +
      "<span></span><span></span><span></span></button>" +
      '<nav class="nav" id="nav">' + links + '<a href="#" class="logout">تسجيــل الخــروج</a></nav>';

    var btn = header.querySelector(".menu-btn");
    var nav = header.querySelector(".nav");
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
  }

  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML =
      '<div class="footer-top">' +
      '<div class="footer-brand"><div class="footer-title">' +
      '<img src="sunMeras.png" alt="شمس مِراس" class="footer-sun"><h2>مِـــراس</h2></div>' +
      "<p>منصة تجمع طلاب جامعة الملك سعود بالأندية والفرص الجامعية.</p></div>" +
      '<nav class="footer-links" aria-label="روابط سريعة">' +
      '<a href="' + homeHref + '">الرئيســية</a><a href="opportunities.html">الفــرص</a><a href="#">الأنــدية</a><a href="about.html">عــن مِــراس</a></nav>' +
      "</div>" +
      '<p class="copyright">© 2026 مِراس. جميع الحقوق محفوظة.</p>';
  }
})();
