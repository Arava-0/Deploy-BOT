# 🚀 DeployBot

Un bot Discord permettant d'ajouter, gérer et exécuter des scripts de déploiement via des commandes slash et des boutons.

## ✨ Fonctionnalités
> - 📝 Ajouter des scripts via une commande et un modal
> - 🔘 Créer un bouton pour exécuter un script avec un rôle requis
> - 🖥️ Exécution réelle du script en bash
> - 📄 Log de sortie envoyé en pièce jointe (sans fichier temporaire sur le disque)

## 💬 Commandes Slash

### `/deploy-script add`
> 📝 Ouvre un modal pour ajouter un script.

### `/deploy-script setup`
> 🔧 Crée un message avec un bouton pour exécuter un script.
- `id` : ID du script
- `role` (optionnel) : rôle requis

### `/deploy-script delete`
> 🗑️ Supprime un script.
- `id` : ID du script

### `/deploy-script list`
> 📜 Liste les scripts disponibles.

---

✅ Utilisable uniquement par les administrateurs.  
📁 Les scripts sont stockés dans le fichier de config `deployScripts.json`.
