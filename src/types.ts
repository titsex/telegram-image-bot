import type { Context, MessageContext } from 'puregram'

export interface ISessionData {
    requests: Map<number, IRequestPhoto>
}

export interface IRequestPhoto {
    fileId: string
    fileUniqueId: string
    url?: string
    ext: string
}

export interface ISessionLayer<T> {
    session: T
}

export type ContextType<C extends Context> = C & ISessionLayer<ISessionData>
export type ModernContext = ContextType<MessageContext>

export interface IModule {
    name: string
    description: string
    regex: RegExp
    callback: (context: ModernContext) => Promise<unknown>
}
