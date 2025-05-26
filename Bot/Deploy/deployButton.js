const { EmbedBuilder } = require("discord.js");
const Core = require("../../Core");

module.exports = {
    id: "dep-{!}",
    noDeferred: false,
    ephemeral: true,
    type: `button`,

    async execute(interaction, client, scriptId) {
        const scripts = await Core.getConfigFile("deployScripts");
        let role = null;

        try {
            role = interaction.message.embeds[0].description.split('Rôle obligatoire: ')[1].split('\n')[0].trim();
        } catch (_err) {}

        if (role == "Aucun")
            role = null;
        else
            role = role.replace(/<@&|>/g, "");

        if (role && !interaction.member.roles.cache.has(role)) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${client.config.emote.error} **PERMISSIONS INSUFFISANTES**`)
                        .setColor(client.config.color.error)
                        .setTimestamp()
                        .setDescription(`Vous devez avoir le rôle <@&${role}> pour exécuter ce script de déploiement.`)
                ]
            });
        }

        const script = scripts[scriptId];
        if (Core.isNullOrUndefined(script)) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${client.config.emote.error} **SCRIPT DE DÉPLOIEMENT INCONNU**`)
                        .setColor(client.config.color.error)
                        .setTimestamp()
                        .setDescription(`Le script de déploiement avec l'ID \`${scriptId}\` n'existe plus.`)
                ]
            });
        }

        if (Core.isNullOrUndefined(script.content) || script.content.length < 1) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${client.config.emote.error} **CONTENU DU SCRIPT INDISPONIBLE**`)
                        .setColor(client.config.color.error)
                        .setTimestamp()
                        .setDescription(`Le contenu du script de déploiement avec l'ID \`${scriptId}\` est vide ou indisponible.`)
                ]
            });
        }

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${client.config.emote.check} **DÉPLOIEMENT EN COURS**`)
                    .setColor(client.config.color.info)
                    .setDescription(
                        `Le script de déploiement avec l'ID \`${scriptId}\` est en cours d'exécution...\n` +
                        `Contenu du script:\n\`\`\`sh\n${script.content}\n\`\`\`\n`
                    )
                    .setTimestamp()
            ]
        })
    }
};
