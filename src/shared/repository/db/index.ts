import Dexie from "dexie"
import type { Table } from "dexie";

export interface User {
  id?: number;
  login: string;
  password: string;
}

export interface Contact {
  id?: number;
  full_name: string;
  phone_number: string;
  email: string;
  tags: string[]
  tagIdList: number[];
}

export interface ContactTags {
  id?: number;
  value: string;
}

export interface SessionToken {
  id?: number;
  token: string;
}

class Db extends Dexie {
    users: Table<User>
    contacts: Table<Contact>
    contact_tags: Table<ContactTags>
    session_tokens: Table<SessionToken>
    
    constructor() {
      super('myDatabase');
      this.version(1).stores({
        users: '++id, login, password',
        contacts: '++id, full_name, phone_number, email, *tagIdList',
        contact_tags: '++id, value',
        session_tokens: '++id, token'
      });
    }
}

export default new Db()