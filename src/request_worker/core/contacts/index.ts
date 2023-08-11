import type { Contact, ContactTags } from "@/request_worker/entity/contact/entity"
import repository from "@/shared/repository";
import { handleRepoRequest } from "../../handler";
import type { ContactSearchParam } from "@/request_worker/entity/contact/params";

export interface Contacts {
    loadContactsList() : Promise<Contact[]>;
    createContact(contact: Contact) : Promise<void>;
    removeContact(id: number) : Promise<void>;
    findContact(params: ContactSearchParam) : Promise<Contact[]>;
    loadTags() : Promise<ContactTags[]> 
}

export class ContactsImpl implements Contacts {
    loadContactsList(): Promise<Contact[]> {
        return handleRepoRequest(repository.contacts.LoadContactsList.bind(repository.contacts), document.cookie)
    }

    createContact(contact: Contact): Promise<void> {
        return handleRepoRequest(repository.contacts.CreateContact.bind(repository.contacts), document.cookie, contact)
    }

    removeContact(id: number): Promise<void> {
        return handleRepoRequest(repository.contacts.RemoveContact.bind(repository.contacts), document.cookie, id)
    }

    findContact(params: ContactSearchParam): Promise<Contact[]> {
        return handleRepoRequest(
            repository.contacts.FindContact.bind(repository.contacts),
            document.cookie,
            params.query,
            params.tagIdList
        )
    }

    loadTags(): Promise<ContactTags[]> {
        return handleRepoRequest(repository.contacts.LoadTags.bind(repository.contacts), document.cookie)
    }
}