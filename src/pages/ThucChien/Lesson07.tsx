import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const COMPILER_OPTIONS = `// tsconfig.json — Compiler options reference

{
  "compilerOptions": {
    // ══ OUTPUT TARGET ══════════════════════════════
    "target": "ES2022",
    // Compile sang ES version nào. ES2022 hỗ trợ top-level await,
    // class fields, Error.cause. Node 18+ dùng ES2022.

    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    // Built-in type definitions. DOM cho browser, ES2022 cho modern JS.
    // Node.js không cần DOM.

    // ══ MODULES ════════════════════════════════════
    "module": "NodeNext",
    // CommonJS (Node.js cũ), ESNext, NodeNext (Node.js ESM)
    // Với React/Vite: "ESNext" hoặc bỏ qua (Vite tự xử lý)

    "moduleResolution": "NodeNext",
    // Cách resolve imports. NodeNext = Node.js 12+ ESM logic.
    // Với Node.js ESM: require .js extension trong imports.
    // Bundler: "Bundler" (TS 5.0+) — không cần extension.

    // ══ STRICT CHECKING ════════════════════════════
    "strict": true,            // bật 8 strict flags
    "noUncheckedIndexedAccess": true,  // arr[i] = T | undefined
    "exactOptionalPropertyTypes": true, // optional !== undefined
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,    // error cho unused variables
    "noUnusedParameters": true, // error cho unused parameters

    // ══ DECORATORS ═════════════════════════════════
    "experimentalDecorators": true,  // legacy decorators
    "emitDecoratorMetadata": true,   // metadata cho DI frameworks

    // ══ OUTPUT ═════════════════════════════════════
    "outDir": "dist",          // compiled output folder
    "rootDir": "src",          // source root
    "declaration": true,       // tạo .d.ts files
    "declarationMap": true,    // source map cho .d.ts
    "sourceMap": true,         // source map cho .js
    "removeComments": true,    // xóa comments trong output

    // ══ PATHS & ALIASES ════════════════════════════
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@types/*": ["src/types/*"]
    }
  },

  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}`;

const MODULE_RESOLUTION = `// Module resolution strategies

// CommonJS (cũ — Node.js require)
// "module": "CommonJS", "moduleResolution": "Node"
// import fs from 'fs'  → tìm node_modules/fs/index.js
// import './utils'      → tìm ./utils.js, ./utils/index.js

// ESM NodeNext (Node.js modern)
// "module": "NodeNext", "moduleResolution": "NodeNext"
// PHẢI có extension trong imports:
import { helper } from './utils.js'; // .js — dù file thật là .ts!
// TypeScript tự resolve .js → .ts khi compile

// Bundler mode (TS 5.0+ — dùng với Vite/webpack/esbuild)
// "moduleResolution": "Bundler"
// Không cần extension, bundler tự xử lý
import { helper } from './utils';   // OK với Bundler mode

// Path aliases — cách dùng với Vite
// tsconfig.json
{
  "paths": { "@/*": ["./src/*"] }
}

// vite.config.ts — phải sync với tsconfig paths
import path from 'path';
{
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
}

// Import sau khi setup
import { Button } from '@/components/Button';     // thay vì '../../../components/Button'
import type { User } from '@/types/user';

// tsconfig extends — tái sử dụng config
// tsconfig.base.json (shared settings)
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022"
  }
}

// tsconfig.json (project-specific)
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "module": "NodeNext"
  }
}`;

const PROJECT_REFERENCES = `// TypeScript Project References — monorepo & multi-package

// Cấu trúc:
// packages/
//   shared/         ← shared types & utils
//   server/         ← Node.js backend
//   client/         ← React frontend

// packages/shared/tsconfig.json
{
  "compilerOptions": {
    "composite": true,     // required cho project references
    "declaration": true,   // required — tạo .d.ts
    "outDir": "dist",
    "rootDir": "src"
  }
}

// packages/server/tsconfig.json
{
  "compilerOptions": {
    "composite": true
  },
  "references": [
    { "path": "../shared" }  // depend on shared
  ]
}

// packages/client/tsconfig.json
{
  "references": [
    { "path": "../shared" }
  ]
}

// Root tsconfig.json — entry point
{
  "files": [],  // không compile files ở root
  "references": [
    { "path": "packages/shared" },
    { "path": "packages/server" },
    { "path": "packages/client" }
  ]
}

// Build commands
// tsc --build              // incremental build tất cả references
// tsc --build --watch      // watch mode
// tsc --build --clean      // xóa build artifacts

// Lợi ích:
// - Incremental builds — chỉ rebuild package thay đổi
// - Type checking across packages
// - Automatic dependency ordering`;

const PERFORMANCE = `// TypeScript performance — optimize compile time

// 1. Dùng project references (xem trên) — incremental builds

// 2. skipLibCheck — bỏ qua type checking trong node_modules
{
  "compilerOptions": {
    "skipLibCheck": true  // ~30-50% compile time reduction
  }
}

// 3. incremental — cache build info
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  }
}

// 4. isolatedModules — Vite/esbuild compatibility
{
  "compilerOptions": {
    "isolatedModules": true
    // Mỗi file phải standalone — không dùng const enum across modules
    // Required cho transpile-only tools (esbuild, Babel, swc)
  }
}

// 5. Tránh deep generics recursive — chậm type checker
// Tốt — giới hạn depth
type DeepPartial<T, Depth extends number = 5> = Depth extends 0
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K], [-1, 0, 1, 2, 3, 4][Depth]> }
    : T;

// 6. Tách types vào separate files — lazy loading
// Không import type từ implementation files khi chỉ cần type
import type { User } from './User';       // chỉ type, không import runtime
import { UserService } from './User';      // cần runtime value

// 7. Dùng "verbatimModuleSyntax" (TS 5.0+)
// Enforce import type cho type-only imports
{
  "compilerOptions": {
    "verbatimModuleSyntax": true
    // import type { Foo } — OK
    // import { Foo } where Foo is type-only — Error!
  }
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson07({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="tc-07"
      num="07"
      title="tsconfig.json nâng cao"
      desc="Compiler options, module resolution, path aliases, project references, performance"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="tsconfig.json deep dive">
        <Concept>
          <p>
            <code className="ic">tsconfig.json</code> kiểm soát toàn bộ TypeScript compiler
            behavior. Module resolution strategy (<code className="ic">NodeNext</code> vs{' '}
            <code className="ic">Bundler</code>) ảnh hưởng đến cách viết imports.{' '}
            <strong>Project references</strong> (<code className="ic">composite: true</code>) cho
            phép incremental builds trong monorepo.{' '}
            <code className="ic">skipLibCheck + incremental</code> giảm đáng kể compile time.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Compiler options', code: COMPILER_OPTIONS },
            { label: 'Module resolution', code: MODULE_RESOLUTION },
            { label: 'Project references', code: PROJECT_REFERENCES },
            { label: 'Performance', code: PERFORMANCE },
          ]}
        />
      </Sec>

      <Sec title="Module & target quick reference">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Môi trường</th>
              <th>module</th>
              <th>moduleResolution</th>
              <th>target</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Node.js ESM', 'NodeNext', 'NodeNext', 'ES2022'],
              ['Node.js CJS', 'CommonJS', 'Node', 'ES2020'],
              ['Vite/React', 'ESNext', 'Bundler', 'ES2020'],
              ['Library', 'ESNext', 'Bundler', 'ES2015'],
              ['Electron', 'CommonJS', 'Node', 'ES2020'],
            ].map(([env, mod, res, tgt]) => (
              <tr key={env}>
                <td>{env}</td>
                <td>
                  <code style={{ fontSize: 11 }}>{mod}</code>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{res}</code>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{tgt}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>NodeNext yêu cầu .js extension:</strong> Với{' '}
          <code className="ic">moduleResolution: NodeNext</code>, phải viết{' '}
          <code className="ic">import ... from './utils.js'</code> (dù file thật là{' '}
          <code className="ic">.ts</code>). TypeScript resolve <code className="ic">.js</code> →{' '}
          <code className="ic">.ts</code> tự động. Dùng <code className="ic">Bundler</code>{' '}
          resolution nếu không muốn bận tâm extension.
        </Callout>
        <Callout type="warn">
          <strong>paths aliases không được Vite tự đọc:</strong> Khai báo paths trong{' '}
          <code className="ic">tsconfig.json</code> chỉ cho TypeScript. Vite cần riêng{' '}
          <code className="ic">resolve.alias</code> trong <code className="ic">vite.config.ts</code>
          . Dùng plugin <code className="ic">vite-tsconfig-paths</code> để tự sync từ tsconfig.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Setup tsconfig.json cho Node.js ESM project: NodeNext module, strict + extra strict flags, paths alias @/* → src/*. Verify với tsc --noEmit.',
            },
            {
              level: 'medium',
              text: 'Cấu hình Vite project với path aliases @/components, @/hooks, @/types. Sync tsconfig paths với vite.config.ts resolve.alias. Test import từ @/.',
            },
            {
              level: 'hard',
              text: 'Setup TypeScript project references cho monorepo: packages/shared (types), packages/api (Express), packages/web (React). Shared types phải available trong cả api và web mà không cần npm publish.',
            },
          ]}
          hint="NodeNext: .js extension trong imports. Vite alias: path.resolve(dirname, 'src'). Project refs: composite + declaration trong shared, references array trong dependents."
        />
      </Sec>
    </LessonCard>
  );
}
