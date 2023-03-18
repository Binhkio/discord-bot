import { createAudioResource } from "@discordjs/voice"
import playdl from "play-dl"

export const PlayMusic = async (url, Player) => {
    if(playdl.yt_validate(url) !== "video"){
        return false
    }
    let stream = await playdl.stream(url)
    let resource = createAudioResource(stream.stream, {
        inputType: stream.type
    })
    Player.play(resource)
    return true
}