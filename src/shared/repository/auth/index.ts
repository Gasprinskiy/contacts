import Db from "../db";
import custum_errors from "../custum_errors";
export interface Authorization {
    SignIn(login: string, password: string) : Promise<any>;
    CheckAuthorization(token: string) : Promise<void>;
    SigOut(token: string) : Promise<void>;
}

export default class AuthRepo implements Authorization {
    constructor() {
        this.addDefaultUser() 
    }

   async SignIn(login: string, password: string): Promise<any> {
        try {
            console.log(login, password);
            
            const result = await Db.users.get({login: login, password: password})

            if (result === undefined) {
                throw custum_errors.ErrWrongLoginOrPassword
            }

            const token = this.genToken(result.id!)
            await Db.session_tokens.put({
                token: token
            })
            return token
        } catch(err: any) {
            if (err === custum_errors.ErrWrongLoginOrPassword) {
                throw err
            }
            throw custum_errors.InternalError
        }
    }

    async CheckAuthorization(token: string): Promise<void> {
        try {
            const result = await Db.session_tokens.get({token: token})
            if (result === undefined) {
                throw custum_errors.ErrNotAuthorized
            }
        } catch(err: any) {
            if (err === custum_errors.ErrWrongLoginOrPassword) {
                throw err
            }
            throw custum_errors.InternalError
        }
    }

    async SigOut(token: string): Promise<void> {
        try {
            await Db.session_tokens.where({session_tokens: token}).delete()
        } catch (err: any) {
            throw custum_errors.InternalError
        } 
        
    }

    private genToken(id: number): string {
        return Math.random().toString(36).slice(-8) + `#|||#${id}`;
    }

    private addDefaultUser() : void {
        Db.users.put({login: "admin", password: "admin"})
    }
}
