import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const AMBIENT_DECLARATIONS = `// Ambient declarations — khai báo types cho JavaScript code
// .d.ts files — chỉ chứa type declarations, không có implementation

// declare keyword — "trust me, this exists at runtime"
declare const __DEV__: boolean;         // global variable
declare const VERSION: string;

declare function require(module: string): unknown;

// declare namespace — group related declarations
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    DATABASE_URL: string;
  }
}

// Dùng được ngay sau declaration
if (__DEV__) {
  console.log(\`Running in dev mode v\${VERSION}\`);
}

// declare module — khai báo type cho JS file/package không có types
declare module 'my-legacy-lib' {
  export interface Config {
    host: string;
    port: number;
    retries?: number;
  }

  export function init(config: Config): void;
  export function query(sql: string, params?: unknown[]): Promise<unknown[]>;
  export const VERSION: string;

  export default class LegacyClient {
    constructor(config: Config);
    connect(): Promise<void>;
    disconnect(): void;
  }
}`;

const MODULE_AUGMENTATION = `// Module augmentation — thêm types vào existing modules

// Augment Express.Request — thêm user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: 'admin' | 'user';
    };
    requestId?: string;
    startTime?: number;
  }
}

// Sau augmentation, req.user được TypeScript nhận ra
// import express from 'express';
// app.get('/profile', (req, res) => {
//   req.user?.id; // string | undefined ✓
// });

// Augment Axios — thêm custom config
declare module 'axios' {
  interface AxiosRequestConfig {
    retries?: number;
    timeout?: number;
    baseURL?: string;
  }
}

// Augment Array prototype — thêm custom method
interface Array<T> {
  groupBy<K extends string | number>(keyFn: (item: T) => K): Record<K, T[]>;
  unique(): T[];
  chunk(size: number): T[][];
}

// Declaration merging cho interface — tích lũy properties
interface Window {
  analytics: {
    track(event: string, properties?: Record<string, unknown>): void;
    page(name: string): void;
    identify(userId: string, traits?: Record<string, unknown>): void;
  };
  gtag?: (...args: unknown[]) => void;
}`;

const GLOBAL_AUGMENTATION = `// Global augmentation — thêm vào global scope

// Augment globalThis
declare global {
  interface GlobalThis {
    __APP_VERSION__: string;
    __FEATURE_FLAGS__: Record<string, boolean>;
  }

  // Extend Window
  interface Window {
    myApp: {
      version: string;
      config: AppConfig;
      initialized: boolean;
    };
  }

  // Global type alias
  type ID = string;
  type Nullable<T> = T | null;
  type Optional<T> = T | undefined;
  type Maybe<T> = T | null | undefined;

  // Global interface — dùng mọi nơi không cần import
  interface BaseEntity {
    id: ID;
    createdAt: Date;
    updatedAt: Date;
  }
}

// Chỉ dùng được khi file là module (có import/export)
export {}; // Biến file thành module để declare global hoạt động

// AppConfig — referenced in global declaration above
interface AppConfig {
  apiUrl: string;
  environment: 'dev' | 'staging' | 'prod';
  features: Record<string, boolean>;
}`;

const TYPES_PACKAGES = `// @types/* packages và built-in types

// Cài đặt type definitions cho thư viện không có built-in types
// npm install -D @types/node @types/express @types/lodash @types/jest

// Thư viện CÓ built-in types (không cần @types)
// npm install axios         → axios.d.ts
// npm install zod           → zod.d.ts
// npm install prisma        → generated .d.ts
// npm install react         → cần @types/react

// Khi thư viện không có @types — khai báo trong project
// File: src/types/untyped-lib.d.ts

declare module 'untyped-chart-lib' {
  interface ChartOptions {
    type: 'bar' | 'line' | 'pie';
    data: number[];
    labels: string[];
    colors?: string[];
  }

  export function renderChart(
    container: HTMLElement,
    options: ChartOptions
  ): { destroy: () => void; update: (data: number[]) => void };
}

// Triple-slash references (ít dùng ngày nay, thay bằng tsconfig)
/// <reference types="node" />
/// <reference lib="dom" />

// tsconfig.json — cách hiện đại
// {
//   "compilerOptions": {
//     "types": ["node", "jest"],
//     "lib": ["ES2022", "DOM", "DOM.Iterable"]
//   }
// }

// Paths aliases — tránh import hell
// {
//   "paths": {
//     "@/*": ["./src/*"],
//     "@components/*": ["./src/components/*"],
//     "@types/*": ["./src/types/*"]
//   }
// }`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson08({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="nc-08"
      num="08"
      title="Declaration Files & Module Augmentation"
      desc="ambient declare, .d.ts, module augmentation, declare global, @types packages"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Declaration Files">
        <Concept>
          <p>
            <strong>.d.ts files</strong> chứa type declarations mà không có implementation — cho
            phép TypeScript hiểu JavaScript libraries. <strong>Module augmentation</strong> extend
            type của module đã có (Express, Axios) mà không cần fork.{' '}
            <strong>declare global</strong> thêm types vào global scope — dùng cho window,
            globalThis, và global utility types.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Ambient declarations', code: AMBIENT_DECLARATIONS },
            { label: 'Module augmentation', code: MODULE_AUGMENTATION },
            { label: 'declare global', code: GLOBAL_AUGMENTATION },
            { label: '@types packages', code: TYPES_PACKAGES },
          ]}
        />
      </Sec>

      <Sec title="Declaration scenarios">
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
              ['Thư viện có @types', 'npm install -D @types/pkg', 'node_modules/@types/'],
              ['Thư viện chưa có types', 'declare module "pkg" { ... }', 'src/types/pkg.d.ts'],
              [
                'Extend Express Request',
                'Augment express-serve-static-core',
                'src/types/express.d.ts',
              ],
              ['Global variables', 'declare const __VAR__: type', 'src/types/global.d.ts'],
              ['window.myProp', 'interface Window { myProp: T }', 'src/types/window.d.ts'],
            ].map(([scenario, solution, location]) => (
              <tr key={scenario}>
                <td>{scenario}</td>
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
          <strong>File phải là module để dùng declare global:</strong> Nếu file không có bất kỳ{' '}
          <code className="ic">import/export</code> nào, nó là <em>script</em> — declarations tự
          động global. Nếu muốn <code className="ic">declare global {'{ }'}</code> trong module
          file, thêm <code className="ic">export {'{ }'}</code> ở cuối.
        </Callout>
        <Callout type="warn">
          <strong>Module augmentation phải import từ original module:</strong>{' '}
          <code className="ic">declare module 'express' {'{ }'}</code> yêu cầu file đó phải thực sự{' '}
          <code className="ic">import</code> từ express, nếu không TypeScript không biết đây là
          augmentation hay declaration mới.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo src/types/env.d.ts khai báo process.env với các biến môi trường cụ thể của project: NODE_ENV, PORT, DATABASE_URL, JWT_SECRET, REDIS_URL. Tất cả là string | undefined trừ NODE_ENV.',
            },
            {
              level: 'medium',
              text: 'Augment Express Request thêm: user? (UserPayload), requestId (string), logger (Logger interface với info/warn/error). Tạo middleware setRequestContext gán các props này vào req.',
            },
            {
              level: 'hard',
              text: "Tạo .d.ts file cho một fake library 'event-bus' với: EventBus class, on<E extends string>(event: E, handler: (data: EventMap[E]) => void), emit<E extends string>(event: E, data: EventMap[E]). EventMap là generic param của class.",
            },
          ]}
          hint="env.d.ts: declare global { namespace NodeJS { interface ProcessEnv { ... } } }. Express augment: declare module 'express-serve-static-core'. EventBus .d.ts: export class EventBus<EventMap extends Record<string, unknown>> { on/emit/off }."
        />
      </Sec>
    </LessonCard>
  );
}
