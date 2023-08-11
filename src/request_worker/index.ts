import type { InjectionKey } from 'vue'
import type { Auth } from "./core/auth/";
import type { Contacts } from "./core/contacts/";
import { AuthImpl } from "./core/auth";
import { ContactsImpl } from "./core/contacts";

type InjectionKeys = {[key: string]: InjectionKey<any>}
type InjectionImpl = {[key: string]: object}

export const AuthInjectionKey : InjectionKey<Auth> = Symbol("Auth")
export const ContactsInjectionKey: InjectionKey<Contacts> = Symbol("ContactsInjectionKey")

export const InjectionKeysMap: InjectionKeys = {
    auth: AuthInjectionKey,
    contacts: ContactsInjectionKey
}

export const InjectionImplMap : InjectionImpl = {
    auth: new AuthImpl(),
    contacts: new ContactsImpl()
}
