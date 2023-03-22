const { channel } = require("diagnostics_channel");
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
  MessageManager,
  Embed,
  Events,
  Collection,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require(`discord.js`);
const fs = require("fs");
const GiveawaysManager = require("./utils/gw");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();

require("dotenv").config();

const functions = fs
  .readdirSync("./src/functions")
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

client.giveawayManager = new GiveawaysManager(client, {
  default: {
    botsCanWin: false,
    embedColor: "#FF0000",
    embedColorEnd: "#FF0000",
    reaction: "🎉",
  },
});

(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.handleEvents(eventFiles, "./src/events");
  client.handleCommands(commandFolders, "./src/commands");
  client.login(process.env.token);
})();

// Snipe Event

client.on(Events.MessageDelete, async (message) => {
  client.snipes = new Collection();
  if (message.author?.bot) return;

  client.snipes.set(message.channel.id, {
    message: message.content,
    author: message.author,
    channel: message.channel,
    time: Date.now(),
    image: message.attachments?.first()?.url || null,
  });
});

client.on(Events.MessageUpdate, async (newMessage, oldMessage) => {
  client.editsnipe = new Collection();
  if (newMessage.author?.bot) return;

  const division = 1950;

  // Add a "..." if message is longer than 1950 characters.

  const orginalMsg =
    oldMessage.content.slice(0, division) +
    (oldMessage.content.length > division ? " ..." : "");

  const editedMsg =
    newMessage.content.slice(0, division) +
    (newMessage.content.length > division ? " ..." : "");

  // Set the message to editsnipes.

  client.editsnipe.set(newMessage.channel.id, {
    prevs: orginalMsg,
    currs: editedMsg,
    time: Date.now(),
    author: newMessage.author,
    channel: newMessage.channel,
  });
});


// Messagecreate Event

client.on(Events.MessageCreate, async (message) => {
  if (message.content.match(RegExp(`^<@!?${client.user.id}>$`))) {
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setThumbnail(client.user.avatarURL({ dynamic: true }))
          .setDescription(
            `Hello my friend, I'm **${
              client.user.username
            }**, a robot!\nI am serving in **${
              client.guilds.cache.size
            }** servers with a total of **${client.guilds.cache.reduce(
              (a, b) => a + b.memberCount,
              0
            )}** members.\nYou can use my commands by writing "/" (slash) in the chat input box.\nBot coded by Antinityfx, Antinity#5559.`
          ),
      ],
    });
  }

  if (!message.guild || message.author.bot) return;

  try {
    // Custom Command System
    const CustomCommand = require("../src/Schemas.js/customcommand");
    const CustomCommands = await CustomCommand.find({
      GuildID: message.guild.id,
    });

    if (CustomCommands.length !== 0) {
      // loop through all custom commands
      for (const command of CustomCommands) {
        // if the message contains the custom command keyword
        if (message.content.toLowerCase().includes(command.Keyword)) {
          // send the custom command response
          message.channel.send(command.Reply);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
});

// Welcome and AutoRole Event

const { QuickDB } = require(`quick.db`);
const db = new QuickDB();

client.on(Events.GuildMemberAdd, async (member) => {
  let welcomeChannelID = await db.get(`welchannel_${member.guild.id}`);
  let welcomeChannel = member.guild.channels.cache.get(welcomeChannelID);
  if (!welcomeChannel) {
    return;
  }
  const welcomeMsgArray = [
    `Greetings, ${member}!`,
    `A wild ${member} just appeared!`,
    `${member} joined the party!`,
    `Welcome ${member}, we hope you brought pizza.`,
    `It's a pleasure to have you here, ${member}!`,
    `We were waiting for you, ${member}!`,
    `Welcome, ${member}`,
    `${member} made it into us.`,
    `${member} hopped on.`,
    `${member} just joined!`,
    `Everyone welcome ${member}!`,
    `Welcome ${member}, welcome.`,
  ];
  const welcomeMsg =
    welcomeMsgArray[Math.floor(Math.random() * welcomeMsgArray.length)];

  if ((welcomeChannelID = null)) return;
  welcomeChannel.send({ content: `${welcomeMsg}` }).catch((error) => {
    console.error(error);
  });

  let autoRoleID = await db.get(`autoRole_${member.guild.id}`);
  if (!autoRoleID) return;
  let autoRole = member.guild.roles.cache.get(autoRoleID);
  if (!autoRole) {
    return;
  }

  member.roles.add(autoRole).catch((err) => {
    return;
  });
});

// Level System

const levelSchema = require("./Schemas.js/level");
client.on(Events.MessageCreate, async (message) => {
  const { guild, author } = message;
  if (!guild || author.bot) return;

  levelSchema.findOne(
    { Guild: guild.id, User: author.id },
    async (err, data) => {
      if (err) throw err;

      if (!data) {
        levelSchema.create({
          Guild: guild.id,
          User: author.id,
          XP: 0,
          Level: 0,
        });
      }
    }
  );

  const channel = message.channel;
  const give = 1;

  const data = await levelSchema.findOne({ Guild: guild.id, User: author.id });

  if (!data) return;

  const requiedXP = data.Level * data.Level * 20 + 20;

  if (data.XP + give >= requiedXP) {
    data.XP += give;
    data.Level += 1;
    await data.save();

    if (!channel) return;

    const embed = new EmbedBuilder()
      .setDescription(`:tada: ${author} reached level ${data.Level}!`)
      .setColor("Blue");

    channel.send({ embeds: [embed] });
  } else {
    data.XP += give;
    data.save();
  }
});
