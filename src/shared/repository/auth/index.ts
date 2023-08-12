import Db from "../db";
import customErrors from "../custum_errors/";

export default class AuthRepo {
    constructor() {
        // default user create
        this.addDefaultUser() 
    }

   async SignIn(login: string, password: string): Promise<any> {
        try {            
            const result = await Db.users.where('[login+password]').equals([login, password]).first()
            if (result === undefined) {
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
            const result = await Db.session_tokens.get({token: String(token)})
            if (result === undefined) {
                throw customErrors.ErrNotAuthorized
            }
            return
        } catch(err: any) {          
            if (err === customErrors.ErrNotAuthorized) {
                throw err
            }
            throw customErrors.InternalError
        }
    }

    async SigOut(token: string): Promise<void> {
        try {
            const sessToken = await Db.session_tokens.get({token: String(token)})
            await Db.session_tokens.delete(sessToken?.id!)
        } catch (err: any) {            
            throw customErrors.InternalError
        } 
        
    }

    private genToken(id: number): string {
        return Math.random().toString(36).slice(-8) + `#|||#${id}`;
    }

    private async addDefaultUser() : Promise<void> {
        const count = await Db.users.count()
        if (count === 0) {
            Db.users.put({login: "admin", password: "admin", id: 1})
        }
    }
}
