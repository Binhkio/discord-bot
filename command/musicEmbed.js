import { EmbedBuilder } from "discord.js";


export const musicEmbed = (action, videoDetails, userDetails) => {
    // Video details
    videoDetails.title = videoDetails.title.length > 255
        ? videoDetails.title.slice(0, 250).concat("...")
        : videoDetails.title
    
    switch(action){
        case "play":{
            console.log("Create PLAY embed");
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "🔥 ĐANG PHÁT 🔥",
                    iconURL: userDetails.avatarURL({extension:"png"})
                })
                .setTitle('🎶🎶 ' + videoDetails.title)
                .setColor('Blue')
                .setImage(videoDetails.thumbnails[0].url)
                .setURL(videoDetails.url)
                // .setDescription(`👀 Lượt xem: ${videoDetails.views}`)
                .addFields({ name: '💻 Nguồn', value: `\`${videoDetails.channel.name}\``, inline: true })
                .addFields({ name: '📢 Người thêm', value: `\`${userDetails.username}\``, inline: true })
                .addFields({ name: '🕖 Thời lượng', value: `\`${videoDetails.durationRaw}\``, inline: true })
                .setTimestamp()
                .setFooter({text: "_Developed by Binhkio_"})
            return embed
        }
        case "add":{
            console.log("Create ADD embed");
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "✅ THÊM NHẠC",
                    iconURL: userDetails.avatarURL({extension:"png"})
                })
                .setTitle('🎶🎶 ' + videoDetails.title)
                .setColor('Green')
                .setURL(videoDetails.url)
                // .setDescription(`👀 Lượt xem: ${videoDetails.views}`)
                .addFields({ name: '💻 Nguồn', value: `\`${videoDetails.channel.name}\``, inline: true })
                .addFields({ name: '📢 Người thêm', value: `\`${userDetails.username}\``, inline: true })
                .addFields({ name: '🕖 Thời lượng', value: `\`${videoDetails.durationRaw}\``, inline: true })
                .setTimestamp()
                .setFooter({text: `_Developed by Binhkio_`})
            return embed
        }
        default:
            return false
    }
}