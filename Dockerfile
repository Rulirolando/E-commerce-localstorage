# 1. Gunakan image dasar Node.js
FROM node:20-alpine AS builder

# 2. Tentukan folder kerja di dalam kontainer
WORKDIR /app

# 3. Copy file package.json dulu (biar install library lebih cepat)
COPY package*.json ./
COPY prisma ./prisma/

# Tambahkan flag --legacy-peer-deps untuk mengatasi konflik versi
RUN npm install --legacy-peer-deps

# 5. Copy semua file proyekmu ke dalam kontainer
COPY . .



# Kita berikan URL palsu hanya agar Prisma mau men-generate client
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/worker ./worker
COPY --from=builder /app/generated ./generated


# 8. Buka port yang digunakan aplikasi
EXPOSE 3000

CMD ["npx", "tsx", "server.js"]
