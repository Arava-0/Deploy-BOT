const { ChatInputCommandInteraction, SlashCommandBuilder, Client, PermissionFlagsBits, InteractionContextType  } = require('discord.js');

module.exports = {

    type: "command",
    userCooldown: 5000,
    serverCooldown: null,
    globalCooldown: null,
    noDeferred: false,
    ephemeral: true,

    data: new SlashCommandBuilder()
    .setName("deploy-script")
    .setDescription("Gère les scripts de déploiement")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addSubcommand(subcommand =>
        subcommand
            .setName("setup")
            .setDescription("Crée un nouveau script de déploiement")
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("delete")
            .setDescription("Supprime un script de déploiement")
            .addIntegerOption(option =>
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

        if (subcommand === "setup") {
            await interaction.editReply("Script de déploiement créé avec succès !");
        } else if (subcommand === "delete") {
            const id = interaction.options.getInteger("id");
            await interaction.editReply(`Script de déploiement avec ID ${id} supprimé avec succès !`);
        } else if (subcommand === "list") {
            await interaction.editReply("Liste des scripts de déploiement : ...");
        }
    }
}
