import Db from "@/shared/repository/db";
import custum_errors from "../custum_errors";
import type { Authorization } from "../auth";
import type { Contact, ContactTags } from "../db";

export interface ContactsRepo {
    LoadContactsList(token: string) : Promise<Contact[]>;
    CreateContact(token: string, contact: any) : Promise<void>;
    RemoveContact(token: string, id: number) : Promise<void>;
    FindContact(token: string, query: string, tagIDList?: number[]) : Promise<Contact[]>;
    LoadTags(token: string) : Promise<ContactTags[]>;
}

export default class ContactsRepoImp implements ContactsRepo {
    authRepo: Authorization;
    constructor(auth: Authorization) {
        this.authRepo = auth;
        // default tags create
        this.createDefaultTags()
    }

    async LoadContactsList(token: string): Promise<any[]> {
        try {
            await this.authRepo.CheckAuthorization.bind(this.authRepo)(token)
            return Db.contacts.toArray()
        } catch(err: any) {
            if (err === custum_errors.ErrNotAuthorized) {
                throw err
            }
            throw custum_errors.InternalError
        }
    }

    async CreateContact(token: string, contact: Contact): Promise<void> {
        try {
            await this.authRepo.CheckAuthorization.bind(this.authRepo)(token)
            Db.contacts.add(contact)
        } catch(err: any) {
            if (err === custum_errors.ErrNotAuthorized) {
                throw err
            }
            throw custum_errors.InternalError
        }
    }

    async RemoveContact(token: string, id: number): Promise<void> {
        try {
            await this.authRepo.CheckAuthorization.bind(this.authRepo)(token)
            Db.contacts.delete(id)
        } catch(err: any) {
            if (err === custum_errors.ErrNotAuthorized) {
                throw err
            }
            throw custum_errors.InternalError
        }
    }

    async FindContact(token: string, query: string, tagIDList?: number[]): Promise<any[]> {
        try {
            await this.authRepo.CheckAuthorization.bind(this.authRepo)(token)
            const result = Db.contacts
            .where("full_name").startsWithIgnoreCase(query)
            .or("phone_number").startsWithIgnoreCase(query)
            .or("email").startsWithIgnoreCase(query)
            
            return tagIDList ? result.and(contact => contact.tags.every(tag => tagIDList.includes(tag))).toArray() : result.toArray()
            
        } catch(err: any) {
            if (err === custum_errors.ErrNotAuthorized) {
                throw err
            }
            throw custum_errors.InternalError
        }
    }

    async LoadTags(token: string): Promise<ContactTags[]> {
        try {
            await this.authRepo.CheckAuthorization.bind(this.authRepo)(token)
            return Db.contact_tags.toArray()
        } catch(err: any) {
            if (err === custum_errors.ErrNotAuthorized) {
                throw err
            }
            throw custum_errors.InternalError
        }
    }

    private createDefaultTags(): void {
        Db.contact_tags.bulkPut([
            {value: "Семья"},
            {value: "Работа"},
            {value: "Еда"},
            {value: "Досуг"},
            {value: "Гос. организации"},
        ])
    }
}