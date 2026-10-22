/* Front-end only demo of accounts (no server): accounts live in localStorage.
   Rules come from the project report (registration, login, forgot password). */
(function () {
  var USERS_KEY = "meras_users", SESSION_KEY = "meras_session";

  function load() { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch (e) { return []; } }
  function save(u) { try { localStorage.setItem(USERS_KEY, JSON.stringify(u)); } catch (e) {} }
  function toLatin(s) { // Arabic-Indic digits -> 0-9
    return String(s).replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 1632; })
                    .replace(/[۰-۹]/g, function (d) { return d.charCodeAt(0) - 1776; });
  }
  function $(id) { return document.getElementById(id); }

  function setError(input, msg) {
    var f = input.closest(".auth-field");
    var e = f.querySelector(".auth-error");
    if (msg) {
      f.classList.add("invalid");
      if (!e) { e = document.createElement("p"); e.className = "auth-error"; f.appendChild(e); }
      e.textContent = msg;
    } else {
      f.classList.remove("invalid");
      if (e) e.remove();
    }
    return !msg;
  }

  function banner(box, type, text) {
    box.className = "auth-msg " + type;
    box.textContent = text;
    box.hidden = false;
  }

  document.querySelectorAll(".pass-toggle").forEach(function (b) {
    b.addEventListener("click", function () {
      var i = b.parentNode.querySelector("input");
      var show = i.type === "password";
      i.type = show ? "text" : "password";
      b.textContent = show ? "إخفــاء" : "إظهــار";
    });
  });

  var V = {
    required: function (v, label) { return v ? "" : "الرجاء إدخال " + label + "."; },
    uid: function (v) { return !v ? "الرجاء إدخال الرقم الجامعي." : /^\d{9}$/.test(v) ? "" : "الرقم الجامعي يتكوّن من 9 أرقام."; },
    phone: function (v) { return !v ? "الرجاء إدخال رقم الجوال." : /^05\d{8}$/.test(v) ? "" : "رقم الجوال غير صحيح، مثال: 0501234567."; },
    email: function (v) { return !v ? "الرجاء إدخال البريد الإلكتروني." : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "صيغة البريد الإلكتروني غير صحيحة."; },
    pass: function (v) { return !v ? "الرجاء إدخال كلمة المرور." : v.length >= 8 ? "" : "كلمة المرور يجب ألا تقل عن 8 أحرف."; }
  };

  /* ---------- Registration ---------- */
  var reg = $("registerForm");
  if (reg) {
    reg.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = reg.elements, box = $("formMsg");
      box.hidden = true;
      var name = f.fullName.value.trim(), uid = toLatin(f.uid.value.trim()),
          phone = toLatin(f.phone.value.trim()), major = f.major.value.trim(),
          email = f.email.value.trim().toLowerCase(), pw = f.password.value, pw2 = f.confirm.value;
      var users = load();

      var ok = true;
      ok = setError(f.fullName, V.required(name, "الاسم الكامل")) && ok;
      var uidErr = V.uid(uid);
      if (!uidErr && users.some(function (u) { return u.uid === uid; })) uidErr = "الرقم الجامعي مسجّل مسبقًا.";
      ok = setError(f.uid, uidErr) && ok;
      ok = setError(f.phone, V.phone(phone)) && ok;
      ok = setError(f.major, V.required(major, "التخصص")) && ok;
      var emErr = V.email(email);
      if (!emErr && users.some(function (u) { return u.email === email; })) emErr = "البريد الإلكتروني مسجّل مسبقًا.";
      ok = setError(f.email, emErr) && ok;
      ok = setError(f.password, V.pass(pw)) && ok;
      var cErr = !pw2 ? "الرجاء تأكيد كلمة المرور." : (pw2 !== pw ? "كلمة المرور وتأكيدها غير متطابقتين." : "");
      ok = setError(f.confirm, cErr) && ok;

      if (!ok) { banner(box, "error", "الرجاء تصحيح الحقول المحدّدة أدناه."); return; }

      users.push({ name: name, uid: uid, phone: phone, major: major, email: email, password: pw });
      save(users);
      banner(box, "ok", "تم إنشاء حسابك بنجاح! سيتم تحويلك إلى صفحة تسجيل الدخول…");
      reg.querySelector(".auth-btn").disabled = true;
      setTimeout(function () { location.href = "login.html?registered=1"; }, 1600);
    });
  }

  /* ---------- Login ---------- */
  var login = $("loginForm");
  if (login) {
    var box = $("formMsg");
    if (/registered=1/.test(location.search)) banner(box, "ok", "تم إنشاء حسابك، سجّل دخولك الآن.");

    login.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = login.elements;
      var uid = toLatin(f.uid.value.trim()), pw = f.password.value;
      box.hidden = true;
      var ok = true;
      ok = setError(f.uid, uid ? "" : "الرجاء إدخال الرقم الجامعي.") && ok;
      ok = setError(f.password, pw ? "" : "الرجاء إدخال كلمة المرور.") && ok;
      if (!ok) return;

      var user = load().filter(function (u) { return u.uid === uid && u.password === pw; })[0];
      if (!user) { banner(box, "error", "الرقم الجامعي أو كلمة المرور غير صحيحة."); return; }
      try { localStorage.setItem(SESSION_KEY, user.uid); } catch (e) {}
      location.href = "home.html";
    });

    /* ---------- Forgot password ---------- */
    var forgot = $("forgotForm");
    var step1 = $("forgotStep1"), step2 = $("forgotStep2"), target = null;
    $("showForgot").addEventListener("click", function () {
      login.hidden = true; forgot.hidden = false; box.hidden = true;
    });
    $("backToLogin").addEventListener("click", function () {
      forgot.hidden = true; login.hidden = false; box.hidden = true;
      step1.hidden = false; step2.hidden = true; forgot.reset();
    });

    forgot.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = forgot.elements;
      box.hidden = true;
      if (!target) {
        var email = f.femail.value.trim().toLowerCase();
        var err = V.email(email);
        if (!setError(f.femail, err)) return;
        var u = load().filter(function (x) { return x.email === email; })[0];
        if (!u) { setError(f.femail, "هذا البريد الإلكتروني غير مسجّل لدينا."); return; }
        target = u.uid;
        step1.hidden = true; step2.hidden = false;
        return;
      }
      var pw = f.newPassword.value, pw2 = f.newConfirm.value, ok = true;
      ok = setError(f.newPassword, V.pass(pw)) && ok;
      ok = setError(f.newConfirm, !pw2 ? "الرجاء تأكيد كلمة المرور." : (pw2 !== pw ? "كلمة المرور وتأكيدها غير متطابقتين." : "")) && ok;
      if (!ok) return;
      var users = load();
      users.forEach(function (x) { if (x.uid === target) x.password = pw; });
      save(users);
      target = null; forgot.reset();
      step1.hidden = false; step2.hidden = true;
      forgot.hidden = true; login.hidden = false;
      banner(box, "ok", "تم تغيير كلمة المرور بنجاح، سجّل دخولك بكلمة المرور الجديدة.");
    });
  }
})();
