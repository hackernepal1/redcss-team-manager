const profile = document.getElementById("profile");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadProfile() {
  if (!id) {
    profile.innerHTML = "<h1>Member not specified</h1>";
    return;
  }

  try {
    const response = await fetch(`/api/members/${encodeURIComponent(id)}`);
    const data = await response.json();

    if (!response.ok) {
      profile.innerHTML = "<h1>Member not found</h1>";
      return;
    }

    const m = data.member;

    document.title = `${m.name} | RedCSS`;

    const links = [
      ["GitHub", m.github],
      ["LinkedIn", m.linkedin],
      ["Facebook", m.facebook],
      ["Instagram", m.instagram],
      ["Portfolio", m.portfolio]
    ].filter(item => item[1]);

    profile.innerHTML = `
      <img
        class="profile-photo"
        src="${escapeHtml(m.photo || "https://via.placeholder.com/300")}"
        alt="${escapeHtml(m.name)}"
      >

      <p class="tag">${escapeHtml(m.memberId)}</p>

      <h1>${escapeHtml(m.name)}</h1>

      <h2>${escapeHtml(m.role)}</h2>

      <p>${escapeHtml(m.bio || "")}</p>

      <div class="details">
        <p><strong>Department:</strong> ${escapeHtml(m.department || "—")}</p>
        <p><strong>Email:</strong> ${escapeHtml(m.email || "—")}</p>
        <p><strong>Phone:</strong> ${escapeHtml(m.phone || "—")}</p>
        <p><strong>Location:</strong> ${escapeHtml(m.location || "—")}</p>
        <p><strong>Status:</strong> ${escapeHtml(m.status || "—")}</p>
      </div>

      <h3>Skills</h3>

      <div class="skills">
        ${(m.skills || [])
          .map(skill => `<span>${escapeHtml(skill)}</span>`)
          .join("")}
      </div>

      <div class="socials">
        ${links.map(([name, url]) => `
          <a
            class="button"
            href="${safeUrl(url)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${escapeHtml(name)} ↗
          </a>
        `).join("")}
      </div>
    `;

  } catch (error) {
    profile.innerHTML = "<h1>Unable to load profile</h1>";
  }
}

function safeUrl(value) {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "#";
    }

    return url.href.replaceAll('"', "%22");
  } catch {
    return "#";
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadProfile();
