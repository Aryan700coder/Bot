import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../structure/command";

export default new Command({
    name: 'ping',
    description: 'replies with bot\'s latency.',
    cooldown: 3000,
    run({ client, interaction }) {
        interaction.reply({
            embeds: [client.embedBuilder(`**🏓 Pong: \`${client.ws.ping}ms\`**`)]
        });
    },
})