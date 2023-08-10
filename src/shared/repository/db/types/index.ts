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
    tags: string[];
}