// guestBook.js
import Datastore from "nedb-promises";

export default class GuestBook {
  constructor(dbFilePath) {
    if (dbFilePath) {
      this.db = Datastore.create({ filename: dbFilePath, autoload: true });
      console.log(`DB connected to ${dbFilePath}`);
    } else {
      this.db = Datastore.create();
    }
  }

  // Seed the database
  async init() {
    try {
      await this.db.insert({
        subject: "I liked the exhibition",
        contents: "nice",
        published: "2020-02-16",
        author: "Peter",
      });
      console.log("db entry Peter inserted");

      await this.db.insert({
        subject: "Didn't like it",
        contents: "A really terrible style!",
        published: "2020-02-18",
        author: "Ann",
      });
      console.log("db entry Ann inserted");
    } catch (err) {
      console.error("Error seeding database:", err);
    }
  }

  // Return all entries
  async getAllEntries() {
    try {
      const entries = await this.db.find({});
      console.log("getAllEntries() returns:", entries);
      return entries;
    } catch (err) {
      throw err;
    }
  }

  // Get entries by Peter
  async getPetersEntries() {
    try {
      const entries = await this.db.find({ author: "Peter" });
      console.log("getPetersEntries() returns:", entries);
      return entries;
    } catch (err) {
      throw err;
    }
  }

  // Add a new entry
  async addEntry(author, subject, contents) {
    const entry = {
      author,
      subject,
      contents,
      published: new Date().toISOString().split("T")[0],
    };
    console.log("entry created:", entry);

    try {
      const doc = await this.db.insert(entry);
      console.log("document inserted into the database:", doc);
      return doc;
    } catch (err) {
      console.error("Error inserting document:", subject, err);
    }
  }

  // Get entries by a specific user
  async getEntriesByUser(authorName) {
    try {
      const entries = await this.db.find({ author: authorName });
      console.log("getEntriesByUser() returns:", entries);
      return entries;
    } catch (err) {
      throw err;
    }
  }
}
