import { AttachmentBuilder } from "discord.js"
import { Configuration, OpenAIApi } from "openai"

export const chatGPT = async (message, type, replyCallback) => {
    const configuration = new Configuration({
        apiKey: "sk-" + "vxQ0rzd0diusInHtnUGbT3BlbkFJF4NyAjiaVWq989lUzvLa"
    })
    const openAI = new OpenAIApi(configuration)
    const res = await openAI.createCompletion({
        model: 'text-davinci-003',
        prompt: message,
        max_tokens: 2048,
    })
    console.log("Sending to GPT: ", message.length > 10 ? message.slice(0, 10) : message)
    const resMsg = '> ' + message + res.data.choices[0].text
    if (resMsg.length >= 2000) {
        const attachment = new AttachmentBuilder(Buffer.from(resMsg, 'utf-8'), {
            name: type === 'text' || !type ? 'response.txt' : 'response.js'
        })
        await replyCallback({ files: [attachment] })
    } else {
        type === 'text' || !type
        ? await replyCallback('> ' + message + res.data.choices[0].text)
        : await replyCallback('> ' + message + '\n```js' + res.data.choices[0].text + '\n```')
    }
}