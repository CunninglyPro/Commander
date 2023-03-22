const vanitySchema = require("../Schemas.js/vanitySchema");

module.exports = {
  name: "presenceUpdate",
  async execute(oldPresence, newPresence) {
    const schema = await vanitySchema.findOne({
      GuildID: newPresence.guild.id
    })

    if (!schema || !schema.Text || !schema.Role) return;
    if (newPresence.user.bot) return;
    if (newPresence.status === "offline" || newPresence.status === "invisible")
      return;

      const text = schema.Text
    if (newPresence.activities[0]?.state.toLowerCase().includes(`${text}`)) {
      const guildID = schema.GuildID;
      const role = schema.Role;

      const guild = await newPresence.client.guilds.fetch(guildID);
      const member = await guild.members.fetch(newPresence.user.id);
      if (member.roles.cache.has(role)) { 
        return;
      }

      await member.roles.add(role);
    }

    if (!newPresence.activities[0]?.state.toLowerCase().includes(`${text}`)) {
      const guildID = schema.GuildID;
      const role = schema.Role;

      const guild = await newPresence.client.guilds.fetch(guildID);
      const member = await guild.members.fetch(newPresence.user.id);
      if (!member.roles.cache.has(role)) { 
        return;
      }

      await member.roles.remove(role);
    }
  },
};
