import Db from "@/shared/repository/db";
import customErrors from "../custum_errors/";
import type AuthRepo from "../auth";
import type { Contact, ContactTags } from "../db";


export default class ContactsRepoImp {
    authRepo: AuthRepo;
    constructor(auth: AuthRepo) {
        this.authRepo = auth;
        // default tags create
        this.createDefaultTags()
        this.createDefaultContacts()
    }

    async LoadContactsList(token: string): Promise<any[]> {
        try {
            await this.authRepo.CheckAuthorization.bind(this.authRepo)(token)
            const contacts = await Db.contacts.reverse().toArray()
            const tagsList = await Db.contact_tags.toArray()
            return contacts.map(contact => {
                const shit = tagsList.filter(tag => contact.tagIdList.includes(tag.id!)).map(item => item.value)
                contact.tags.push(...shit)
                return contact
            })
        } catch(err: any) {
            if (err === customErrors.ErrNotAuthorized) {
                throw err
            }
            throw customErrors.InternalError
        }
    }

    async CreateContact(token: string, contact: Contact): Promise<void> {
        try {
            await this.authRepo.CheckAuthorization.bind(this.authRepo)(token)
            Db.contacts.add(contact)
        } catch(err: any) {
            if (err === customErrors.ErrNotAuthorized) {
                throw err
            }
            throw customErrors.InternalError
        }
    }

    async RemoveContact(token: string, id: number): Promise<void> {
        try {
            await this.authRepo.CheckAuthorization.bind(this.authRepo)(token)
            Db.contacts.delete(id)
        } catch(err: any) {
            if (err === customErrors.ErrNotAuthorized) {
                throw err
            }
            throw customErrors.InternalError
        }
    }

    async FindContact(token: string, query: string, tagIDList?: number[]): Promise<any[]> {
        console.log(query, tagIDList);
        
        try {
            await this.authRepo.CheckAuthorization.bind(this.authRepo)(token)
            const response = Db.contacts
            .where("full_name").startsWithIgnoreCase(query)
            .or("phone_number").startsWithIgnoreCase(query)
            .or("email").startsWithIgnoreCase(query)
            
            const result = tagIDList
                ? response.and(contact => contact.tagIdList.some(tagId => tagIDList.indexOf(tagId) >= 0))
                : response
            
            return result.reverse().toArray()
        } catch(err: any) {
            if (err === customErrors.ErrNotAuthorized) {
                throw err
            }
            throw customErrors.InternalError
        }
    }

    async LoadTags(token: string): Promise<ContactTags[]> {
        try {
            await this.authRepo.CheckAuthorization.bind(this.authRepo)(token)
            return Db.contact_tags.toArray()
        } catch(err: any) {
            if (err === customErrors.ErrNotAuthorized) {
                throw err
            }
            throw customErrors.InternalError
        }
    }

    private createDefaultTags(): void {
        Db.contact_tags.bulkPut([
            {value: "Семья", id: 1},
            {value: "Работа", id: 2},
            {value: "Еда", id: 3},
            {value: "Досуг", id: 4},
            {value: "Гос. организации", id: 5},
            {value: "Услуги", id: 6},
        ])
    }

    private createDefaultContacts(): void {
        Db.contacts.bulkPut([
            {
                full_name: "Ismail Gasprinskiy",
                phone_number: "+998998152821",
                email: "gasprin321@gmail.com",
                tagIdList: [2],
                tags: [],
                id: 1
            },
            {
                full_name: "Wendy's Delivery",
                phone_number: "+99877882288",
                email: "wendys.uz@gmail.com",
                tagIdList: [3, 4],
                tags: [],
                id: 2
            },
            {
                full_name: "Apple Service Center",
                phone_number: "+9987132142",
                email: "apple.service.uz@gmail.com",
                tagIdList: [6],
                tags: [],
                id: 3
            },
            {
                full_name: "Sarkor Telecom",
                phone_number: "+994215321",
                email: "sarkor.uz@gmail.com",
                tagIdList: [2, 6],
                tags: [],
                id: 4
            },
            {
                full_name: "Налоговая",
                phone_number: "+99833421321",
                email: "ploti.nalogi.uz@gmail.com",
                tagIdList: [5],
                tags: [],
                id: 5
            },
        ])
    }

}