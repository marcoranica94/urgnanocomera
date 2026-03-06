#!/bin/sh
set -e

# Assicura che la cartella dati (potenzialmente un volume montato da Railway)
# sia scrivibile dall'utente nextjs (uid 1001)
if [ "$(id -u)" = "0" ]; then
  mkdir -p /app/data/media
  chown -R nextjs:nodejs /app/data
  exec su-exec nextjs node server.js
else
  # Già running come non-root
  exec node server.js
fi

