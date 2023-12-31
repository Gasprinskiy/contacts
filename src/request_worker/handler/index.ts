import appBus from "@/shared/app_bus"

// lat's pretend that is axios instance
export const handleRepoRequest = async <T>(request: (...args: any[]) => Promise<T>, ...args: any[]) : Promise<T|any> => {
    try {
        return await request(...args)
    } catch(err: any) {
        if (err.code === "ErrNotAuthorized") {
            appBus.emit("unauthorized_request")
            return 
        }
        throw err
    }
}