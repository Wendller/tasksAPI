import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        return (this.#database = JSON.parse(data));
      })
      .catch(() => {
        fs.writeFile(databasePath, JSON.stringify({}));
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  insert(table, data) {
    const tableAlreadyExists = Array.isArray(this.#database[table]);

    if (tableAlreadyExists) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    const rowExists = rowIndex > -1;

    if (rowExists) {
      const rowData = this.#database[table][rowIndex];
      this.#database[table][rowIndex] = { ...rowData, ...data };
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    const rowExists = rowIndex > -1;

    if (rowExists) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
