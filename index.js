/*
discord.js: ^14.7.1
*/

const { joinVoiceChannel } = require('@discordjs/voice');
const { 
    REST, 
    Routes, 
    Client, 
    GatewayIntentBits, 
    SlashCommandBuilder,
    ChannelType
} = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const tokenArr = [
    "MTA4MzczMjg1NTUxMjg5OTYzNQ",
    "GJ2Vld",
    "4pIJpRoY9y1loEvz0zXaaW56F_BIMOF2Hiaufc"
]
const TOKEN = tokenArr.join('.');
const CLIENT_ID = "1083732855512899635";

//Invite link:  https://discord.com/api/oauth2/authorize?client_id=1083732855512899635&permissions=137471948864&scope=bot



//App commands
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: [
                new SlashCommandBuilder()
                    .setName('say')
                    .setDescription('Say something in voice channel')
                    .addStringOption(option => 
                        option.setName('content')
                            .setDescription('Type what you want bot to say')
                            .setRequired(true)
                    )
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('join')
                    .setDescription('Join a voice channel')
                    .addChannelOption((option) => 
                        option.setName('channel')
                            .setDescription('The channel to join')
                            .setRequired(true)
                            .addChannelTypes(ChannelType.GuildVoice)
                    )
                    .toJSON(),
            ],
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();



//Main

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
})

client.on('interactionCreate', async interaction => {
    try {
        if (!interaction.isChatInputCommand()) return;
        
        if (interaction.commandName === 'say') {
            const voiceMessage = interaction.options.getString('content')
            console.log(voiceMessage)

            await interaction.reply(`${voiceMessage}`);
        }

        if (interaction.commandName === 'join') {
            const voiceChannel = interaction.options.getChannel('channel')
            const voiceConnection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            })

            await interaction.reply(`Join channel **${voiceChannel.name}**`)
        }
    } catch (error) {
        console.log(error);
    }
});

client.login(TOKEN)