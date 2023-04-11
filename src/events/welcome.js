const { Events, EmbedBuilder } = require(`discord.js`);
const { QuickDB } = require(`quick.db`);
const db = new QuickDB();

module.exports = {
  once: false,
  name: Events.GuildMemberAdd,
  async execute(member) {
    let welcomeChannelID = await db.get(`welchannel_${member.guild.id}`);
    let welcomeChannel = member.guild.channels.cache.get(welcomeChannelID);
    if (!welcomeChannel) {
      return;
    }
    const welcomeMsg = `Welcome to the ${member.guild.name}, ${member}`;

    if ((welcomeChannelID = null)) return;
    welcomeChannel.send({ content: `${welcomeMsg}` }).catch(() => {
      return;
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
  },
};
