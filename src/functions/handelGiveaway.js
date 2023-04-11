const GiveawaysManager = require("../utils/gw");

module.exports = (client) => {
  client.giveawayManager = new GiveawaysManager(client, {
    default: {
      botsCanWin: false,
      embedColor: "#FF0000",
      embedColorEnd: "#FF0000",
      reaction: "🎉",
    },
  });
};
