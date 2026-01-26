const fs = require("fs");

class StaticCollection {
  constructor(data) {
    this.data = data;
  }

  find(filter = {}) {
    const res = this.data.filter(doc =>
      Object.entries(filter).every(([k, v]) => doc[k] === v)
    );
    return {
      toArray: async () => res
    };
  }
}

class StaticDB {
  constructor(dbname) {
    this.dbname = dbname;
  }

  collection(name) {
// remind this file doesn't exist need to be created with mongodump + bsondump
    const file = `./static-db/${this.dbname}.${name}.json`;
    const data = JSON.parse(fs.readFileSync(file));
    return new StaticCollection(data);
  }
}

class StaticMongoClient {
  async connect() { return this; }
  db(name) { return new StaticDB(name); }
  async close() {}
}

module.exports = { MongoClient: StaticMongoClient };

