import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const TYPES_PACKAGES = `// @types packages & DefinitelyTyped

// Thư viện CÓ built-in types (không cần @types/*)
// npm install axios           → axios/index.d.ts bundled
// npm install zod             → zod/lib/index.d.ts bundled
// npm install prisma          → generated .d.ts per model
// npm install vite            → types/index.d.ts bundled

// Thư viện CẦN cài @types/
// npm install express → npm install -D @types/express
// npm install lodash  → npm install -D @types/lodash
// npm install jest    → npm install -D @types/jest

// Kiểm tra: xem có types field trong package.json không
// { "types": "./dist/index.d.ts" } → built-in
// Không có → cần @types/

// npm install -D @types/node       // Node.js built-ins
// npm install -D @types/react      // React
// npm install -D @types/react-dom  // ReactDOM
// npm install -D @types/express    // Express
// npm install -D @types/jest       // Jest
// npm install -D @types/supertest  // Supertest

// tsconfig.json — kiểm soát @types được dùng
{
  "compilerOptions": {
    "types": ["node", "jest"],
    // Chỉ dùng @types/node và @types/jest
    // Không khai báo → TypeScript include tất cả @types/ trong node_modules

    "typeRoots": ["./node_modules/@types", "./src/types"],
    // Tìm @types packages ở đâu — mặc định chỉ node_modules/@types
    // Thêm "./src/types" để include local declaration files
  }
}`;

const WRITING_DTS = `// Viết .d.ts file cho thư viện không có types

// src/types/my-legacy-lib.d.ts
declare module 'my-legacy-lib' {
  // Interfaces
  export interface Config {
    host: string;
    port: number;
    retries?: number;
    timeout?: number;
  }

  export interface QueryResult<T = unknown> {
    rows: T[];
    count: number;
    duration: number;
  }

  // Functions
  export function init(config: Config): void;
  export function query<T = unknown>(sql: string, params?: unknown[]): Promise<QueryResult<T>>;
  export function execute(sql: string, params?: unknown[]): Promise<{ affectedRows: number }>;

  // Classes
  export class Connection {
    constructor(config: Config);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
  }

  // Default export
  export default class LegacyClient extends Connection {
    query<T>(sql: string): Promise<QueryResult<T>>;
    transaction<T>(fn: (client: LegacyClient) => Promise<T>): Promise<T>;
  }

  // Constants
  export const VERSION: string;
  export const MAX_CONNECTIONS: number;
}

// Khai báo module cho assets (Vite)
declare module '*.svg' {
  const url: string;
  export default url;
}

declare module '*.png' {
  const url: string;
  export default url;
}

declare module '*.css' {
  const styles: Record<string, string>;
  export default styles;
}`;

const DECLARATION_MERGING = `// Module augmentation — extend existing types

// 1. Extend Express Request
// src/types/express.d.ts
import { UserPayload } from '../services/auth';

declare module 'express-serve-static-core' {
  interface Request {
    user?:      UserPayload;
    requestId?: string;
    startTime?: number;
    logger?:    { info: (msg: string) => void; error: (msg: string) => void };
  }
}

// 2. Extend Window
// src/types/window.d.ts
declare global {
  interface Window {
    analytics: {
      track(event: string, properties?: Record<string, unknown>): void;
      identify(userId: string, traits?: Record<string, unknown>): void;
      page(name: string): void;
    };
    __APP_VERSION__: string;
    __FEATURE_FLAGS__: Record<string, boolean>;
  }
}
export {};  // file phải là module

// 3. Extend Array prototype (cẩn thận — global pollution)
// src/types/array-extensions.d.ts
declare global {
  interface Array<T> {
    groupBy<K extends string>(keyFn: (item: T) => K): Record<K, T[]>;
    unique(): T[];
    chunk(size: number): T[][];
    last(): T | undefined;
  }
}
export {};

// 4. Augment Axios
declare module 'axios' {
  interface AxiosRequestConfig {
    retries?: number;
    _retry?:  boolean;
  }

  interface InternalAxiosRequestConfig {
    retries?: number;
    _retry?:  boolean;
  }
}

// 5. Augment import.meta (Vite)
interface ImportMeta {
  env: {
    VITE_API_URL: string;
    VITE_APP_NAME: string;
    MODE: 'development' | 'production' | 'test';
    DEV: boolean;
    PROD: boolean;
  };
}`;

const GLOBAL_TYPES = `// declare global & utility types thường dùng

// src/types/global.d.ts
declare global {
  // Utility types — không cần import
  type Nullable<T>   = T | null;
  type Optional<T>   = T | undefined;
  type Maybe<T>      = T | null | undefined;
  type Dict<T>       = Record<string, T>;
  type AnyFn         = (...args: unknown[]) => unknown;
  type Prettify<T>   = { [K in keyof T]: T[K] } & {};

  // Async utilities
  type AsyncFn<T>    = () => Promise<T>;
  type Awaited<T>    = T extends Promise<infer U> ? U : T;

  // Base entities
  interface BaseEntity {
    id:        string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface PaginatedResponse<T> {
    data:       T[];
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
  }

  // Environment
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT?:         string;
      DATABASE_URL:  string;
      JWT_SECRET:    string;
      REDIS_URL?:    string;
    }
  }
}

export {}; // biến file thành module

// Kiểm tra: tsconfig phải include file này
// "include": ["src/**/*"] — tự động include
// hoặc "files": ["src/types/global.d.ts"] — explicit`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson08({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="tc-08"
      num="08"
      title="Definitely Typed & @types"
      desc="@types packages, writing .d.ts files, module augmentation, declare global"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Type declarations trong TypeScript">
        <Concept>
          <p>
            <strong>DefinitelyTyped</strong> (github.com/DefinitelyTyped/DefinitelyTyped) là
            repository chứa <code className="ic">@types/*</code> packages — type declarations cho
            hàng nghìn JS libraries. Khi thư viện không có @types, tự viết{' '}
            <code className="ic">.d.ts</code> file. <strong>Module augmentation</strong> mở rộng
            types của package đã có (Express Request, Window, Array) mà không cần fork.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: '@types packages', code: TYPES_PACKAGES },
            { label: 'Viết .d.ts file', code: WRITING_DTS },
            { label: 'Module augmentation', code: DECLARATION_MERGING },
            { label: 'declare global', code: GLOBAL_TYPES },
          ]}
        />
      </Sec>

      <Sec title="Khi nào dùng gì">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Tình huống</th>
              <th>Cách xử lý</th>
              <th>File đặt ở đâu</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Thư viện có @types', 'npm install -D @types/pkg', 'node_modules (tự động)'],
              ['Thư viện chưa có types', 'declare module "pkg" { ... }', 'src/types/pkg.d.ts'],
              [
                'Extend Express Request',
                'Augment express-serve-static-core',
                'src/types/express.d.ts',
              ],
              ['Global variables', 'declare const VAR: type', 'src/types/global.d.ts'],
              ['window.myProp', 'interface Window { myProp: T }', 'src/types/window.d.ts'],
              ['process.env vars', 'NodeJS.ProcessEnv interface', 'src/types/env.d.ts'],
              ['Import assets (Vite)', "declare module '*.svg'", 'src/types/assets.d.ts'],
            ].map(([situation, solution, location]) => (
              <tr key={situation}>
                <td style={{ fontSize: 12 }}>{situation}</td>
                <td>
                  <code style={{ fontSize: 11 }}>{solution}</code>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{location}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Module augmentation cần import từ original:</strong>{' '}
          <code className="ic">declare module 'express-serve-static-core' {'{ }'}</code> yêu cầu
          file phải <code className="ic">import</code> từ express (hoặc express-serve-static-core) —
          nếu không TypeScript không biết đây là augmentation hay module mới.
        </Callout>
        <Callout type="warn">
          <strong>declare global cần file là module:</strong> File không có{' '}
          <code className="ic">import/export</code> là <em>script</em> — declarations tự động
          global. Nếu muốn <code className="ic">declare global {'{ }'}</code> trong module file,
          thêm <code className="ic">export {'{ }'}</code> ở cuối để biến nó thành module.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo src/types/env.d.ts khai báo process.env với các biến: NODE_ENV, PORT, DATABASE_URL, JWT_SECRET, REDIS_URL?, CORS_ORIGIN?. NODE_ENV là union literal, PORT là string (parse thủ công).',
            },
            {
              level: 'medium',
              text: "Viết .d.ts cho fake library 'simple-cache': Cache class với get<T>(key: string): T | undefined, set<T>(key: string, value: T, ttl?: number): void, delete(key: string): boolean, clear(): void.",
            },
            {
              level: 'hard',
              text: "Tạo declare module cho 'untyped-orm': TypedModel<T> class với find(where: Partial<T>): Promise<T[]>, create(data: Omit<T, 'id' | 'createdAt'>): Promise<T>, update(id: string, data: Partial<T>): Promise<T | null>.",
            },
          ]}
          hint="env.d.ts: namespace NodeJS { interface ProcessEnv }. Cache .d.ts: declare module 'simple-cache' { export class Cache }. ORM: generic class với T extends BaseEntity constraint."
        />
      </Sec>
    </LessonCard>
  );
}
