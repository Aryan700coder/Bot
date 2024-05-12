"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const event_1 = require("../structure/event");
exports.default = new event_1.Event('interactionCreate', async (interaction) => {
    if (interaction.user.bot || !interaction.guild || !interaction.isCommand())
        return;
    const command = __1.client.commands.get(interaction.commandName);
    if (!command)
        return interaction.reply('Invalid command!');
    if (command.devOnly && interaction.user.id !== '709311040806060102')
        return __1.client.errorEmbed(interaction, "Only <@709311040806060102> can use this command!");
    command.run({
        client: __1.client,
        interaction
    });
});
