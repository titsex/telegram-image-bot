import extendContext from '@handler/extend-context.handler'
import attachmentHandler from '@handler/attachment.handler'
import Logger from '@class/Logger'

console.log("1");

import { ModernContext, ISessionData } from '@types'
import { SessionManager } from '@puregram/session'
import { HearManager } from '@puregram/hear'
import { modulesPath } from '@constants'
import { collectModules } from '@utils'
import { Telegram } from 'puregram'

const telegram = Telegram.fromToken(process.env.TOKEN as string)
const hearManager = new HearManager<ModernContext>()

const sessionManager = new SessionManager<ISessionData>()

const start = async () => {
    const modules = await collectModules(modulesPath)

    telegram.updates.on('message', sessionManager.middleware)
    telegram.updates.on('message', extendContext)
    telegram.updates.on('message', attachmentHandler)
    telegram.updates.on('message', hearManager.middleware)

    for (const module of modules) {
        hearManager.hear(module.regex, module.callback)
    }

    telegram.updates
        .startPolling()
        .then(() => Logger.info('Bot has been successfully started'))
        .catch(Logger.error)
}

start()
