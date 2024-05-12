import { ApplicationCommandOptionType, CommandInteraction, CommandInteractionOption, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, hyperlink, time } from "discord.js";
import { Command } from "../../structure/command";
import pagination from "../../utils/pagination";
export default new Command({
    name: 'bloglist',
    description: 'Get Blog info',
    options: [
        {
            name: 'id',
            description: 'id of the blog',
            type: ApplicationCommandOptionType.Number,
            required: false
        },
    ],
    devOnly: true,
    cooldown: 3000,
    async run({ client, interaction }) {
        const id = (interaction.options.get('id', false)?.value) as number;

        if (id) {
            const blogData = await client.prisma.post.findFirst({
                where: {
                    id
                }
            });

            if (!blogData) return client.errorEmbed(interaction, `Cannot Find the data`)
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription(`**Blog Data**`)
                    .addFields([
                        {
                            name: 'Id',
                            value: `\`\`\`yaml\n${blogData.id}\`\`\``,
                        },
                        {
                            name: 'Title',
                            value: `\`\`\`yaml\n${blogData.title}\`\`\``,
                        },
                        {
                            name: 'videoLink',
                            value: `${hyperlink('Video', blogData.videoLink)}`,
                        },
                        {
                            name: 'fileLink',
                            value: `${hyperlink('File', blogData.fileLink)}`,
                        },
                        {
                            name: 'Uploaded Time',
                            value: `${time(blogData.uploadedDateTime)}`,
                        },
                    ])
                    .setColor(2763824)
                    .setImage(blogData.thumbnail)
                ]
            });
        }

        const datas = await client.prisma.post.findMany();
        if(!datas || !datas.length) return client.errorEmbed(interaction, 'No data available!')
        const embeds: EmbedBuilder[] = [];
        datas.forEach(async data => {
            const embed = new EmbedBuilder()
                .setDescription(`**Blog Data**`)
                .addFields([
                    {
                        name: 'Id',
                        value: `\`\`\`yaml\n${data.id}\`\`\``,
                    },
                    {
                        name: 'Title',
                        value: `\`\`\`yaml\n${data.title}\`\`\``,
                    },
                    {
                        name: 'videoLink',
                        value: `${hyperlink('Video', data.videoLink)}`,
                    },
                    {
                        name: 'fileLink',
                        value: `${hyperlink('File', data.fileLink)}`,
                    },
                    {
                        name: 'Uploaded Time',
                        value: `${time(data.uploadedDateTime)}`,
                    },
                ])
                .setColor(2763824)
                .setFooter({
                    text: `${data.id}`
                })
                .setImage(data.thumbnail);

            embeds.push(embed);
        });

        pagination(interaction, embeds);
    },
})