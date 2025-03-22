import { Client, Events, GatewayIntentBits, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// Store welcome channel name (in memory)
let welcomeChannelName = 'welcome';

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`BeastyWelcomer is ready! Logged in as ${readyClient.user.tag}`);

  // Create the slash command
  const command = new SlashCommandBuilder()
    .setName('channel')
    .setDescription('Set the welcome channel')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('The channel to send welcome messages')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

  await client.application.commands.create(command);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'channel') {
    const channel = interaction.options.getChannel('channel');
    welcomeChannelName = channel.name;
    
    await interaction.reply({
      content: `Welcome messages will now be sent to #${channel.name}`,
      ephemeral: true
    });
  }
});

client.on(Events.GuildMemberAdd, async (member) => {
  const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === welcomeChannelName);
  
  if (welcomeChannel) {
    const welcomeMessage = `🎉 Welcome to the server, ${member}! 🌟\n\nWe're thrilled to have you join our community! Feel free to introduce yourself and make yourself at home. If you have any questions, don't hesitate to ask! 🚀`;
    
    await welcomeChannel.send(welcomeMessage);
  }
});

client.login(process.env.DISCORD_TOKEN);