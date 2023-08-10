import type {Authorization} from "@/shared/repository";
import Dexie from "dexie";
import Promise = Dexie.Promise;
import Db from "@/shared/repository/db";

export default class AuthRepo implements Authorization {
    db: Db;
    constructor(db: Db) {
        this.db = db
    }
    SignIn(email: string, password: string): Promise<boolean> {
        const result = this.db.users.where({login: email, password: password})
        console.log(result)
    }
}
