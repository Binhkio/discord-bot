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