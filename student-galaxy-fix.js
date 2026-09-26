// Tannu Sir's Kids Digital Academy
// Student Galaxy hotfix v11.1
// Purpose: show active enrolled students to a VALID logged-in admin,
// show safe same-class roster to a logged-in student,
// and keep private students hidden from ordinary public visitors.

(function () {
  const GALAXY_FIX_VERSION = "11.2-public-enrollment-cards";
  const API_BASE = "https://brightbyte-kids-api.tanweerstudy25.workers.dev";

  const get = (id) => document.getElementById(id);

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  function renderGalaxy(rows) {
    const grid = get("studentGrid");
    if (!grid) return;

    if (!rows.length) {
      grid.innerHTML = `
        <article class="student-card">
          <div class="student-top">
            <div class="student-photo">🎓</div>
            <div>
              <h3>No learners to show yet</h3>
              <small>Student Galaxy</small>
            </div>
          </div>
          <p>Enrolled private students stay protected unless an Admin or Student is signed in.</p>
        </article>`;
      return;
    }

    grid.innerHTML = rows.map((s, i) => {
      const publicDetails = s.publicCard
        ? `
          <p><b>Guardian:</b> ${escapeHtml(s.guardian || "Not provided")}</p>
          <p><b>🎓 Enrolled Student</b></p>`
        : `
          <div class="progress">
            <i style="width:${Math.min(100, Number(s.progress || 0))}%"></i>
          </div>
          <p><b>Progress:</b> ${Number(s.progress || 0)}%</p>
          <p><b>Track:</b> ${escapeHtml(s.focus || "90-Day Digital + English + Confidence Program")}</p>
          ${
            s.self
              ? "<p><b>🔒 My Private Profile</b></p>"
              : s.admin
                ? "<p><b>🔒 Admin View</b></p>"
                : s.demo
                  ? "<p><b>Demo Student</b></p>"
                  : ""
          }`;

      return `
        <article class="student-card">
          <div class="student-top">
            <div class="student-photo" id="sg-photo-${i}">
              ${s.photoUrl ? `<img src="${escapeHtml(s.photoUrl)}" alt="">` : (s.photo || "🧒")}
            </div>
            <div>
              <h3>${escapeHtml(s.name)}</h3>
              <small>${escapeHtml(s.cls)}</small>
            </div>
          </div>
          ${publicDetails}
        </article>`;
    }).join("");
  }

  async function hydrateAdminPhotos(rows, token) {
    for (let i = 0; i < rows.length; i++) {
      const s = rows[i];
      if (!s.userId || !s.hasPhoto) continue;

      try {
        const response = await fetch(
          `${API_BASE}/api/admin/students/${s.userId}/photo`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store"
          }
        );

        if (!response.ok) continue;

        const blobUrl = URL.createObjectURL(await response.blob());
        const holder = get(`sg-photo-${i}`);
        if (holder) {
          holder.innerHTML = `<img src="${blobUrl}" alt="${escapeHtml(s.name)}">`;
        }
      } catch (_) {}
    }
  }

  async function hydrateStudentPhotos(rows, token) {
    for (let i = 0; i < rows.length; i++) {
      const s = rows[i];
      if (!s.userId || !s.hasPhoto) continue;

      try {
        const response = await fetch(
          `${API_BASE}/api/student/roster/${s.userId}/photo`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store"
          }
        );

        if (!response.ok) continue;

        const blobUrl = URL.createObjectURL(await response.blob());
        const holder = get(`sg-photo-${i}`);
        if (holder) {
          holder.innerHTML = `<img src="${blobUrl}" alt="${escapeHtml(s.name)}">`;
        }
      } catch (_) {}
    }
  }

  async function loadStudentGalaxyFixed() {
    const grid = get("studentGrid");
    if (!grid) return;

    const adminToken = localStorage.getItem("brightbyte_admin_token") || "";
    const studentToken = localStorage.getItem("brightbyte_student_token") || "";

    // 1) ADMIN VIEW FIRST.
    // If Admin is logged in, all active enrolled students are shown,
    // even when their profile is Private. This remains an authenticated admin-only view.
    if (adminToken) {
      try {
        const auth = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${adminToken}` },
          cache: "no-store"
        });

        if (auth.ok) {
          const authData = await auth.json();

          if (authData.role === "admin") {
            const response = await fetch(`${API_BASE}/api/admin/students`, {
              headers: { Authorization: `Bearer ${adminToken}` },
              cache: "no-store"
            });

            if (response.ok) {
              const data = await response.json();

              const rows = (data.students || [])
                .filter((x) => x.status === "active")
                .map((x) => ({
                  name: x.display_name || x.username || "Student",
                  cls: `Class ${x.class_number || 1}`,
                  progress: Number(x.progress_percent || 0),
                  focus: x.training_track || "90-Day Digital + English + Confidence Program",
                  photo: "🧒",
                  userId: x.user_id,
                  hasPhoto: Boolean(x.has_photo),
                  admin: true
                }));

              renderGalaxy(rows);
              await hydrateAdminPhotos(rows, adminToken);

              console.info(
                `[Student Galaxy ${GALAXY_FIX_VERSION}] Admin view loaded:`,
                rows.length
              );
              return;
            }
          }
        }

        // Token is no longer valid. Do not silently keep a broken admin session.
        localStorage.removeItem("brightbyte_admin_token");
      } catch (error) {
        console.warn("[Student Galaxy] Admin roster error:", error);
      }
    }

    // 2) STUDENT VIEW.
    // Logged-in students see only the safe roster returned by the Worker,
    // such as same-class students, according to backend privacy rules.
    if (studentToken) {
      try {
        const auth = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${studentToken}` },
          cache: "no-store"
        });

        if (auth.ok) {
          const authData = await auth.json();

          if (authData.role === "student") {
            const response = await fetch(`${API_BASE}/api/student/roster`, {
              headers: { Authorization: `Bearer ${studentToken}` },
              cache: "no-store"
            });

            if (response.ok) {
              const data = await response.json();

              const rows = (data.students || []).map((x) => ({
                name: x.display_name || "Student",
                cls: `Class ${x.class_number || 1}`,
                progress: Number(x.progress_percent || 0),
                focus: x.training_track || "90-Day Digital + English + Confidence Program",
                photo: "🧒",
                userId: x.user_id,
                hasPhoto: Boolean(x.has_photo),
                self: Boolean(x.is_self)
              }));

              renderGalaxy(rows);
              await hydrateStudentPhotos(rows, studentToken);

              const pill = get("studentSessionPill");
              if (pill) {
                pill.hidden = false;
                pill.textContent = `👋 Hi ${authData.profile?.display_name || "Student"} • Continue Learning`;
                pill.href = "student-profile.html";
              }

              console.info(
                `[Student Galaxy ${GALAXY_FIX_VERSION}] Student roster loaded:`,
                rows.length
              );
              return;
            }
          }
        }

        localStorage.removeItem("brightbyte_student_token");
      } catch (error) {
        console.warn("[Student Galaxy] Student roster error:", error);
      }
    }

    // 3) PUBLIC VIEW.
    // Never expose private child profiles to ordinary visitors.
    try {
      const response = await fetch(`${API_BASE}/api/students/public`, {
        cache: "no-store"
      });

      if (response.ok) {
        const data = await response.json();

        const publicRows = (data.students || []).map((x) => ({
          name: x.display_name || "Student",
          cls: `Class ${x.class_number || 1}`,
          guardian: x.guardian_name || "",
          photoUrl: x.photo_url || "",
          publicCard: true
        }));

        if (publicRows.length) {
          renderGalaxy(publicRows);
          return;
        }
      }
    } catch (_) {}

    // Public fallback demo only when there are no approved public learners.
    renderGalaxy([{
      name: "Zen Alpha",
      cls: "Class 1",
      progress: 20,
      focus: "90-Day Digital Explorer",
      photo: "🧒",
      demo: true
    }]);
  }

  // Replace the old function when possible.
  try {
    window.loadStudents = loadStudentGalaxyFixed;
  } catch (_) {}

  // Run after the existing deferred academy script has finished.
  function refresh() {
    setTimeout(loadStudentGalaxyFixed, 80);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh, { once: true });
  } else {
    refresh();
  }

  // Refresh when returning from Admin/Student pages or when login state changes in another tab.
  window.addEventListener("pageshow", refresh);
  window.addEventListener("focus", refresh);
  window.addEventListener("storage", (event) => {
    if (
      event.key === "brightbyte_admin_token" ||
      event.key === "brightbyte_student_token"
    ) {
      refresh();
    }
  });

  window.TANNU_STUDENT_GALAXY_FIX_VERSION = GALAXY_FIX_VERSION;
})();
