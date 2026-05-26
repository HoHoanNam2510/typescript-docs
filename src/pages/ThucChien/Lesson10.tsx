import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const POPULAR_LIBS = `// TypeScript Ecosystem — thư viện nổi bật

// ══ Validation & Schema ════════════════════════════
// Zod     — runtime validation + type inference (de-facto)
// Valibot — lightweight Zod alternative (tree-shakeable)
// Yup     — older, less TypeScript-native

// ══ ORMs & Database ════════════════════════════════
// Prisma  — generated TypeScript types per schema
// Drizzle — TypeScript-first, SQL-like syntax
// TypeORM — decorator-based, matures with TS
// Kysely  — type-safe query builder

// ══ API ════════════════════════════════════════════
// tRPC    — end-to-end typesafe APIs (no schema needed)
// Hono    — Cloudflare Workers / Bun / Node, type-safe
// Fastify — faster than Express, good TS support
// NestJS  — Angular-like DI, decorators, full framework

// ══ State Management (React) ══════════════════════
// Zustand — minimal, great TypeScript inference
// Jotai   — atomic state, TypeScript-first
// TanStack Query — async state, fully typed

// ══ Testing ════════════════════════════════════════
// Vitest  — Vite-native, fast, TypeScript built-in
// Jest    — popular, cần ts-jest hoặc babel-jest
// Playwright — E2E, typed browser automation

// ══ Utilities ═════════════════════════════════════
// type-fest      — collection of useful utility types
// ts-pattern     — pattern matching cho TypeScript
// effect         — functional effect system
// neverthrow     — Result type (no exceptions)

// Ví dụ ts-pattern:
import { match } from 'ts-pattern';

type Action =
  | { type: 'fetch';  url: string }
  | { type: 'store';  key: string; value: unknown }
  | { type: 'delete'; key: string };

const result = match(action)
  .with({ type: 'fetch' },  ({ url })   => fetchData(url))
  .with({ type: 'store' },  ({ key, value }) => store(key, value))
  .with({ type: 'delete' }, ({ key })   => deleteKey(key))
  .exhaustive(); // TypeScript error nếu thiếu case`;

const TRPC = `// tRPC — End-to-end typesafe APIs
// npm install @trpc/server @trpc/client @trpc/react-query

// SERVER: src/server/router.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

const userRouter = t.router({
  getById: t.procedure
    .input(z.string().uuid())
    .query(async ({ input: id }) => {
      const user = await db.user.findUnique({ where: { id } });
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });
      return user;
    }),

  create: t.procedure
    .input(z.object({
      name:  z.string().min(2),
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      return db.user.create({ data: input });
    }),

  list: t.procedure
    .input(z.object({ page: z.number().default(1), limit: z.number().default(10) }).optional())
    .query(async ({ input }) => {
      const { page = 1, limit = 10 } = input ?? {};
      return db.user.findMany({ skip: (page - 1) * limit, take: limit });
    }),
});

export const appRouter = t.router({ user: userRouter });
export type AppRouter = typeof appRouter; // export type sang client

// CLIENT: src/client/api.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/router';

const api = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: 'http://localhost:3000/trpc' })],
});

// FULLY TYPED — autocomplete và type-check!
const user = await api.user.getById.query('some-uuid');
// user: { id: string; name: string; email: string; ... }

const newUser = await api.user.create.mutate({ name: 'Alice', email: 'alice@ex.com' });`;

const PRISMA_TYPES = `// Prisma — Generated TypeScript types

// schema.prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role { ADMIN USER MODERATOR }

// Prisma generate → @prisma/client
// Tự động tạo types:
import { PrismaClient, User, Post, Role } from '@prisma/client';
import type { Prisma } from '@prisma/client';

const db = new PrismaClient();

// CRUD fully typed
const user: User = await db.user.findUniqueOrThrow({ where: { id: '...' } });
const users: User[] = await db.user.findMany({ where: { role: Role.ADMIN } });

// Input types từ Prisma — không cần viết thủ công
type CreateUserInput  = Prisma.UserCreateInput;
type UpdateUserInput  = Prisma.UserUpdateInput;
type UserWhereInput   = Prisma.UserWhereInput;
type UserOrderByInput = Prisma.UserOrderByWithRelationInput;

// Include related — type-safe
const userWithPosts = await db.user.findUnique({
  where:   { id: '...' },
  include: { posts: true },
});
// userWithPosts: (User & { posts: Post[] }) | null

// Select — chỉ lấy fields cần
const userPreview = await db.user.findMany({
  select: { id: true, name: true, email: true },
});
// userPreview: { id: string; name: string; email: string }[]

// Prisma Validator — validate objects against model
const updateData = Prisma.validator<Prisma.UserUpdateInput>()({
  name: 'New Name',
  updatedAt: new Date(),
});`;

const MONOREPO = `// Monorepo với TypeScript — pnpm workspaces

// Cấu trúc
// apps/
//   web/          ← React frontend (Vite)
//   api/          ← Express backend
// packages/
//   ui/           ← Shared React components
//   types/        ← Shared TypeScript types
//   utils/        ← Shared utilities
// pnpm-workspace.yaml

// pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'

// packages/types/package.json
{
  "name": "@myapp/types",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types":  "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}

// packages/types/src/index.ts
export type { User, CreateUserDto } from './user';
export type { Post, CreatePostDto } from './post';
export type { ApiResponse, PaginatedResponse } from './api';

// apps/api/package.json — depend on shared types
{
  "dependencies": {
    "@myapp/types": "workspace:*"
  }
}

// apps/api/src/index.ts
import type { User, ApiResponse } from '@myapp/types';

// apps/web/package.json
{
  "dependencies": {
    "@myapp/types": "workspace:*",
    "@myapp/ui":    "workspace:*"
  }
}

// Commands
// pnpm --filter @myapp/types build
// pnpm --filter @myapp/api dev
// pnpm -r build   // build tất cả packages
// pnpm -r typecheck // typecheck tất cả`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson10({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="tc-10"
      num="10"
      title="Ecosystem & Monorepo"
      desc="Popular TypeScript libraries, tRPC, Prisma, pnpm workspaces, monorepo patterns"
      priority="low"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="TypeScript Ecosystem Overview">
        <Concept>
          <p>
            TypeScript ecosystem đã trưởng thành với các thư viện <strong>TypeScript-first</strong>:
            Zod (validation), Prisma (ORM), tRPC (API), Vitest (testing), Zustand/Jotai (state).{' '}
            <strong>tRPC</strong> đặc biệt mạnh: share type định nghĩa API từ server đến client mà
            không cần schema hay code generation. <strong>Monorepo</strong> với pnpm workspaces +
            TypeScript project references cho phép share code type-safe giữa frontend và backend.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Popular libraries', code: POPULAR_LIBS },
            { label: 'tRPC', code: TRPC },
            { label: 'Prisma types', code: PRISMA_TYPES },
            { label: 'Monorepo', code: MONOREPO },
          ]}
        />
      </Sec>

      <Sec title="Thư viện theo category">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Recommended</th>
              <th>Alternative</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Validation', 'Zod', 'Valibot (lighter)'],
              ['ORM', 'Prisma', 'Drizzle (SQL-like)'],
              ['API layer', 'tRPC', 'Hono + Zod'],
              ['Testing', 'Vitest', 'Jest + ts-jest'],
              ['State (React)', 'Zustand', 'Jotai'],
              ['Async state', 'TanStack Query', 'SWR'],
              ['Pattern matching', 'ts-pattern', 'switch (exhaustive)'],
              ['Monorepo', 'pnpm workspaces', 'Turborepo'],
            ].map(([cat, rec, alt]) => (
              <tr key={cat}>
                <td>{cat}</td>
                <td style={{ color: 'var(--accent)', fontWeight: 500 }}>{rec}</td>
                <td style={{ color: 'var(--text3)', fontSize: 12 }}>{alt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>tRPC không phải REST:</strong> tRPC dùng HTTP nhưng không theo REST conventions —
          không có URL design, không có swagger. Phù hợp cho fullstack TypeScript monorepo khi
          frontend và backend cùng team. Cho public API hoặc mobile clients, vẫn nên dùng
          REST/GraphQL.
        </Callout>
        <Callout type="warn">
          <strong>Prisma generated types phụ thuộc vào schema:</strong> Sau khi sửa{' '}
          <code className="ic">schema.prisma</code>, phải chạy{' '}
          <code className="ic">prisma generate</code> để update types. Nên thêm vào{' '}
          <code className="ic">postinstall</code> script để tự động chạy sau{' '}
          <code className="ic">npm install</code>.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Dùng ts-pattern implement state machine cho traffic light: Red → Green → Yellow → Red. match(state).with("red", ...).with("green", ...).with("yellow", ...).exhaustive().',
            },
            {
              level: 'medium',
              text: 'Setup pnpm monorepo với packages/shared (types + utils) và apps/client (Vite React). Share User type từ shared sang client. Verify TypeScript biết type qua workspace dependency.',
            },
            {
              level: 'hard',
              text: 'Mini tRPC: implement type-safe RPC từ đầu mà không dùng tRPC library — createRouter(procedures: Record<string, Procedure>) với type inference cho input/output, createClient<Router>() với typed method calls.',
            },
          ]}
          hint="ts-pattern: match(light).with('red', () => 'green').exhaustive(). Monorepo: pnpm-workspace.yaml, workspace:* dependency. Mini tRPC: type-level: Router extends Record<string, { input: ZodType, output: ZodType, handler: fn }>."
        />
      </Sec>
    </LessonCard>
  );
}
