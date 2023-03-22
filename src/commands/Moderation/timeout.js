const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('.')
        .addSubcommand(subcommand => subcommand
            .setName(`add`)
            .setDescription(`Add timeout to a member.`)
            .addUserOption((option) => option
                .setName(`member`)
                .setDescription(`The member you want to timeout.`)
                .setRequired(true))
            .addStringOption((option) => option
                .setName(`duration`)
                .setDescription(`For how long to timeout the member (ending with "m", "h", "d")`)
                .setRequired(true))
            .addStringOption((option) => option
                .setName(`reason`)
                .setDescription(`The reason to timeout the member.`)))
        .addSubcommand(subcommand => subcommand
            .setName(`remove`)
            .setDescription(`Remove timeout from a user`)
            .addUserOption((option) => option
                .setName(`member`)
                .setDescription(`The member you want to remove timeout of.`)
                .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {

        const target = interaction.options.getUser(`member`);
        const member = interaction.guild.members.cache.get(target.id);
        const subcommand = interaction.options.getSubcommand();
        const embed = new EmbedBuilder();

        if (subcommand === "add") {

            const durationString = interaction.options.getString(`duration`);
            const durationUnit = durationString.slice(-1);
            const durationValue = parseInt(durationString.slice(0, -1));
            const reason = interaction.options.getString(`reason`) || "unknown reason";

            // Error Checks

            if (!member) {
                return await interaction.reply({
                    embeds: [embed
                        .setDescription(`<:cross:1082334173915775046> ${target.tag} was not found in the server!`)
                        .setColor('Red')
                    ],
                    ephemeral: true
                });
            }

            if (!member.kickable) {
                return await interaction.reply({
                    embeds: [embed
                        .setDescription(`<:cross:1082334173915775046> ${member.user.tag} cannot be timed out.`)
                        .setColor('Red')
                    ],
                    ephemeral: true
                });
            }

            if (interaction.member.id === member.id) {
                return await interaction.reply({
                    embeds: [embed
                        .setDescription(`<:cross:1082334173915775046> You can't timeout yourself.`)
                        .setColor('Red')
                    ],
                    ephemeral: true
                });
            }

            if (isNaN(durationValue) || !["m", "h", "d"].includes(durationUnit)) {
                return await interaction.reply({
                    embeds: [embed
                        .setTitle(`<:cross:1082334173915775046> Wrong duration format!`)
                        .setDescription(`Please include a "m" for minutes, "h" for hours and "d" for days in the duration.`)
                        .setColor('Red')
                    ], ephemeral: true
                });
            }

            const durationMilliseconds = (() => {
                switch (durationUnit) {
                    case "m":
                        return durationValue * 60 * 1000;
                    case "h":
                        return durationValue * 60 * 60 * 1000;
                    case "d":
                        return durationValue * 24 * 60 * 60 * 1000;
                }
            })();

            if (durationMilliseconds > 2419200000) {
                return await interaction.reply({
                    embeds: [embed
                        .setDescription(`<:cross:1082334173915775046> Timeout period cannot exceed 28 days.`)
                        .setColor('Red')
                    ],
                    ephemeral: true
                });
            }

            // Adding timeout to the member.
            await member.timeout(durationMilliseconds, reason).catch(err => {
                return interaction.reply({
                    embeds: [embed
                        .setDescription(`<:cross:1082334173915775046> Unable to timeout ${member.tag}.`)
                        .setColor('Red')
                    ],
                    ephemeral: true
                });
            })

            // Sending Messages
            await interaction.reply({
                embeds: [embed
                    .setTitle(`<:check:1082334169197187153> ${member.user.tag} was timed out.`)
                    .setColor(`Green`)
                ],
                ephemeral: true
            });

            await member.send({
                embeds: [embed
                    .setTitle(`<:alert:1082334164189184051> You have been timed out in **${interaction.guild.name}** for ${reason}.`)
                    .setColor(`Orange`)
                ]
            }).catch(() => {
                interaction.editReply({
                    embeds: [embed.setDescription(`<:alert:1082334164189184051> Unable to send a direct message alert.`)]
                })
            });
        }

        if (subcommand === "remove") {

            // Checks

            if (!member) {
                return await interaction.reply({
                    embeds: [embed
                        .setDescription(`<:cross:1082334173915775046> ${target.tag} was not found in the server!`)
                        .setColor('Red')
                    ],
                    ephemeral: true
                });
            }

            if (!member.kickable) {
                return await interaction.reply({
                    embeds: [embed
                        .setDescription(`<:cross:1082334173915775046> ${member.user.tag} cannot be removed from timeout.`)
                        .setColor('Red')
                    ],
                    ephemeral: true
                });
            }

            if (interaction.member.id === member.id) {
                return await interaction.reply({
                    embeds: [embed
                        .setDescription(`<:cross:1082334173915775046> You can't remove timeout from yourself.`)
                        .setColor('Red')
                    ],
                    ephemeral: true
                });
            }

            // Remove timeout to the member.
            await member.timeout(null).catch(err => {
                return interaction.reply({
                    embeds: [embed
                        .setDescription(`<:cross:1082334173915775046> Unable to remove timeout from ${member.tag}.`)
                        .setColor('Red')
                    ],
                    ephemeral: true
                });
            })

            // Sending Messages
            await interaction.reply({
                embeds: [embed
                    .setTitle(`<:check:1082334169197187153> ${member.user.tag} was removed from timeout.`)
                    .setColor(`Green`)
                ],
                ephemeral: true
            });

            await member.send({
                embeds: [embed
                    .setTitle(`<:alert:1082334164189184051> Your timeout out in **${interaction.guild.name}** has been removed.`)
                    .setColor(`Orange`)
                ]
            }).catch(() => {
                interaction.editReply({
                    embeds: [embed.setDescription(`<:alert:1082334164189184051> Unable to send a direct message alert.`)]
                })
            });

        }

    }

} 