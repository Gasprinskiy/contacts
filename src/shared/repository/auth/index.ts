import Db from "../db";
import customErrors from "../custum_errors/";

export default class AuthRepo {
    constructor() {
        // default user create
        this.addDefaultUser() 
    }

   async SignIn(login: string, password: string): Promise<any> {
        try {            
            const result = await Db.users.get({login: login, password: password})

            if (!result) {
                throw customErrors.ErrWrongLoginOrPassword
            }

            const token = this.genToken(result.id!)
            await Db.session_tokens.put({
                token: token
            })
            return token
        } catch(err: any) {
            if (err === customErrors.ErrWrongLoginOrPassword) {
                throw err
            }
            throw customErrors.InternalError
        }
    }

    async CheckAuthorization(token: string): Promise<void> {
        try {
            const result = await Db.session_tokens.get({token: token})
            if (!result) {
                throw customErrors.ErrNotAuthorized
            }
        } catch(err: any) {            
            if (err === customErrors.ErrNotAuthorized) {
                throw err
            }
            throw customErrors.InternalError
        }
    }

    async SigOut(token: string): Promise<void> {
        try {
            await Db.session_tokens.where({session_tokens: token}).delete()
        } catch (err: any) {
            throw customErrors.InternalError
        } 
        
    }

    private genToken(id: number): string {
        return Math.random().toString(36).slice(-8) + `#|||#${id}`;
    }

    private addDefaultUser() : void {
        Db.users.put({login: "admin", password: "admin", id: 1})
    }
}
