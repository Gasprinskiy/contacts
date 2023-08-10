import Dexie, { Table } from "dexie";
import { User, Contact } from "./types";

export default class Db extends Dexie {
    users: Table<User>;
    contacts: Table<Contact>
    constructor() {
      super('myDatabase');
      this.version(1).stores({
          users: '++id, login, password',
          contacts: '++id, full_name, phone_number, email, *tags'
      });
    }
}