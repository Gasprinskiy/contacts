export interface Contact {
    id: number;
    full_name: string;
    phone_number: string;
    email: string;
    tags: string[];
    tagIdList: number[];
}

export interface ContactTags {
    id: number;
    value: string;
}