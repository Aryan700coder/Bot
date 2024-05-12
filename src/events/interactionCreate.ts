import { client } from "..";
import { Event } from "../structure/event";
export default new Event('interactionCreate', async(interaction) => {
    if(interaction.user.bot || !interaction.guild || !interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if(!command) return interaction.reply('Invalid command!');
    if(command.devOnly && interaction.user.id !== '709311040806060102') return client.errorEmbed(interaction, "Only <@709311040806060102> can use this command!")
    command.run({
        client,
        interaction
    });
})