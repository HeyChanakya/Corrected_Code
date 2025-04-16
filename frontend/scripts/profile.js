// Define the base URL of your backend API
const baseURL = "http://localhost:3000"; // Change this if your backend runs elsewhere

// Load all users
async function loadUsers() {
  const res = await fetch(`${baseURL}/users`);
  const users = await res.json();
  const list = document.getElementById("userList");
  list.innerHTML = "";

  document.getElementById("userCounts").textContent = `Total users: ${users.length}`;

  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `${user.username}: ${user.bio}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = async () => {
      await fetch(`${baseURL}/users/${user._id}`, { method: "DELETE" });
      loadUsers();
    };

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

// Filter users on search
document.getElementById("search").addEventListener("input", async (e) => {
  const term = e.target.value.toLowerCase();
  const res = await fetch(`${baseURL}/users`);
  const users = await res.json();
  const list = document.getElementById("userList");
  list.innerHTML = "";

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(term)
  );

  document.getElementById("userCounts").textContent = `Total users: ${filteredUsers.length}`;

  filteredUsers.forEach(user => {
    const li = document.createElement("li");
    li.textContent = `${user.username}: ${user.bio}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = async () => {
      await fetch(`${baseURL}/users/${user._id}`, { method: "DELETE" });
      loadUsers();
    };

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
});

// Submit new user form
document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const bio = document.getElementById("bio").value;

  await fetch(`${baseURL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, bio })
  });

  e.target.reset();
  loadUsers();
});

// Initial load of users
loadUsers();
