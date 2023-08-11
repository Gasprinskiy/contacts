import repository from '@/shared/repository';
import { handleRepoRequest } from '../../handler/index';

export interface Auth {
    sigIn(params: {login: string, password: string}) : Promise<void>;
    checkAuth() : Promise<void>;
    signOut(token: string) : Promise<void>;
}

export class AuthImpl implements Auth {
    async sigIn(params: {login: string, password: string}): Promise<void> {
        console.log(params, "client");
        
        const token = await handleRepoRequest(repository.auth.SignIn.bind(repository.auth), params.login, params.password)
        document.cookie = String(token)
    }

    checkAuth(): Promise<void> {
        return handleRepoRequest(repository.auth.CheckAuthorization.bind(repository.auth), document.cookie)
    }

    signOut(): Promise<void> {
        document.cookie = ""
        return repository.auth.SigOut.bind(repository.auth)(document.cookie)
    }
}