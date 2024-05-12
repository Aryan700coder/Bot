"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command_1 = require("../../structure/command");
exports.default = new command_1.Command({
    name: 'blogdelete',
    description: 'delete a blog',
    options: [
        {
            name: 'id',
            description: 'id of the blog',
            type: discord_js_1.ApplicationCommandOptionType.Number,
            required: true
        },
    ],
    devOnly: true,
    cooldown: 3000,
    async run({ client, interaction }) {
        const id = (interaction.options.get('id', true)?.value);
        const data = await client.prisma.post.findFirst({
            where: { id }
        });
        if (!data)
            return client.errorEmbed(interaction, 'Cannot find the data!');
        try {
            const { title, thumbnail } = await client.prisma.post.delete({
                where: { id }
            });
            interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setDescription(`**<:checkmark:1107912419289866261> Deleted Blog!**`)
                        .addFields([
                        {
                            name: 'Title',
                            value: `\`\`\`yaml\n${title}\`\`\``,
                        },
                        {
                            name: 'Id',
                            value: `\`\`\`yaml\n${id}\`\`\``,
                        },
                    ])
                        .setColor(discord_js_1.Colors.Yellow)
                        .setImage(thumbnail)
                ]
            });
        }
        catch (error) {
            console.error(error);
        }
        ;
    },
});
