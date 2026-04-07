{
  "name": "dtf-gang-sheet-configurator",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "remix vite:build",
    "dev": "shopify app dev",
    "lint": "eslint --cache --cache-location ./node_modules/.cache/eslint .",
    "setup": "prisma generate && prisma migrate deploy",
    "start": "remix-serve ./build/server/index.js",
    "docker-start": "npm run setup && npm start",
    "prisma:push": "prisma db push",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node --require tsconfig-paths/register prisma/seed.ts",
    "prisma:studio": "prisma studio",
    "typecheck": "tsc --noEmit"
  },
  "type": "module",
  "engines": {
    "node": ">=18.20.0"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.600.0",
    "@aws-sdk/s3-request-presigner": "^3.600.0",
    "@prisma/client": "^5.16.0",
    "@remix-run/node": "^2.10.0",
    "@remix-run/react": "^2.10.0",
    "@remix-run/serve": "^2.10.0",
    "@shopify/app-bridge-react": "^4.1.6",
    "@shopify/polaris": "^13.3.0",
    "@shopify/shopify-app-remix": "^3.3.0",
    "@shopify/shopify-app-session-storage-prisma": "^5.0.8",
    "framer-motion": "^11.3.0",
    "isbot": "^5.1.12",
    "konva": "^9.3.14",
    "multer": "^1.4.5-lts.1",
    "pdfjs-dist": "^4.4.168",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-konva": "^18.2.10",
    "sharp": "^0.33.4",
    "use-image": "^1.1.1",
    "uuid": "^10.0.0",
    "zustand": "^4.5.4",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@remix-run/dev": "^2.10.0",
    "@shopify/api-codegen-preset": "^1.1.1",
    "@types/multer": "^1.4.11",
    "@types/node": "^20.14.9",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/uuid": "^10.0.0",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "postcss": "^8.4.40",
    "prisma": "^5.16.0",
    "tailwindcss": "^3.4.6",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.5.3",
    "vite": "^5.3.4",
    "vite-tsconfig-paths": "^5.0.1"
  },
  "workspaces": [
    "extensions/*"
  ]
}
