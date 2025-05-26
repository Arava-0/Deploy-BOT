const Core = require("../../Core");

module.exports = {
    id: "deployScriptModal",
    noDeferred: false,
    ephemeral: false,
    type: `modal`,

    async execute(interaction, client) {
        const scriptContent = interaction.fields.getTextInputValue("scriptContent");
        const newUUID = crypto.randomUUID();

        const scripts = await Core.getConfigFile("deployScripts");

        scripts[newUUID] = {
            content: scriptContent,
            createdAt: new Date().toISOString(),
        };

        await Core.updateConfig("deployScripts", scripts);
        await interaction.editReply({
            content: `Le script de déploiement a été ajouté avec succès !\n` +
                `> - ID du script: \`${newUUID}\`\n` +
                `> - Contenu du script:\n` +
                `\`\`\`sh\n${scriptContent}\`\`\``,
        });
    }
};
