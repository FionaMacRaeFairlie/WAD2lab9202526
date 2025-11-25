import GuestBook from "../models/guestbookModel.js";

const guestbookdb = new GuestBook("./data/guestbook.db");
await guestbookdb.init();

// Landing page - show all entries
export const static_landing_page = (req, res) => {
  res.send("index.html");
};

export const entries_list = async (req, res) => {
  try {
    const list = await guestbookdb.getAllEntries();
    // res.json(list);
    res.render("entries", {
      title: "Guest Book",
      entries: list,
    });
  } catch (err) {
    console.error("Error fetching entries:", err);
    res.status(500).send("Internal Server Error");
  }
};

export const landing_page = async (req, res) => {
  try {
    const list = await guestbookdb.getAllEntries();
    console.log("Fetched entries:", list);
  } catch (err) {
    console.error("Error fetching entries:", err);
    res.status(500).send("Internal Server Error");
  }
};

//Show new entry form
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

export const show_login = (req, res) => {
  res.send("<p>Not yet implemented: will show a login form</p>");
};

export const show_register_page = (req, res) => {
  res.send("<p>Not yet implemented: will show a registration form</p>");
};

export const peters_entries = async (req, res) => {
  try {
    const list = await guestbookdb.getAllEntries();
    console.log("Fetched entries:", list);
    res.json(list);
  } catch (err) {
    console.error("Error fetching entries:", err);
    res.status(500).send("Internal Server Error");
  }
};

export const show_user_entries = async (req, res) => {
  const user = req.params.author;
  try {
    const entries = await guestbookdb.getEntriesByUser(user);
    res.render("guestbook", {
      title: "Guest Book",
      entries,
    });
  } catch (err) {
    console.error("Error fetching user entries:", err);
    res.status(500).send("Internal Server Error");
  }
};
