import { EmbedBuilder } from "discord.js";


export const csgoEmbed = (action, details, userDetails) => {
    switch(action){
        case "price":{
            console.log("Create PRICE embed");
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "☢️ CSGO ☢️",
                    iconURL: "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/730/69f7ebe2735c366c65c0b33dae00e12dc40edbe4.jpg"
                })
                .setTitle("Cases price")
                .setDescription(`\`🆔 ${userDetails.steamId}\``)
                .setColor('Blue').setTimestamp()
                .setFooter({text: "_Developed by Binhkio_"})
            
            details.forEach((casePrice, index) => {
                embed.addFields({
                    name: `💠 ${casePrice.name}`,
                    value: `\`${casePrice.increase===true?'⬆️':'⬇️'} ${casePrice.price}đ\``,
                    inline: true
                })
                if(index % 2 === 0)
                    embed.addFields({ name: '\u200B', value: '\u200B', inline: true})
            })
            return embed
        }
        default:
            return false
    }
}