import Datastore from "nedb-promises";
import bcrypt from "bcrypt";

const saltRounds = 10;

class UserList {
  constructor(dbFilePath) {
    if (dbFilePath) {
      this.db = Datastore.create({ filename: dbFilePath, autoload: true });
      console.log(`User DB connected to ${dbFilePath}`);
    } else {
      this.db = Datastore.create();
    }
  }

  // Seed initial users (demo)
  async init() {
    try {
      await this.db.insert({
        user: "Peter",
        password:
          "$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C",
      });
      await this.db.insert({
        user: "Ann",
        password:
          "$2b$10$bnEYkqZM.MhEF/LycycymOeVwkQONq8kuAUGx6G5tF9UtUcaYDs3S",
      });
      console.log("Demo users inserted");
    } catch (err) {
      console.error("Error seeding user DB:", err);
    }
    return this;
  }

  // Create a new user with hashed password
  async create(username, password) {
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      const entry = { user: username, password: hash };
      const doc = await this.db.insert(entry);
      console.log(`User ${username} created`);
      return doc;
    } catch (err) {
      console.error(`Can't insert user ${username}:`, err);
      throw err;
    }
  }

  // Lookup user by username
  async lookup(username) {
    try {
      const entries = await this.db.find({ user: username });
      return entries; // returns an array
    } catch (err) {
      console.error("Error looking up user:", err);
      throw err;
    }
  }
}

export default UserList;
