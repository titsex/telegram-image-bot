import { DocumentAttachment, InlineKeyboard, NextMiddleware, PhotoAttachment, StickerAttachment } from 'puregram'
import { IRequestPhoto, ModernContext } from '@types'
import { stripIndents } from 'common-tags'
import { getFileUrl } from '@utils'

export default async function attachmentHandler(context: ModernContext, next: NextMiddleware) {
    if (context.entities?.has('bot_command')) return next()

    if ('attachment' in context) {
        const userHasRequest = context.session.requests.get(context.from!.id)

        if (userHasRequest)
            return await context.reply(
                stripIndents`
            You have a request that you hove not processed in any way.
            Delete it?
            `,
                {
                    reply_markup: InlineKeyboard.keyboard([
                        [
                            InlineKeyboard.textButton({
                                text: 'Yes, delete it',
                                payload: `${context.from!.id}~${userHasRequest.fileUniqueId}~delete`,
                            }),
                        ],
                    ]),
                }
            )

        let photo: IRequestPhoto | null = null

        if (context.attachment instanceof PhotoAttachment) {
            const attachment = context.attachment.bigSize

            photo = {
                fileId: attachment.fileId,
                fileUniqueId: attachment.fileUniqueId,
                ext: 'jpg',
            }
        }

        if (context.attachment instanceof DocumentAttachment) {
            const attachment = context.attachment

            if (!attachment.mimeType!.includes('image'))
                return await context.reply(
                    stripIndents`
                The document must be an image!
                Please, send me a document that is an image.
                `
                )

            photo = {
                fileId: attachment.fileId,
                fileUniqueId: attachment.fileUniqueId,
                ext: attachment.mimeType!.split('/').at(-1)!,
            }
        }

        if (context.attachment instanceof StickerAttachment) {
            const attachment = context.attachment

            if (attachment.isAnimated! || attachment.isVideo!)
                return context.reply(
                    stripIndents`
                Animated stickers are not support!
                Please, send me a non-animated sticker.
                `
                )

            photo = {
                fileId: attachment.fileId,
                fileUniqueId: attachment.fileUniqueId,
                ext: 'webp',
            }
        }

        if (photo) {
            photo.url = await getFileUrl(context, photo.fileId)            

            context.session.requests.set(context.from!.id, photo)

            console.log(context.session.requests.get(context.from!.id))

            return next()
        }

        return await context.reply(
            stripIndents`
            Send me and image!
            You can also send a document that is an image or a sticker.
            `
        )
    }

    return next()
}
