import { ApplicationCommandOptionType, Colors, CommandInteraction, CommandInteractionOption, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, time } from "discord.js";
import { Command } from "../../structure/command";
import pagination from "../../utils/pagination";
export default new Command({
    name: 'blogdelete',
    description: 'delete a blog',
    options: [
        {
            name: 'id',
            description: 'id of the blog',
            type: ApplicationCommandOptionType.Number,
            required: true
        },
    ],
    devOnly: true,
    cooldown: 3000,
    async run({ client, interaction }) {
        const id = (interaction.options.get('id', true)?.value) as number;
        const data = await client.prisma.post.findFirst({
            where: { id}
        });

        if(!data) return client.errorEmbed(interaction, 'Cannot find the data!');

        try {
            const {title, thumbnail} = await client.prisma.post.delete({
                where: { id }
            });

            interaction.reply({
                embeds: [new EmbedBuilder()
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
                    .setColor(Colors.Yellow)
                    .setImage(thumbnail)
                ]
             });
        } catch (error) {
            console.error(error)
        };

    },
})