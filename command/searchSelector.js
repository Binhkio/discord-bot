import { SelectMenuBuilder } from "@discordjs/builders"
import { ActionRowBuilder } from "discord.js"

export const searchSelector = (searchData) => {
    const menu = new SelectMenuBuilder()
    searchData.forEach((data, index) => {
        const title = data.title.length > 30
                ? data.title.slice(0, 30).concat("...")
                : data.title
        menu.addOptions({
            label: `${index+1}. ${title} - ${data.durationRaw}`,
            value: `${title}|${data.url}`,
        })
    })
    menu.setCustomId("search-choice")
    menu.setPlaceholder("Select your choice")
    const components = new ActionRowBuilder()
        .addComponents(menu)
    
    return components
}