import { ChannelType, REST, Routes, SlashCommandBuilder } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

export const registerCommand = async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
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
                new SlashCommandBuilder()
                    .setName('gpt')
                    .setDescription('Chat with ChatGPT')
                    .addStringOption(option =>
                        option.setName('message')
                            .setDescription('Type what you want to chat with ChatGPT')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option.setName('type')
                            .setDescription('The type of the response')
                            .addChoices({
                                name: 'Basic text',
                                value: 'text',
                            })
                            .addChoices({
                                name: 'Code',
                                value: 'code',
                            })
                    )
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('search')
                    .setDescription('Search video on Youtube by name')
                    .addStringOption(option => 
                        option.setName('name')
                            .setDescription('Name of Youtube video')
                            .setRequired(true)
                    ),
                new SlashCommandBuilder()
                    .setName('play')
                    .setDescription('Play music by Youtube URL')
                    .addStringOption(option => 
                        option.setName('url')
                            .setDescription('URL of Youtube video')
                            .setRequired(true)
                    )
                    .addBooleanOption(option => 
                        option.setName('now')
                            .setDescription('Play your audio now, skip any playing audio')
                    )
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('addlist')
                    .setDescription('Play a list of music by Youtube URL')
                    .addStringOption(option => 
                        option.setName('url')
                            .setDescription('URL of Youtube list')
                            .setRequired(true)
                    )
                    .addBooleanOption(option => 
                        option.setName('now')
                            .setDescription('Play your audio now, skip any playing audio')
                    )
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('pause')
                    .setDescription('Pause')
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('resume')
                    .setDescription('Resume')
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('skip')
                    .setDescription('Skip')
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('stop')
                    .setDescription('Stop play music')
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('fuckoff')
                    .setDescription('Stop play those fuvking music')
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('record')
                    .setDescription('Recording your voice')
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('csgo')
                    .setDescription('View CSGO profile')
                    .addStringOption(option =>
                        option.setName('steamid')
                            .setDescription('Type your steam ID')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option.setName('option')
                            .setDescription('Your option')
                            .addChoices({
                                name: 'cases price',
                                value: 'cases-price',
                            })
                    )
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('disconnect')
                    .setDescription('Disconnect from current channel')
                    .toJSON(),
                new SlashCommandBuilder()
                    .setName('leave')
                    .setDescription('Disconnect from current channel')
                    .toJSON(),
            ],
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}