export interface Authorization {
    SignIn(email: string, password: string) : Promise<string | null>;
    CheckAuthorization() : void;
    SigOut() : Promise<void>
}
