import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Submit an attraction suggestion.'),
  async execute(interaction) {
    // Create the modal
    const modal = new ModalBuilder()
      .setCustomId('attractionSuggest')
      .setTitle('Suggest an Attraction');

    // Add components to modal
    const inputs = [];

    // Create the text input components
    inputs.push(
      new TextInputBuilder()
        .setCustomId('nameInput')
        .setLabel('Name of Attraction')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    );

    inputs.push(
      new TextInputBuilder()
        .setCustomId('cityInput')
        .setLabel('Where is it? (City/Island)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
    );

    inputs.push(
      new TextInputBuilder()
        .setCustomId('costInput')
        .setLabel('Approximate Cost')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
    );

    inputs.push(
      new TextInputBuilder()
        .setCustomId('linkInput')
        .setLabel('Website (or Social Media) Link')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
    );

    inputs.push(
      new TextInputBuilder()
        .setCustomId('notesInput')
        .setLabel('Additional Notes')
        .setPlaceholder(
          'Feel free to include more links to images, Instagram or TikTok posts that show the place off!'
        )
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
    );

    const actionRows = inputs.map((input) =>
      new ActionRowBuilder().addComponents(input)
    );

    // Add inputs to the modal
    modal.addComponents(...actionRows);

    // Show the modal to the user
    await interaction.showModal(modal);
  },
};
