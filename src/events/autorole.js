const { Events } = require(`discord.js`);
const { QuickDB } = require(`quick.db`);
const db = new QuickDB();

module.exports = {
  once: false,
  name: Events.GuildMemberAdd,
  async execute(member) {
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
