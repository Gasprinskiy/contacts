export interface Authorization {
    SignIn(email: string, password: string) : Promise<boolean>;
    CheckAuthorization() : void;
    SigOut() : Promise<void>
}