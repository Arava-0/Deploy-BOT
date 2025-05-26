const { EmbedBuilder } = require("discord.js");
const Core = require("../../Core");

module.exports = {
    id: "deployScriptModal",
    noDeferred: false,
    ephemeral: false,
    type: `modal`,

    async execute(interaction, client) {
        const scriptContent = interaction.fields.getTextInputValue("scriptContent");
        const newUUID = crypto.randomUUID().replace(/-/g, '').slice(0, 16);

        const scripts = await Core.getConfigFile("deployScripts");

        scripts[newUUID] = {
            content: scriptContent,
            createdAt: new Date().toISOString(),
        };

        await Core.updateConfig("deployScripts", scripts);
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${client.config.emote.check} **SCRIPT DE DÉPLOIEMENT AJOUTÉ**`)
                .setColor(client.config.color.info)
                .setTimestamp()
                .setFooter({ text: `ID: ${newUUID}` })
                .setDescription(
                    `Le script de déploiement a été ajouté avec succès !\n` +
                    `> - Contenu du script:\n` +
                    `\`\`\`sh\n${scriptContent}\`\`\``
                )
            ]
        });
    }
};
