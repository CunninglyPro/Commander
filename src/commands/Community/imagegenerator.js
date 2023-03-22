const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);
const { Configuration, OpenAIApi } = require(`openai`);

const configuration = new Configuration({
    apiKey: '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'
});

const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`imagegenerator`)
        .setDescription(`Generate an image using the power of AI.`)
        .addStringOption(option => option.setName(`prompt`).setDescription(`What you want the AI to generate?`).setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply();

        const prompt = interaction.options.getString(`prompt`);

        try {

            const response = await openai.createImage({
                prompt: `${prompt}`,
                n: 1,
                size: `1024x1024`,
            });

            const image = response.data.data[0].url;

            const doneEmbed = new EmbedBuilder()
                .setColor(`Blue`)
                .setTitle(`Your image has been generated!`)
                .setDescription(`**Prompt:** ${prompt}`)
                .setImage(image)

            await interaction.reply({ embeds: [doneEmbed] });

        } catch (e) {
            await interaction.editReply({ embeds: [new EmbedBuilder().setColor("Red").setDescription(`<:cross:1082334173915775046> Unable to generate Image.\n**Error**: ${e.response}.`)], ephemeral: true });
        }

    }
}