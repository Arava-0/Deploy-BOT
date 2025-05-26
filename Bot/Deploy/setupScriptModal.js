const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Core = require("../../Core");

module.exports = {
    id: "deploySetupModal",
    noDeferred: false,
    ephemeral: true,
    type: `modal`,

    async execute(interaction, client) {
        const scriptContent = interaction.fields.getTextInputValue("scriptSetupContent");

        const cachedDatas = client.cache["deployScripts"][interaction.user.id];
        if (Core.isNullOrUndefined(cachedDatas)) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`${client.config.emote.error} **ERREUR**`)
                    .setColor(client.config.color.error)
                    .setDescription("Aucun script de déploiement trouvé dans le cache.")
                ]
            });
        }

        const channel = interaction.channel;
        const embed = new EmbedBuilder()
            .setTitle(`**DÉPLOIEMENT AUTOMATIQUE** ${client.config.emote.check}`)
            .setColor(client.config.color.info)
            .setDescription(
                `${scriptContent}\n` +
                `> - ID du script: \`${cachedDatas.scriptId}\`\n` +
                `> - Rôle obligatoire: ${cachedDatas.roleId ? `<@&${cachedDatas.roleId}>` : "Aucun"}\n`
            )
            .setImage({ url: `${client.config.barImage}` })

        const component = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`dep-${cachedDatas.scriptId}`)
                .setLabel(`Exécuter`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji("🔧")
        )

        await channel.send({embeds: [embed], components: [component]})
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${client.config.emote.check} **CONFIGURATION TERMINÉE**`)
                .setColor(client.config.color.info)
                .setDescription("Le script de déploiement a été configuré avec succès !")
            ]
        });
    }
};
