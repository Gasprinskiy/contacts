import type { Contact, ContactTags } from "@/request_worker/entity/contact/entity"
import repository from "@/shared/repository";
import { handleRepoRequest } from "../../handler";
import type { ContactSearchParam } from "@/request_worker/entity/contact/params";

export interface Contacts {
    getContact(id: number) : Promise<Contact>;
    loadContactsList() : Promise<Contact[]>;
    createRedactContact(contact: Contact) : Promise<number>;
    removeContact(id: number) : Promise<void>;
    findContact(params: ContactSearchParam) : Promise<Contact[]>;
    loadTags() : Promise<ContactTags[]> 
}

export class ContactsImpl implements Contacts {
    getContact(id: number): Promise<Contact> {
        return handleRepoRequest(
            repository.contacts.GetContact.bind(repository.contacts), 
            localStorage.getItem("token"), 
            id
        )
    }

    loadContactsList(): Promise<Contact[]> {
        return handleRepoRequest(
            repository.contacts.LoadContactsList.bind(repository.contacts), 
            localStorage.getItem("token")
        )
    }

    createRedactContact(contact: Contact): Promise<number> {
        return handleRepoRequest(
            repository.contacts.CreateRedactContact.bind(repository.contacts), 
            localStorage.getItem("token"), 
            contact
        )
    }

    removeContact(id: number): Promise<void> {
        return handleRepoRequest(
            repository.contacts.RemoveContact.bind(repository.contacts), 
            localStorage.getItem("token"), 
            id
        )
    }

    findContact(params: ContactSearchParam): Promise<Contact[]> {
        return handleRepoRequest(
            repository.contacts.FindContact.bind(repository.contacts),
            localStorage.getItem("token"),
            params.query,
            params.tagIdList
        )
    }

    loadTags(): Promise<ContactTags[]> {
        return handleRepoRequest(repository.contacts.LoadTags.bind(repository.contacts), localStorage.getItem("token"))
    }
}