#!/bin/sh

APP_NAME=${APP_NAME:-api}
NODE_ENV=${NODE_ENV:-dev}

echo "→ Starting $APP_NAME with NODE_ENV=$NODE_ENV"

if [ "$NODE_ENV" = "prod" ]; then
  CMD="npm run start:prod:$APP_NAME"
else
  CMD="npm run start:debug:$APP_NAME"
fi

echo "→ Running: $CMD"
exec $CMD
