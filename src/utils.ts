import { readdirSync, statSync } from 'fs'
import { IModule, ModernContext } from '@types'
import { join } from 'path'

export async function collectModules(modulesPath: string): Promise<IModule[]> {
    const modules: IModule[] = []

    const filesFromModulesPath = readdirSync(modulesPath)

    for (const file of filesFromModulesPath) {
        const filePath = join(modulesPath, file)

        if (statSync(filePath).isDirectory()) continue

        const module = await import(`file://${filePath}`)

        const name = module.name
        const description = module.description
        const regex = module.regex

        modules.push({
            name,
            description,
            regex,
            callback: module.default.default,
        })
    }

    return modules
}

export async function getFileUrl(context: ModernContext, fileId: string) {
    const { file_path } = await context.telegram.api.getFile({
        file_id: fileId, 
    })

    const fileUrl = context.telegram.getFileURL(file_path!)

    return fileUrl
}
