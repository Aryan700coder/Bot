import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder } from "discord.js";

export default async function pagination(interaction: CommandInteraction, embeds: EmbedBuilder[]) {
    let currentPage = 0;

    // Send initial embed
    await interaction.reply({ embeds: [embeds[currentPage]] });

    // Function to create button row with dynamic disabled state
    const row = (): ActionRowBuilder<any> => {
        const disabled = currentPage === 0 || currentPage === embeds.length - 1;
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('first')
                    .setEmoji('947409166484516884')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(disabled),
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setEmoji('947408394585784340')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(disabled),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setEmoji('1134329076371443784')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(disabled),
                new ButtonBuilder()
                    .setCustomId('last')
                    .setEmoji('947408528728014879')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(disabled),
            );
    }

    // Add button row to interaction
    await interaction.editReply({ embeds: [embeds[currentPage]], components: [row()] });

    // Button interaction handling
    const collector = interaction.channel.createMessageComponentCollector({ filter: (i) =>
        i.user.id === interaction.user.id && i.isButton(), idle: 10000 });

    collector.on('collect', async i => {
        if (i.customId === 'first') {
            currentPage = 0;
        } else if (i.customId === 'previous') {
            currentPage = Math.max(0, currentPage - 1);
        } else if (i.customId === 'next') {
            currentPage = Math.min(embeds.length - 1, currentPage + 1);
        } else if (i.customId === 'last') {
            currentPage = embeds.length - 1;
        }

        // Update interaction with new embed and buttons
        await i.update({ embeds: [embeds[currentPage]], components: [row()] });
    });

    collector.on('end', async () => {
        // Remove buttons after collector ends
        await interaction.editReply({ components: [row()] });
    });
}
