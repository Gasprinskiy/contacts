import type { Authorization } from "../index";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import appBus from "@/shared/app_bus";

const authApp = initializeApp({
    apiKey: "AIzaSyCz3FXHsEIcBmW4rl4nf1BNO6Z3rUm_E_c",
    appId: "fourth-memento-341300"
})

const auth = getAuth(authApp)

export class FirebaseAuthApp implements Authorization {
    async SignIn(email: string, password: string): Promise<string | null> {
      try {
        const response = await signInWithEmailAndPassword(auth, email, password)        
        return response.user.email
      } catch(err: any) {
        switch (err.code) {
            case "auth/user-not-found":
                throw "Пользователь с такими данными не найден"
            case "auth/wrong-password":
                throw "Неверный пароль"
            default:
                throw err
        }
      }
    }

    CheckAuthorization(): void {
        onAuthStateChanged(auth, (user) => {
            if (!user) {                
                appBus.emit("unauthorized-request")
            }
        })
    }

    SigOut(): Promise<void> {
        return signOut(auth)
    }
}