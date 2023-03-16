import { createAudioPlayer, createAudioResource } from "@discordjs/voice"
import axios from "axios"
import { Readable } from "stream"
import googleTTS from "google-tts-api"


export const textToSpeech = async (message, connection) => {
    console.log({
        voice_state: connection.state.status,
        content: message
    })

    const voiceURL = googleTTS.getAudioUrl(message, {
        lang: 'vi',
        slow: false,
        host: 'https://translate.google.com',
        splitPunct: ',.?',
    })
    const { data } = await axios.get(voiceURL, {
        responseType: 'arraybuffer',
        headers: {
            "Content-Type": 'audio/mpeg'
        }
    })

    setTimeout(() => {
        const player = createAudioPlayer()
        const streamData = Readable.from(data)
        const resource = createAudioResource(streamData)
        player.play(resource)

        connection?.subscribe(player)
    }, 200)
}