import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const playingButton = () => {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("pause")
                .setEmoji("⏸️")
                .setLabel("Pause")
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("skip")
                .setEmoji("⏭️")
                .setLabel("Skip")
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("stop")
                .setEmoji("⏹️")
                .setLabel("Stop")
                .setStyle(ButtonStyle.Secondary)
        )
}

export const pauseButton = () => {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("pause")
                .setEmoji("▶️")
                .setLabel("Resume")
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("skip")
                .setEmoji("⏭️")
                .setLabel("Skip")
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("stop")
                .setEmoji("⏹️")
                .setLabel("Stop")
                .setStyle(ButtonStyle.Secondary)
        )
}

export const stopButton = () => {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("pause")
                .setEmoji("⏸️")
                .setLabel("Pause")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("skip")
                .setEmoji("⏭️")
                .setLabel("Skip")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId("stop")
                .setEmoji("⏹️")
                .setLabel("Stop")
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary)
        )
}

export const recordButton = (status) => {
    switch (status) {
        case "init":{
            return new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("start_record")
                        .setEmoji("▶️")
                        .setLabel("Start")
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("stop_record")
                        .setEmoji("⏹️")
                        .setLabel("Stop")
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary)
                )
        }
        case "recording":{
            return new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("pause_record")
                        .setEmoji("⏸️")
                        .setLabel("Pause")
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("stop_record")
                        .setEmoji("⏹️")
                        .setLabel("Stop")
                        .setStyle(ButtonStyle.Secondary)
                )
        }
        case "pausing":{
            return new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("resume_record")
                        .setEmoji("▶️")
                        .setLabel("Resume")
                        .setStyle(ButtonStyle.Secondary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("stop_record")
                        .setEmoji("⏹️")
                        .setLabel("Stop")
                        .setStyle(ButtonStyle.Secondary)
                )
        }
        // case "stop":{
        //     return new ActionRowBuilder()
        //         .addComponents(
        //             new ButtonBuilder()
        //                 .setCustomId("pause_record")
        //                 .setEmoji("⏸️")
        //                 .setLabel("Pause")
        //                 .setDisabled(true)
        //                 .setStyle(ButtonStyle.Secondary)
        //         )
        //         .addComponents(
        //             new ButtonBuilder()
        //                 .setCustomId("stop_record")
        //                 .setEmoji("⏹️")
        //                 .setLabel("Stop")
        //                 .setDisabled(true)
        //                 .setStyle(ButtonStyle.Secondary)
        //         )
        // }
        default:
            break;
    }
}