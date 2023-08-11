export interface Contact {
    id: number;
    full_name: string;
    phone_number: string;
    email: string;
    groups: number[];
}

export interface ContactTags {
    id: number;
    value: string;
}