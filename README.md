# 🏮 Akatsuki’s Draft — Workspace Overview

Welcome to the **Akatsuki's Draft** project workspace.

The complete production-grade backend for Akatsuki's Draft is located in the [`server/`](./server) directory.

### Quick Commands from Workspace Root

```bash
# Install backend dependencies
npm run install:server

# Run backend automated tests (Jest + Supertest with in-memory MongoDB)
npm test

# Run test coverage report
npm run test:coverage

# Seed the initial Administrator
npm run seed:admin

# Start development server with Nodemon
npm run dev
```

For complete architectural details, API reference, environment setup, and Postman collections, see [server/README.md](./server/README.md).
