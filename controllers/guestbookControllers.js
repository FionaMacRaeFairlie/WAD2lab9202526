import GuestBook from "../models/guestbookModel.js";
import UserList from "../models/userModel.js";

// Initialize databases
const guestbookdb = new GuestBook("./data/guestbook.db");
await guestbookdb.init();

export const userdb = new UserList("./data/users.db");
await userdb.init();

// Show login page
export const show_login = (req, res) => {
  res.render("login");
};

// Handle login
export const handle_login = (req, res) => {
  res.render("newEntry", {
    title: "Guest Book",
    user: "user",
  });
};

// Landing page - show all entries
export const static_landing_page = (req, res) => {
  res.send("index.html");
};

// Landing page - show all entries
export const landing_page = async (req, res) => {
  try {
    const list = await guestbookdb.getAllEntries();
    res.render("entries", {
      title: "Guest Book",
      entries: list,
    });
  } catch (err) {
    console.error("Error fetching entries:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Show new entry form
export const show_new_entries = (req, res) => {
  res.render("newEntry", {
    title: "Guest Book",
    user: "user",
  });
};

// Post new entry
export const post_new_entry = async (req, res) => {
  console.log("Processing post_new_entry controller");
  if (!req.body.author) {
    res.status(400).send("Entries must have an author.");
    return;
  }
  try {
    await guestbookdb.addEntry(
      req.body.author,
      req.body.subject,
      req.body.contents
    );
    res.redirect("/loggedIn");
  } catch (err) {
    console.error("Error adding entry:", err);
    res.status(500).send("Failed to add entry");
  }
};

// Show entries by user
export const show_user_entries = async (req, res) => {
  const user = req.params.author;
  try {
    const entries = await guestbookdb.getEntriesByUser(user);
    res.render("entries", {
      title: "Guest Book",
      user: "user",
      entries,
    });
  } catch (err) {
    console.error("Error fetching user entries:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Show register page
export const show_register_page = (req, res) => {
  res.render("register");
};

// Register new user
export const post_new_user = async (req, res) => {
  const user = req.body.username;
  const password = req.body.pass;

  if (!user || !password) {
    res.status(401).send("No user or no password");
    return;
  }

  try {
    const existingUser = await userdb.lookup(user);
    if (existingUser.length !== 0) {
      res.status(401).send(`User exists: ${user}`);
      return;
    }
    await userdb.create(user, password);
    console.log("Registered user:", user);
    res.redirect("/login");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Logged-in landing page
export const loggedIn_landing = async (req, res) => {
  try {
    const list = await guestbookdb.getAllEntries();
    res.render("entries", {
      title: "Guest Book",
      user: "user",
      entries: list,
    });
  } catch (err) {
    console.error("Error fetching entries:", err);
    res.status(500).send("Internal Server Error");
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("jwt").status(200).redirect("/");
};
