const token = localStorage.getItem("redcss_admin_token");

if (!token) {
  window.location.href = "/login.html";
}

const form = document.getElementById("memberForm");
const membersContainer = document.getElementById("members");
const message = document.getElementById("message");

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("redcss_admin_token");
  window.location.href = "/login.html";
});

document.getElementById("cancelEdit").addEventListener("click", clearForm);

async function loadMembers() {
  const response = await fetch("/api/members");
  const data = await response.json();

  renderMembers(data.members || []);
}

function renderMembers(members) {
  membersContainer.innerHTML = members.map(member => `
    <div class="admin-member">
      <div>
        <strong>${escapeHtml(member.name)}</strong>
        <span>${escapeHtml(member.role)}</span>
        <small>${escapeHtml(member.memberId)}</small>
      </div>

      <div class="actions">
        <button onclick="editMember('${member._id}')">Edit</button>
        <button class="danger" onclick="deleteMember('${member._id}')">
          Delete
        </button>
      </div>
    </div>
  `).join("");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const dbId = document.getElementById("memberDbId").value;

  const body = {
    memberId: document.getElementById("memberId").value,
    name: document.getElementById("name").value,
    username: document.getElementById("username").value,
    role: document.getElementById("role").value,
    department: document.getElementById("department").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    location: document.getElementById("location").value,
    joinDate: document.getElementById("joinDate").value || null,

    skills: document
      .getElementById("skills")
      .value
      .split(",")
      .map(x => x.trim())
      .filter(Boolean),

    photo: document.getElementById("photo").value,

    github: document.getElementById("github").value,
    linkedin: document.getElementById("linkedin").value,
    facebook: document.getElementById("facebook").value,
    instagram: document.getElementById("instagram").value,
    portfolio: document.getElementById("portfolio").value,

    status: document.getElementById("status").value,
    bio: document.getElementById("bio").value
  };

  const url = dbId
    ? `/api/members/${dbId}`
    : "/api/members";

  const method = dbId ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok) {
    message.textContent = data.message || "Operation failed";
    return;
  }

  message.textContent = "Member saved successfully.";

  clearForm();
  loadMembers();
});

async function editMember(id) {
  const response = await fetch(`/api/members/${id}`);
  const data = await response.json();

  if (!data.member) return;

  const m = data.member;

  document.getElementById("memberDbId").value = m._id;
  document.getElementById("memberId").value = m.memberId || "";
  document.getElementById("name").value = m.name || "";
  document.getElementById("username").value = m.username || "";
  document.getElementById("role").value = m.role || "";
  document.getElementById("department").value = m.department || "";
  document.getElementById("email").value = m.email || "";
  document.getElementById("phone").value = m.phone || "";
  document.getElementById("location").value = m.location || "";

  if (m.joinDate) {
    document.getElementById("joinDate").value =
      new Date(m.joinDate).toISOString().split("T")[0];
  }

  document.getElementById("skills").value =
    (m.skills || []).join(", ");

  document.getElementById("photo").value = m.photo || "";
  document.getElementById("github").value = m.github || "";
  document.getElementById("linkedin").value = m.linkedin || "";
  document.getElementById("facebook").value = m.facebook || "";
  document.getElementById("instagram").value = m.instagram || "";
  document.getElementById("portfolio").value = m.portfolio || "";

  document.getElementById("status").value = m.status || "Active";
  document.getElementById("bio").value = m.bio || "";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

async function deleteMember(id) {
  if (!confirm("Delete this member?")) return;

  const response = await fetch(`/api/members/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.message || "Delete failed");
    return;
  }

  loadMembers();
}

function clearForm() {
  form.reset();
  document.getElementById("memberDbId").value = "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadMembers();
