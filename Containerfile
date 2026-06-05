FROM node:22-bookworm
WORKDIR /app
COPY . .
CMD ["node", "src/cli.js", "doctor"]
