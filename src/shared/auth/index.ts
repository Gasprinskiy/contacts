export interface Authorization {
    SignIn(email: string, password: string) : Promise<string | null>;
    IsSignedIn() : void;
    SigOut() : Promise<void>
}
