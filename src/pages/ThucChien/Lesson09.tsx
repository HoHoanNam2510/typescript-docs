import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const RUNTIME_TOOLS = `// Runtime tools — chạy TypeScript không cần compile

// ══ tsx — nhanh nhất, dựa trên esbuild ══════════════
// npm install -D tsx

// Chạy file
npx tsx src/index.ts

// Watch mode (dev)
npx tsx watch src/index.ts

// REPL
npx tsx

// Không cần tsconfig — chỉ transpile, không type-check
// Dùng cho: scripts, dev server, CLI tools

// ══ ts-node — classic, hỗ trợ nhiều options ══════════
// npm install -D ts-node

// Chạy file
npx ts-node src/index.ts

// ESM mode (Node.js ESM)
node --loader ts-node/esm src/index.ts

// Với tsconfig paths
npx ts-node -r tsconfig-paths/register src/index.ts

// ══ Bun — runtime all-in-one ═════════════════════════
// Chạy TypeScript natively — không cần cài thêm
bun run src/index.ts
bun --watch src/index.ts

// ══ Deno — TypeScript first-class citizen ════════════
// Chạy TypeScript natively
deno run src/index.ts

// So sánh startup time (approximation):
// tsx:    ~100ms
// ts-node: ~500-1000ms
// bun:    ~30ms
// deno:   ~50ms`;

const BUILD_TOOLS = `// Build tools — compile & bundle TypeScript

// ══ tsc — TypeScript compiler thuần ═════════════════
// tsc --watch           // watch mode
// tsc --noEmit          // type-check only (CI)
// tsc --build           // project references
// tsc --build --clean   // xóa build artifacts

// package.json scripts
{
  "scripts": {
    "build":     "tsc",
    "typecheck": "tsc --noEmit",
    "build:watch": "tsc --watch"
  }
}

// ══ tsup — bundle TypeScript (esbuild-based) ═════════
// npm install -D tsup
// Cực nhanh, không type-check (transpile only)

// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry:    ['src/index.ts'],
  format:   ['cjs', 'esm'],    // output cả 2 formats
  dts:      true,              // generate .d.ts
  splitting: false,
  clean:    true,
  minify:   process.env.NODE_ENV === 'production',
  external: ['express', 'zod'],  // không bundle dependencies
});

// ══ Vite — frontend bundler với TypeScript support ═══
// Vite dùng esbuild để transpile TypeScript (nhanh)
// Không type-check khi build — dùng tsc --noEmit riêng

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'; // sync paths aliases

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    target: 'ES2020',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});`;

const ESLINT_SETUP = `// ESLint + TypeScript — lint với type-awareness

// npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

// eslint.config.js (ESLint 9 flat config)
import tseslint from 'typescript-eslint';

export default tseslint.config(
  tseslint.configs.strictTypeChecked,  // type-aware rules
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ★ Quan trọng — prevent common mistakes
      '@typescript-eslint/no-floating-promises':    'error',
      '@typescript-eslint/await-thenable':           'error',
      '@typescript-eslint/no-misused-promises':      'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',

      // ★ Enforce best practices
      '@typescript-eslint/no-explicit-any':         'error',
      '@typescript-eslint/no-non-null-assertion':   'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain':   'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      // import type { Foo } thay vì import { Foo } khi chỉ dùng type

      // ★ Naming conventions
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'interface', format: ['PascalCase'] },
        { selector: 'typeAlias', format: ['PascalCase'] },
        { selector: 'enum',      format: ['PascalCase'] },
      ],
    },
  }
);

// package.json
{
  "scripts": {
    "lint":       "eslint src --ext .ts,.tsx",
    "lint:fix":   "eslint src --ext .ts,.tsx --fix",
    "format":     "prettier --write src/**/*.{ts,tsx}",
    "typecheck":  "tsc --noEmit"
  }
}`;

const DX_TOOLS = `// Developer Experience tools

// ══ Prettier — code formatting ══════════════════════
// npm install -D prettier

// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5",
  "endOfLine": "lf"
}

// ══ Husky + lint-staged — pre-commit hooks ══════════
// npm install -D husky lint-staged
// npx husky init

// .husky/pre-commit
// npx lint-staged

// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": "prettier --write"
  }
}

// ══ tsx + nodemon alternative ════════════════════════
// nodemon với tsx
{
  "watch": ["src"],
  "ext": "ts,json",
  "exec": "tsx src/index.ts"
}

// Hoặc chỉ dùng tsx watch (simpler)
// npx tsx watch src/index.ts

// ══ Helpful VS Code settings ═════════════════════════
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.inlayHints.parameterNames.enabled": "all",
  "typescript.inlayHints.variableTypes.enabled": true
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson09({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="tc-09"
      num="09"
      title="Build Tools & Developer Experience"
      desc="tsx, ts-node, tsup, Vite, ESLint TypeScript, Prettier, Husky"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="TypeScript Toolchain">
        <Concept>
          <p>
            TypeScript ecosystem có nhiều lớp tooling: <strong>runtime</strong> (tsx, ts-node, Bun),{' '}
            <strong>bundler</strong> (tsup, esbuild, Vite), <strong>linter</strong> (ESLint +
            @typescript-eslint), và <strong>formatter</strong> (Prettier). Mỗi công cụ giải quyết
            một vấn đề riêng — quan trọng là biết kết hợp đúng cho từng loại project.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Runtime tools', code: RUNTIME_TOOLS },
            { label: 'Build tools', code: BUILD_TOOLS },
            { label: 'ESLint TypeScript', code: ESLINT_SETUP },
            { label: 'DX & VS Code', code: DX_TOOLS },
          ]}
        />
      </Sec>

      <Sec title="Tool selection guide">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Project type</th>
              <th>Runtime/Dev</th>
              <th>Build/Bundle</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Node.js API', 'tsx watch', 'tsc hoặc tsup'],
              ['React app', 'Vite dev server', 'Vite build'],
              ['Library', 'tsx', 'tsup (cjs + esm + dts)'],
              ['CLI tool', 'tsx', 'tsup (bundle to single file)'],
              ['Full-stack', 'tsx (API) + Vite (UI)', 'tsc + Vite'],
              ['Scripts', 'tsx (nhanh nhất)', 'Không cần'],
            ].map(([project, dev, build]) => (
              <tr key={project}>
                <td>{project}</td>
                <td>
                  <code style={{ fontSize: 11 }}>{dev}</code>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{build}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>tsx/esbuild không type-check:</strong> tsx và Vite chỉ <em>transpile</em>{' '}
          TypeScript (xóa types) — không validate type correctness. Luôn chạy{' '}
          <code className="ic">tsc --noEmit</code> trong CI pipeline. Dev experience nhanh, nhưng
          type safety phải check riêng.
        </Callout>
        <Callout type="warn">
          <strong>no-floating-promises là rule quan trọng nhất:</strong> ESLint rule này bắt lỗi
          Promise không được await — ví dụ <code className="ic">db.save(user)</code> thay vì{' '}
          <code className="ic">await db.save(user)</code>. Runtime sẽ không báo lỗi, nhưng Promise
          bị bỏ qua và operation có thể không chạy.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Setup project Node.js với tsx: package.json scripts (dev, build, typecheck, lint, format). Cấu hình tsconfig.json, .eslintrc, .prettierrc. Verify tất cả commands chạy được.',
            },
            {
              level: 'medium',
              text: 'Cấu hình tsup để build TypeScript library: input src/index.ts, output dist/ với cả CJS và ESM, kèm .d.ts files. Test bằng cách import từ thư mục dist/ trong file khác.',
            },
            {
              level: 'hard',
              text: 'Setup đầy đủ DX pipeline: Husky pre-commit chạy lint-staged (eslint --fix + prettier), pre-push chạy tsc --noEmit + vitest run. GitHub Actions CI: typecheck + lint + test.',
            },
          ]}
          hint="tsx scripts: 'dev': 'tsx watch src/index.ts'. tsup: defineConfig({ entry, format: ['cjs','esm'], dts: true }). Husky: npx husky init, .husky/pre-commit = npx lint-staged."
        />
      </Sec>
    </LessonCard>
  );
}
