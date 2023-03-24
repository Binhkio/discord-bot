import { EmbedBuilder } from "discord.js"

export const searchEmbed = (interaction, searchData) => {
    const embed = new EmbedBuilder()
        .setAuthor({
            name: "SEARCH",
            iconURL: interaction.user.avatarURL({extension:"png"}),
        })
        .addFields(searchData.map((data, index) => {
            const title = data.title.length > 60
                ? data.title.slice(0, 60).concat("...")
                : data.title
            return {
                name: `${index+1}. `,
                value: `[${title}](${data.url}) - \`${data.durationRaw}\``,
            }
        }))
        .setFooter({text: "_Developed by Binhkio_"})
        .setTimestamp()

        return embed
}

export const choosedEmbed = (interaction, searchData) => {
    const title = searchData.title.length > 60
                ? searchData.title.slice(0, 60).concat("...")
                : searchData.title
    const embed = new EmbedBuilder()
        .setAuthor({
            name: "CHOOSED",
            iconURL: interaction.user.avatarURL({extension:"png"}),
        })
        .setTitle(title)
        .setURL(searchData.url)
        .setFooter({text: "_Developed by Binhkio_"})
        .setTimestamp()

        return embed
}