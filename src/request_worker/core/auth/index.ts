import repository from '@/shared/repository';
import { handleRepoRequest } from '../../handler/index';
import type { AuthParams } from "@/request_worker/entity/auth/params";

export interface Auth {
    sigIn(params: AuthParams) : Promise<void>;
    checkAuth() : Promise<void>;
    signOut(token: string) : Promise<void>;
}

export class AuthImpl implements Auth {
    async sigIn(params: AuthParams): Promise<void> {
        const token = await handleRepoRequest(repository.auth.SignIn.bind(repository.auth), params.login, params.password)
        localStorage.setItem("token", String(token))
    }

    checkAuth(): Promise<void> {
        return handleRepoRequest(repository.auth.CheckAuthorization.bind(repository.auth), localStorage.getItem("token"))
    }

    async signOut(): Promise<void> {
        await repository.auth.SigOut.bind(repository.auth)(localStorage.getItem("token")!)
        localStorage.clear()
        return
    }
}