import { createAudioResource } from "@discordjs/voice"
import playdl from "play-dl"

export const PlayMusic = async (url, Player) => {
    let stream = await playdl.stream(url)
    let resource = createAudioResource(stream.stream, {
        inputType: stream.type
    })
    Player.play(resource)
}