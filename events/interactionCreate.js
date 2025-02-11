import { Events, MessageFlags, EmbedBuilder } from 'discord.js';

async function handleChatInputCommand(interaction) {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}

async function handleModalSubmit(interaction) {
  if (interaction.customId == 'attractionSuggest') {
    const name = interaction.fields.getTextInputValue('nameInput');
    const city = interaction.fields.getTextInputValue('cityInput');
    const cost = interaction.fields.getTextInputValue('costInput');
    const link = interaction.fields.getTextInputValue('linkInput');
    const notes = interaction.fields.getTextInputValue('notesInput');

    const embed = new EmbedBuilder()
      .setTitle(name)
      .setAuthor({
        name: interaction.user.displayName,
        iconURL: interaction.user.avatarURL(),
      })
      .setDescription(notes?.length ? notes : '_No notes provided._');

    if (city?.length)
      embed.addFields({ name: 'Location', value: city, inline: true });
    if (cost?.length)
      embed.addFields({ name: 'Cost', value: cost, inline: true });
    if (link?.length) {
      embed.addFields({ name: 'Link', value: link, inline: true });
      embed.setURL(link);

      const og = await fetch(
        `https://opengraph.io/api/1.1/site/${encodeURIComponent(link)}?app_id=${process.env.OPENGRAPH_API_KEY}`
      );
      const json = await og.json();
      const image = json.hybridGraph?.image;

      if (image) embed.setImage(image);
    }

    const response = await interaction.reply({
      embeds: [embed],
      withResponse: true,
    });
    response.resource.message.react('😍');
  }
}

export default {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      await handleChatInputCommand(interaction);
    }

    if (interaction.isModalSubmit()) {
      await handleModalSubmit(interaction);
    }
  },
};
