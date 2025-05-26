BOT_NAME := deploybot
ENTRYPOINT := index.js
PID_FILE := $(BOT_NAME).pid
LOG_FILE := $(BOT_NAME).log
MAX_LOG_LINES := 1000
TRUNCATE_TO := 500

start: ## Démarre le bot.
	@echo "▶️  Démarrage du bot $(BOT_NAME)..."
	@if [ -f $(PID_FILE) ]; then \
		echo "❌ Le bot semble déjà en cours d'exécution (PID: $$(cat $(PID_FILE)))"; \
		exit 1; \
	fi
	@if [ -f $(LOG_FILE) ] && [ $$(wc -l < $(LOG_FILE)) -gt $(MAX_LOG_LINES) ]; then \
		echo "✂️  Le fichier de log dépasse $(MAX_LOG_LINES) lignes, troncature à $(TRUNCATE_TO) lignes..."; \
		tail -n $(TRUNCATE_TO) $(LOG_FILE) > $(LOG_FILE).tmp && mv $(LOG_FILE).tmp $(LOG_FILE); \
	fi
	@nohup node $(ENTRYPOINT) > $(LOG_FILE) 2>&1 & echo $$! > $(PID_FILE)
	@echo "✅ Bot lancé avec succès (PID: $$(cat $(PID_FILE)))"

stop: ## Arrête le bot.
	@echo "🛑 Arrêt du bot $(BOT_NAME)..."
	@if [ ! -f $(PID_FILE) ]; then \
		echo "❌ Aucun PID trouvé. Le bot est-il lancé ?"; \
		exit 1; \
	fi
	@kill $$(cat $(PID_FILE)) && rm -f $(PID_FILE)
	@echo "✅ Bot arrêté."

restart: ## Redémarre le bot.
	@echo "🔄 Redémarrage du bot $(BOT_NAME)..."
	@$(MAKE) stop
	@$(MAKE) start

logs: ## Affiche les logs du bot en temps réel.
	@echo "📄 Logs du bot $(BOT_NAME):"
	@tail -f $(LOG_FILE)

truncate-logs: ## Tronque le fichier de log à $(TRUNCATE_TO) lignes.
	@echo "✂️  Troncature des logs à $(TRUNCATE_TO) lignes..."
	@tail -n $(TRUNCATE_TO) $(LOG_FILE) > $(LOG_FILE).tmp && mv $(LOG_FILE).tmp $(LOG_FILE)

status: ## Vérifie si le bot est en cours d'exécution.
	@if [ -f $(PID_FILE) ]; then \
		PID=$$(cat $(PID_FILE)); \
		if ps -p $$PID > /dev/null; then \
			echo "✅ Bot $(BOT_NAME) est en cours (PID: $$PID)"; \
		else \
			echo "⚠️  PID trouvé mais le processus ne tourne plus."; \
			echo "⚠️  Suppression du fichier PID."; \
			rm -f $(PID_FILE); \
		fi \
	else \
		echo "❌ Bot $(BOT_NAME) non lancé."; \
	fi

clean: ## Supprime les fichiers PID et logs.
	@rm -f $(PID_FILE) $(LOG_FILE)
	@echo "🧹 Fichiers PID et logs supprimés."

help: ## Affiche cette aide.
	@awk 'BEGIN {FS = ":.*##"; printf "\nCommandes disponibles:\n"} /^[a-zA-Z_-]+:.*##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
