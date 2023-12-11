import { IRequestPhoto, ModernContext } from '@types'
import { NextMiddleware } from 'puregram'

export default async function extendContext(context: ModernContext, next: NextMiddleware) {
    if (!context.session.requests) context.session.requests = new Map<number, IRequestPhoto>()
    return next()
}
