const $ = (id) => document.getElementById(id);

const clubSelect = $("clubSelect");
const skillSelect = $("skillSelect");

const clubs = [...new Set(ITEMS.map((i) => i.club))];


/* =========================================================
   STUDENT DEMO DATA

   مؤقتاً فقط للـ Front-end.
   لاحقاً تأتي هذه البيانات من الطالب المسجل دخوله.
========================================================= */

const CURRENT_STUDENT = {
  id: "4412345678",
  name: "وجود",
  major: "تقنية المعلومات",
  email: "student@ksu.edu.sa",
  volunteerHours: 32,

  achievements: [
    {
      activity: "تنظيم ملتقى التقنية",
      club: "نادي تقنية المستقبل",
      date: "10 أكتوبر 2026"
    },

    {
      activity: "المشاركة في معرض المشاريع",
      club: "نادي ضياء",
      date: "25 سبتمبر 2026"
    }
  ]
};


/* =========================================================
   SELECT OPTIONS
========================================================= */

function fillSelect(sel, placeholder, values) {

  sel.innerHTML =
    `<option value="">${placeholder}</option>` +
    values
      .map((v) => `<option>${v}</option>`)
      .join("");
}


fillSelect(
  clubSelect,
  "اختر النادي",
  clubs
);


fillSelect(
  skillSelect,
  "اختر المهارة",
  SKILLS
);


let results = ITEMS;


/* =========================================================
   SEARCH
========================================================= */

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");


const haystack = (i) =>
  norm(
    [
      i.title,
      i.club,
      i.semester,
      i.mode,
      i.location || "",
      i.tasks,
      i.skills.join(" "),
      i.hours + " ساعة"
    ].join(" ")
  );


/* =========================================================
   APPLICATION STORAGE
========================================================= */

function getApplications() {

  try {

    return JSON.parse(
      localStorage.getItem("merasApplications")
    ) || [];

  } catch (error) {

    return [];

  }

}


function saveApplications(applications) {

  localStorage.setItem(
    "merasApplications",
    JSON.stringify(applications)
  );

}


/* =========================================================
   CHECK IF STUDENT ALREADY APPLIED
========================================================= */

function hasApplied(opportunityTitle, clubName) {

  const applications = getApplications();

  return applications.some(
    (application) =>
      application.studentId === CURRENT_STUDENT.id &&
      application.opportunityTitle === opportunityTitle &&
      application.club === clubName
  );

}


/* =========================================================
   MERAS APPLY POPUP
========================================================= */

const applyModal = $("applyModal");
const successModal = $("successModal");

const applyOpportunityTitle = $("applyOpportunityTitle");
const applyOpportunityClub = $("applyOpportunityClub");

const confirmApply = $("confirmApply");
const cancelApply = $("cancelApply");
const closeSuccess = $("closeSuccess");

let selectedOpportunity = null;


/* =========================================================
   OPEN APPLICATION POPUP
========================================================= */

function applyForOpportunity(item) {

  if (item.deadline.getTime() < Date.now()) {
    return;
  }


  if (
    hasApplied(
      item.title,
      item.club
    )
  ) {
    return;
  }


  selectedOpportunity = item;


  applyOpportunityTitle.textContent =
    item.title;


  applyOpportunityClub.textContent =
    item.club;


  applyModal.classList.add("show");

  applyModal.setAttribute(
    "aria-hidden",
    "false"
  );
}


/* =========================================================
   CLOSE APPLICATION POPUP
========================================================= */

function closeApplyModal() {

  applyModal.classList.remove("show");

  applyModal.setAttribute(
    "aria-hidden",
    "true"
  );

  selectedOpportunity = null;
}


cancelApply.addEventListener(
  "click",
  closeApplyModal
);


/* =========================================================
   CONFIRM APPLICATION
========================================================= */

confirmApply.addEventListener(
  "click",
  function () {

    if (!selectedOpportunity) {
      return;
    }


    /*
      Check again before saving
      to prevent duplicate applications.
    */

    if (
      hasApplied(
        selectedOpportunity.title,
        selectedOpportunity.club
      )
    ) {

      closeApplyModal();

      return;
    }


    const applications =
      getApplications();


    const newApplication = {

      /* Application */

      id:
        "APP-" +
        Date.now(),

      type:
        "opportunity",

      status:
        "pending",

      submittedAt:
        new Date().toISOString(),


      /* Opportunity */

      opportunityTitle:
        selectedOpportunity.title,

      club:
        selectedOpportunity.club,

      semester:
        selectedOpportunity.semester,

      mode:
        selectedOpportunity.mode,

      location:
        selectedOpportunity.location || "",

      hours:
        selectedOpportunity.hours,

      skills:
        selectedOpportunity.skills,

      seats:
        selectedOpportunity.seats,

      tasks:
        selectedOpportunity.tasks,

      deadline:
        selectedOpportunity.deadline.toISOString(),


      /* Student */

      studentId:
        CURRENT_STUDENT.id,

      studentName:
        CURRENT_STUDENT.name,

      studentMajor:
        CURRENT_STUDENT.major,

      studentEmail:
        CURRENT_STUDENT.email,

      volunteerHours:
        CURRENT_STUDENT.volunteerHours,

      achievements:
        CURRENT_STUDENT.achievements

    };


    applications.push(
      newApplication
    );


    saveApplications(
      applications
    );


    /* Close confirmation popup */

    applyModal.classList.remove("show");

    applyModal.setAttribute(
      "aria-hidden",
      "true"
    );


    /* Update card to "تم التقديم" */

    render();


    /* Show Meras success popup */

    successModal.classList.add("show");

    successModal.setAttribute(
      "aria-hidden",
      "false"
    );


    selectedOpportunity = null;

  }
);


/* =========================================================
   CLOSE SUCCESS POPUP
========================================================= */

closeSuccess.addEventListener(
  "click",
  function () {

    successModal.classList.remove("show");

    successModal.setAttribute(
      "aria-hidden",
      "true"
    );

  }
);


/* =========================================================
   CLOSE POPUP WHEN CLICKING OUTSIDE
========================================================= */

applyModal.addEventListener(
  "click",
  function (event) {

    if (event.target === applyModal) {
      closeApplyModal();
    }

  }
);


successModal.addEventListener(
  "click",
  function (event) {

    if (event.target === successModal) {

      successModal.classList.remove("show");

      successModal.setAttribute(
        "aria-hidden",
        "true"
      );

    }

  }
);


/* =========================================================
   RENDER
========================================================= */

function render() {

  const q =
    norm(
      searchBox.value.trim()
    );


  const shown =
    q

      ? results.filter(
          (i) =>
            q
              .split(/\s+/)
              .every(
                (w) =>
                  haystack(i).includes(w)
              )
        )

      : results;


  $("emptyMessage").hidden =
    shown.length > 0;


  $("emptyMessage").textContent =
    q
      ? "لا توجد نتائج مطابقة لبحثك."
      : "لا يوجد فرص متاحة، نقدّر اهتمامك!";


  $("cards").innerHTML =
    shown
      .map(cardHTML)
      .join("");

}


/* =========================================================
   FILTER
========================================================= */

function setOption(option) {

  document
    .querySelectorAll(".chip")
    .forEach(
      (c) =>
        c.classList.toggle(
          "active",
          c.dataset.option === option
        )
    );


  clubSelect.hidden =
    option !== "club";


  skillSelect.hidden =
    option !== "skill";


  if (option === "all") {

    results = ITEMS;

  }


  if (option === "now") {

    results =
      ITEMS.filter(
        (i) =>
          i.deadline.getTime() >=
          Date.now()
      );

  }


  if (option === "club") {

    clubSelect.value = "";

  }


  if (option === "skill") {

    skillSelect.value = "";

  }


  render();

}


/* =========================================================
   FILTER EVENTS
========================================================= */

document
  .querySelectorAll(".chip")
  .forEach(
    (c) =>
      c.addEventListener(
        "click",
        () =>
          setOption(
            c.dataset.option
          )
      )
  );


clubSelect.addEventListener(
  "change",
  () => {

    if (clubSelect.value) {

      results =
        ITEMS.filter(
          (i) =>
            i.club ===
            clubSelect.value
        );

      render();

    }

  }
);


skillSelect.addEventListener(
  "change",
  () => {

    if (skillSelect.value) {

      results =
        ITEMS.filter(
          (i) =>
            i.skills.includes(
              skillSelect.value
            )
        );

      render();

    }

  }
);


/* =========================================================
   APPLY BUTTON
========================================================= */

$("cards").addEventListener(
  "click",
  function (event) {

    const applyButton =
      event.target.closest(
        ".apply[data-index]"
      );


    if (!applyButton) {
      return;
    }


    event.preventDefault();


    if (
      applyButton.classList.contains(
        "applied"
      )
    ) {
      return;
    }


    const index =
      Number(
        applyButton.dataset.index
      );


    const item =
      ITEMS[index];


    if (!item) {
      return;
    }


    applyForOpportunity(
      item
    );

  }
);


/* =========================================================
   INITIAL
========================================================= */

render();


searchBox.addEventListener(
  "input",
  render
);
