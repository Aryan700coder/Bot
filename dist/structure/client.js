"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const glob_1 = require("glob");
const util_1 = require("util");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const client_1 = require("@prisma/client");
const server_1 = tslib_1.__importDefault(require("../server"));
const globPromise = (0, util_1.promisify)(glob_1.glob);
class ExtendedClient extends discord_js_1.Client {
    constructor() {
        super({
            intents: 3276799
        });
    }
    ;
    commands = new discord_js_1.Collection();
    prisma = new client_1.PrismaClient();
    start() {
        this.login(process.env.token);
        try {
            this.prisma.$connect();
            console.log('db connected');
        }
        catch (error) {
            console.log(error.name);
        }
        this.registerModules();
        (0, server_1.default)(this);
    }
    ;
    async registerCommands({ guildId, commands }) {
        const rest = new discord_js_1.REST().setToken(process.env.token);
        try {
            if (!commands.length)
                return console.log('NO COMMANDS!');
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(discord_js_1.Routes.applicationGuildCommands('1107889554914021377', '1104637279890321410'), { body: commands });
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
        catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    }
    async importFile(filePath) {
        return (await Promise.resolve(`${filePath}`).then(s => tslib_1.__importStar(require(s))))?.default;
    }
    embedBuilder(message) {
        return new discord_js_1.EmbedBuilder()
            .setColor(2763824)
            .setDescription(message)
            .setFooter({
            text: this.user.username,
            iconURL: this.user.displayAvatarURL({ extension: 'png' })
        });
    }
    async errorEmbed(interaction, message) {
        return interaction.reply({
            embeds: [new discord_js_1.EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`**<:crossmark:1107912540723359754> ${message}**`)
                    .setFooter({
                    text: this.user.username,
                    iconURL: this.user.displayAvatarURL({ extension: 'png' })
                })]
        });
    }
    async registerModules() {
        const slashCommands = [];
        const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);
        // Use Promise.all to wait for all asynchronous operations to complete
        await Promise.all(commandFiles.map(async (filePath) => {
            const command = await this.importFile(filePath);
            if (!command.name)
                return;
            this.commands.set(command.name, command);
            slashCommands.push(command);
            console.log('slash command is', slashCommands);
        }));
        await this.registerCommands({ guildId: '1104637279890321410', commands: slashCommands });
        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
        await Promise.all(eventFiles.map(async (filePath) => {
            const event = await this.importFile(filePath);
            this.on(event.event, event.run);
        }));
    }
    makeid(length) {
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
}
exports.default = ExtendedClient;
;
