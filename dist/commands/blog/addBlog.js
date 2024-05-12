"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command_1 = require("../../structure/command");
exports.default = new command_1.Command({
    name: 'addblog',
    description: 'Create a blog.',
    options: [
        {
            name: 'title',
            description: 'Title of the blog',
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'thumbnail',
            description: 'Thumbnail of the blog',
            type: discord_js_1.ApplicationCommandOptionType.Attachment,
            required: true
        },
        {
            name: 'videolink',
            description: 'The Video Link',
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'filelink',
            description: 'The link for file',
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true
        },
    ],
    devOnly: true,
    cooldown: 3000,
    async run({ client, interaction }) {
        const { options } = interaction;
        const title = (options.get('title').value);
        const thumbnail = options.get('thumbnail').attachment.url;
        const videoLink = options.get('videolink').value;
        const fileLink = options.get('filelink').value;
        try {
            const db = await client.prisma.post.create({
                data: {
                    thumbnail,
                    title,
                    videoLink,
                    fileLink,
                }
            });
            console.log(db);
            interaction.reply({
                embeds: [new discord_js_1.EmbedBuilder()
                        .setDescription(`**<:checkmark:1107912419289866261> Added Blog!**`)
                        .addFields([
                        {
                            name: 'Id',
                            value: `\`\`\`yaml\n${db.id}\`\`\``,
                        },
                        {
                            name: 'Title',
                            value: `\`\`\`yaml\n${title}\`\`\``,
                        },
                        {
                            name: 'videoLink',
                            value: `${(0, discord_js_1.hyperlink)('Video', videoLink)}`,
                        },
                        {
                            name: 'fileLink',
                            value: `${(0, discord_js_1.hyperlink)('File', fileLink)}`,
                        },
                        {
                            name: 'Uploaded Time',
                            value: `${(0, discord_js_1.time)(db.uploadedDateTime)}`,
                        },
                    ])
                        .setColor(discord_js_1.Colors.Green)
                        .setImage(db.thumbnail)
                ]
            });
        }
        catch (error) {
            console.log(error);
        }
    },
});
