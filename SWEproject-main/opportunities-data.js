/* Sample data only: clubs, skills and opportunities below are placeholders for the design. */
const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();
const at = (days, hour = 16, min = 0) => { const d = new Date(now + days * DAY); d.setHours(hour, min, 0, 0); return d; };

const SKILLS = ["التصميم", "البرمجة", "الكتابة", "الإعلام والتصوير", "التنظيم والقيادة"];

const ALL_ITEMS = [
  { type: "فرصة", title: "عضو فريق التصميم", club: "نادي ضياء", semester: "الفصل الأول", mode: "عن بعد",
    hours: 40, deadline: at(5, 23, 59), skills: ["التصميم"], seats: 5,
    tasks: "تصميم شعارات وهويات بصرية لفعاليات النادي، وإعداد مواد التواصل الاجتماعي." },
  { type: "فرصة", title: "عضو فريق الرياضات الإلكترونية", club: "النادي الرياضي بكلية علوم الحاسب والمعلومات", semester: "الفصل الأول", mode: "حضوري",
    location: "مقر النادي الرياضي", hours: 30, deadline: at(8, 23, 59), skills: ["التنظيم والقيادة"], seats: 6,
    tasks: "تنظيم بطولات الألعاب الإلكترونية والتنسيق مع المشاركين." },
  { type: "فرصة", title: "محرر محتوى", club: "نادي ضياء", semester: "الفصل الأول", mode: "عن بعد",
    hours: 20, deadline: at(14, 12, 0), skills: ["الكتابة"], seats: 4,
    tasks: "كتابة أخبار النادي ومراجعتها ونشرها على حساباته." },
  { type: "فرصة", title: "عضو اللجنة التقنية", club: "نادي تقنية المستقبل", semester: "الفصل الأول", mode: "حضوري",
    location: "مبنى 9، مختبر الحاسب", hours: 25, deadline: at(-2, 23, 59), skills: ["البرمجة"], seats: 3,
    tasks: "تطوير الأدوات والصفحات التقنية للنادي وصيانتها خلال الفصل." },
  { type: "فرصة", title: "عضو لجنة الموارد البشرية", club: "نادي الصيدلة", semester: "الفصل الأول", mode: "عن بعد",
    hours: 20, deadline: at(12, 18, 0), skills: ["التنظيم والقيادة"], seats: 3,
    tasks: "متابعة أعضاء النادي وتنظيم توزيعهم على اللجان." },
  { type: "فرصة", title: "عضو فريق الجلسات الحوارية", club: "نادي التسويق", semester: "الفصل الأول", mode: "عن بعد",
    hours: 15, deadline: at(9, 20, 0), skills: ["الإعلام والتصوير"], seats: 4,
    tasks: "الإعداد للجلسات الحوارية وإدارتها وتوثيقها." }
];

/* The opportunities page lists only opportunities; one-day activities appear as posts on the home page. */
const ITEMS = ALL_ITEMS.filter((i) => i.type === "فرصة");

/* Deadline shown in both calendars (Gregorian + Hijri) with the closing time. */
const fmtTime = new Intl.DateTimeFormat("ar-SA-u-nu-latn", { hour: "numeric", minute: "2-digit" });
const gregorian = new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", { day: "numeric", month: "long", year: "numeric" });
const hijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura-nu-latn", { day: "numeric", month: "long", year: "numeric" });
const dateParts = (fmt, d) => Object.fromEntries(fmt.formatToParts(d).filter((p) => p.type !== "literal").map((p) => [p.type, p.value]));
function deadlineDates(d) {
  const g = dateParts(gregorian, d), h = dateParts(hijri, d);
  return `${g.day} ${g.month} ${g.year}م · ${h.day} ${h.month} ${h.year}هـ`;
}

/* One opportunity card. Used by the opportunities page and by each club page. */
function cardHTML(i) {
    const open = i.deadline.getTime() >= now;
    const kind = i.type === "فرصة" ? "opp" : "act";
    return `
    <article class="card">
      <div class="card-top">
        <span class="badge ${kind}">${i.type}</span>
        <span class="mode">${i.mode}</span>
      </div>
      <h3>${i.title}</h3>
      <p class="club">${i.club} · ${i.semester}</p>
      <ul class="meta">
        <li><b>الساعات التطوعية:</b> ${i.hours} ساعة</li>
        <li><b>آخر موعد للتسجيل:</b> ${deadlineDates(i.deadline)}</li>
        <li><b>وقت الإغلاق:</b> ${fmtTime.format(i.deadline)}</li>
      </ul>
      <details>
        <summary>التفاصيــل</summary>
        <div class="more">
          <p><b>أبرز المهام:</b> ${i.tasks}</p>
          ${i.location ? `<p><b>الموقع:</b> ${i.location}</p>` : ""}
          <p><b>المهارات:</b> ${i.skills.join("، ")}</p>
          <p><b>عدد المقاعد:</b> ${i.seats}</p>
        </div>
      </details>
      ${open ? `<a href="#" class="apply">قــدّم الآن</a>` : `<span class="apply closed">انتهــى التسجيــل</span>`}
    </article>`;
}
