import { entersState, VoiceConnectionStatus } from "@discordjs/voice"
import { textToSpeech } from "./textToSpeech.js"

export const joinChannel = async (voiceChannel, voiceConnection) => {
    await entersState(voiceConnection, VoiceConnectionStatus.Ready, 5e3)
    await textToSpeech("Ếch xanh đã tham gia kênh chat", voiceConnection)
    console.log(`Joining channel ${voiceChannel.id}`)
}