import { EndBehaviorType } from "@discordjs/voice"
import { createWriteStream } from "node:fs"


export const createListeningStream = (receiver, userId, user) => {
    const opusStream = receiver.subscribe(userId, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 100,
        }
    })
    // const oggStream = new prism.opus.OggLogicalBitstream({
    //     opusHead: new prism.opus.OpusHead({
    //         channelCount: 2,
    //         sampleRate: 48000,
    //     }),
    //     pageSizeControl: {
    //         maxPackets: 10,
    //     }
    // })

    const filename = `./recordings/${userId}.pcm`

    const out = createWriteStream(filename, {flags: 'a'})
    // pipeline(opusStream, oggStream, out, (err) => {
    //     if(err){
    //         console.log("Error recording file");
    //     }else{
    //         console.log("Recorded");
    //     }
    // })
}
