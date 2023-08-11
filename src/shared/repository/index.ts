import Db from "./db";
import AuthRepo from "./auth";
import ContactsRepo from "./contacts";

const auth = new AuthRepo()
const contacts = new ContactsRepo(auth)

export default {
    auth,
    contacts
}