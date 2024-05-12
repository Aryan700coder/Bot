"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../../structure/command");
exports.default = new command_1.Command({
    name: 'ping',
    description: 'replies with bot\'s latency.',
    cooldown: 3000,
    run({ client, interaction }) {
        interaction.reply({
            embeds: [client.embedBuilder(`**🏓 Pong: \`${client.ws.ping}ms\`**`)]
        });
    },
});
