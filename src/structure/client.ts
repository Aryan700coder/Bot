import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection, CommandInteraction, EmbedBuilder, REST, Routes } from "discord.js";
import { CommandType } from "../typings/command";
import { glob } from 'glob';
import { promisify } from 'util';
import { registerCommandOption } from "../typings/client";
import { Event } from "./event";
import { config } from "dotenv";
config();
import { PrismaClient } from '@prisma/client'
import server from "../server";
const globPromise = promisify(glob);
export default class ExtendedClient extends Client {
    constructor() {
        super({
            intents: 3276799
        });
    };

    commands: Collection<string, CommandType> = new Collection();
    prisma = new PrismaClient()
    start() {
        this.login(process.env.token);
        try {
            this.prisma.$connect();
            console.log('db connected')
        } catch (error) {
            console.log(error.name)
        }
        this.registerModules();
        server(this);
    };
    async registerCommands({ guildId, commands }: registerCommandOption) {
        const rest = new REST().setToken(process.env.token);
        try {
            if (!commands.length) return console.log('NO COMMANDS!')
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data: any = await rest.put(
                Routes.applicationGuildCommands('1107889554914021377', '1104637279890321410'),
                { body: commands },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    }
    async importFile(filePath: string) {
        return (await import(filePath))?.default
    }
    embedBuilder(message: string): EmbedBuilder {
        return new EmbedBuilder()
            .setColor(2763824)
            .setDescription(message)
            .setFooter({
                text: this.user.username,
                iconURL: this.user.displayAvatarURL({ extension: 'png' })
            })
    }
    async errorEmbed(interaction: CommandInteraction, message: string) {
        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor('Red')
                .setDescription(`**<:crossmark:1107912540723359754> ${message}**`)
                .setFooter({
                    text: this.user.username,
                    iconURL: this.user.displayAvatarURL({ extension: 'png' })
                })]
        })
    }
    async registerModules() {
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);

        // Use Promise.all to wait for all asynchronous operations to complete
        await Promise.all(commandFiles.map(async (filePath) => {
            const command: CommandType = await this.importFile(filePath);
            if (!command.name) return;
            this.commands.set(command.name, command);
            slashCommands.push(command);
            console.log('slash command is', slashCommands);
        }));

        await this.registerCommands({ guildId: '1104637279890321410', commands: slashCommands });

        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
        await Promise.all(eventFiles.map(async (filePath) => {
            const event: Event<keyof ClientEvents> = await this.importFile(filePath);
            this.on(event.event, event.run);
        }));
    }
    makeid(length:number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
};