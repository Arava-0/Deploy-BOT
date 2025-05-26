const { ChatInputCommandInteraction, SlashCommandBuilder, Client, PermissionFlagsBits, InteractionContextType, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder  } = require('discord.js');
const Core = require("../../Core");

module.exports = {
    type: "command",
    userCooldown: 5000,
    serverCooldown: null,
    globalCooldown: null,
    noDeferred: true,
    ephemeral: true,

    data: new SlashCommandBuilder()
    .setName("deploy-script")
    .setDescription("Gère les scripts de déploiement")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addSubcommand(subcommand =>
        subcommand
            .setName("add")
            .setDescription("Crée un nouveau script de déploiement")
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("delete")
            .setDescription("Supprime un script de déploiement")
            .addStringOption(option =>
                option.setName("id")
                    .setDescription("ID du script de déploiement à supprimer")
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("list")
            .setDescription("Liste les scripts de déploiement existants")
    ),

    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "add") {
            const modal = new ModalBuilder()
                .setCustomId("deployScriptModal")
                .setTitle("Ajouter un script de déploiement");

            const modalInput = new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("scriptContent")
                    .setLabel("Contenu du script")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(2000)
                    .setPlaceholder(
                        `Contenu de votre script de déploiement...\n` +
                        `> git pull origin main ; make deploy ; ...`
                    )
            );

            modal.addComponents(modalInput);
            await interaction.showModal(modal);
            return;
        }

        await interaction.deferReply();
        const deployScripts = await Core.getConfigFile("deployScripts");

        if (subcommand === "delete") {
            const id = interaction.options.getString("id");

            if (!deployScripts[id]) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`**SCRIPT DE DÉPLOIEMENT INEXISTANT**`)
                            .setDescription(`Aucun script de déploiement trouvé avec l'ID \`${id}\`.`)
                            .setColor(client.config.color.error)
                            .setTimestamp()
                    ]
                });
                return;
            }

            delete deployScripts[id];
            await Core.updateConfig("deployScripts", deployScripts);

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`**SCRIPT DE DÉPLOIEMENT SUPPRIMÉ**`)
                        .setDescription(`Le script de déploiement avec l'ID \`${id}\` a été supprimé avec succès.`)
                        .setColor(client.config.color.success)
                        .setTimestamp()
                ]
            });
            return;
        }

        if (subcommand === "list") {
            if (Object.keys(deployScripts).length === 0) {
                await interaction.editReply({embeds: [
                    new EmbedBuilder()
                        .setTitle(`**AUCUN SCRIPT DE DÉPLOIEMENT**`)
                        .setDescription("Il n'y a actuellement aucun script de déploiement enregistré.")
                        .setColor(client.config.color.error)
                        .setTimestamp()
                ]});
                return;
            }

            let sortedDeployScripts = Object.fromEntries(
                Object.entries(deployScripts).sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt))
            );

            let response = new EmbedBuilder()
                .setTitle(`**SCRIPTS DE DÉPLOIEMENT**`)
                .setDescription("Voici la liste des scripts de déploiement existants :\n\n")
                .setTimestamp()
                .setColor(client.config.color.success)
                .setFooter({ text: `Total: ${Object.keys(deployScripts).length} script(s)` });

            let description = "Voici la liste des scripts de déploiement existants :\n";
            for (const [id, script] of Object.entries(sortedDeployScripts)) {
                description +=
                    `> - **UUID**: \`${id}\`\n` +
                    `> - **Créé**: <t:${Math.floor(new Date(script.createdAt).getTime() / 1000)}:R>\n` +
                    `> - **Contenu**:\n` +
                    `\`\`\`sh\n${script.content}\`\`\`\n\n`;
            }
            response.setDescription(description);

            return await interaction.editReply({ embeds: [response] });
        }
    }
}
