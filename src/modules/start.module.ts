import { ModernContext } from '@types'

export default async function startModule(context: ModernContext) {
    console.log(context)
}

export const name = 'start'
export const description = 'General information about the bot'
export const regex = /^\/start$/i
