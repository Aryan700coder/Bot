"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const command_1 = require("../../structure/command");
const pagination_1 = tslib_1.__importDefault(require("../../utils/pagination"));
exports.default = new command_1.Command({
    name: 'bloglist',
    description: 'Get Blog info',
    options: [
        {
            name: 'id',
            description: 'id of the blog',
            type: discord_js_1.ApplicationCommandOptionType.Number,
            required: false
        },
    ],
    devOnly: true,
    cooldown: 3000,
    async run({ client, interaction }) {
        const id = (interaction.options.get('id', false)?.value);
        if (id) {
            const blogData = await client.prisma.post.findFirst({
                where: {
                    id
                }
            });
            if (!blogData)
                return client.errorEmbed(interaction, `Cannot Find the data`);
            return interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
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
                            value: `${(0, discord_js_1.hyperlink)('Video', blogData.videoLink)}`,
                        },
                        {
                            name: 'fileLink',
                            value: `${(0, discord_js_1.hyperlink)('File', blogData.fileLink)}`,
                        },
                        {
                            name: 'Uploaded Time',
                            value: `${(0, discord_js_1.time)(blogData.uploadedDateTime)}`,
                        },
                    ])
                        .setColor(2763824)
                        .setImage(blogData.thumbnail)
                ]
            });
        }
        const datas = await client.prisma.post.findMany();
        if (!datas || !datas.length)
            return client.errorEmbed(interaction, 'No data available!');
        const embeds = [];
        datas.forEach(async (data) => {
            const embed = new discord_js_1.EmbedBuilder()
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
                    value: `${(0, discord_js_1.hyperlink)('Video', data.videoLink)}`,
                },
                {
                    name: 'fileLink',
                    value: `${(0, discord_js_1.hyperlink)('File', data.fileLink)}`,
                },
                {
                    name: 'Uploaded Time',
                    value: `${(0, discord_js_1.time)(data.uploadedDateTime)}`,
                },
            ])
                .setColor(2763824)
                .setFooter({
                text: `${data.id}`
            })
                .setImage(data.thumbnail);
            embeds.push(embed);
        });
        (0, pagination_1.default)(interaction, embeds);
    },
});
