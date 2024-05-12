import { ApplicationCommandOptionType, Colors, CommandInteraction, CommandInteractionOption, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, hyperlink, time } from "discord.js";
import { Command } from "../../structure/command";
export default new Command({
    name: 'addblog',
    description: 'Create a blog.',
    options: [
        {
            name: 'title',
            description: 'Title of the blog',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'thumbnail',
            description: 'Thumbnail of the blog',
            type: ApplicationCommandOptionType.Attachment,
            required: true
        },
        {
            name: 'videolink',
            description: 'The Video Link',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'filelink',
            description: 'The link for file',
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],
    devOnly: true,
    cooldown: 3000,
    async run({ client, interaction }) {
        const { options } = interaction;
        const title = (options.get('title').value) as string;
        const thumbnail = options.get('thumbnail').attachment.url as string;
        const videoLink = options.get('videolink').value as string;
        const fileLink = options.get('filelink').value as string;


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
            embeds: [new EmbedBuilder()
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
                        value: `${hyperlink('Video', videoLink)}`,
                    },
                    {
                        name: 'fileLink',
                        value: `${hyperlink('File', fileLink)}`,
                    },
                    {
                        name: 'Uploaded Time',
                        value: `${time(db.uploadedDateTime)}`,
                    },
                ])
                .setColor(Colors.Green)
                .setImage(db.thumbnail)
            ]
         });
       } catch (error) {
        console.log(error)
       }
    },
})