import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const SETUP = `// TypeScript với Node.js — cài đặt và tsconfig
// npm install -D typescript @types/node tsx

// tsconfig.json cho Node.js project
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "sourceMap": true
  }
}

// package.json scripts
{
  "scripts": {
    "dev":       "tsx watch src/index.ts",
    "build":     "tsc",
    "start":     "node dist/index.js",
    "typecheck": "tsc --noEmit"
  }
}

// Entry point — src/index.ts
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello TypeScript!');
});

server.listen(3000, () => console.log('Server running on :3000'));`;

const HTTP_SERVER = `// HTTP Server type-safe với Node.js
import http, { IncomingMessage, ServerResponse } from 'node:http';
import { URL } from 'node:url';

type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
type Routes = Record<string, RouteHandler>;

// JSON helper với generic type
function sendJSON<T>(res: ServerResponse, data: T, status = 200): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Đọc request body
async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

// Type-safe router factory
function createRouter(routes: Routes): http.RequestListener {
  return async (req, res) => {
    const url = new URL(req.url ?? '/', \`http://\${req.headers.host}\`);
    const handler = routes[url.pathname];

    if (!handler) {
      sendJSON(res, { error: 'Not Found' }, 404);
      return;
    }

    try {
      await handler(req, res);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      sendJSON(res, { error: message }, 500);
    }
  };
}

// Usage
const server = http.createServer(
  createRouter({
    '/':        (_req, res) => sendJSON(res, { message: 'Hello!' }),
    '/health':  (_req, res) => sendJSON(res, { status: 'ok', uptime: process.uptime() }),
    '/echo':    async (req, res) => {
      const body = await readBody(req);
      sendJSON(res, { received: body });
    },
  })
);

server.listen(3000);`;

const FS_PATH = `// File system & path — typed operations
import fs from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';

interface FileInfo {
  name: string;
  size: number;
  isDirectory: boolean;
  lastModified: Date;
}

// List directory với typed result
async function listDir(dirPath: string): Promise<FileInfo[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return Promise.all(
    entries.map(async entry => {
      const fullPath = path.join(dirPath, entry.name);
      const stat = await fs.stat(fullPath);
      return {
        name: entry.name,
        size: stat.size,
        isDirectory: entry.isDirectory(),
        lastModified: stat.mtime,
      };
    })
  );
}

// Generic JSON file reader/writer
async function readJSON<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

async function writeJSON<T>(filePath: string, data: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Safe operations với Result type
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function safeReadJSON<T>(filePath: string): Promise<Result<T>> {
  try {
    if (!existsSync(filePath)) return { ok: false, error: \`File not found: \${filePath}\` };
    const data = await readJSON<T>(filePath);
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

// Usage
interface Config { port: number; host: string; }

const result = await safeReadJSON<Config>('./config.json');
if (result.ok) {
  console.log(result.data.port); // number — type-safe
} else {
  console.error(result.error);
}`;

const PROCESS_ENV = `// Process, environment variables & graceful shutdown
interface AppConfig {
  port: number;
  host: string;
  dbUrl: string;
  jwtSecret: string;
  nodeEnv: 'development' | 'production' | 'test';
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(\`Missing required env var: \${key}\`);
  return value;
}

function loadConfig(): AppConfig {
  const port = Number(process.env.PORT ?? '3000');
  if (isNaN(port)) throw new Error('PORT must be a number');

  return {
    port,
    host:      process.env.HOST ?? 'localhost',
    dbUrl:     requireEnv('DATABASE_URL'),
    jwtSecret: requireEnv('JWT_SECRET'),
    nodeEnv:   (process.env.NODE_ENV ?? 'development') as AppConfig['nodeEnv'],
  };
}

// Graceful shutdown — đóng server, DB connection trước khi thoát
function setupGracefulShutdown(cleanup: () => Promise<void>): void {
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];

  signals.forEach(signal => {
    process.on(signal, async () => {
      console.log(\`[\${signal}] Shutting down gracefully...\`);
      try {
        await cleanup();
        process.exit(0);
      } catch {
        process.exit(1);
      }
    });
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
    process.exit(1);
  });
}

// Usage
const config = loadConfig();

setupGracefulShutdown(async () => {
  // đóng DB, flush logs, etc.
  console.log('Cleanup done');
});`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson01({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="tc-01"
      num="01"
      title="TypeScript với Node.js"
      desc="Setup, HTTP server, file system, process, environment config"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="TypeScript trong Node.js">
        <Concept>
          <p>
            Node.js + TypeScript = backend type-safe. Cần cài{' '}
            <code className="ic">@types/node</code> để có type definitions cho built-in modules (
            <code className="ic">fs</code>, <code className="ic">http</code>,{' '}
            <code className="ic">path</code>...). Dùng <code className="ic">tsx</code> (dev) hoặc
            compile với <code className="ic">tsc</code> (production). Module system:{' '}
            <code className="ic">NodeNext</code> với <code className="ic">import/export</code> thay
            cho CommonJS.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Setup & tsconfig', code: SETUP },
            { label: 'HTTP Server', code: HTTP_SERVER },
            { label: 'File system & path', code: FS_PATH },
            { label: 'Process & env', code: PROCESS_ENV },
          ]}
        />
      </Sec>

      <Sec title="Node.js built-in modules cheat sheet">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Import</th>
              <th>Types quan trọng</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                'http/https',
                "import http from 'node:http'",
                'IncomingMessage, ServerResponse, RequestListener',
              ],
              ['fs/promises', "import fs from 'node:fs/promises'", 'Dirent, Stats, FileHandle'],
              ['path', "import path from 'node:path'", 'ParsedPath, FormatInputPathObject'],
              ['stream', "import { Readable } from 'node:stream'", 'Readable, Writable, Transform'],
              [
                'events',
                "import { EventEmitter } from 'node:events'",
                'EventEmitter (generic-able)',
              ],
              [
                'child_process',
                "import { spawn } from 'node:child_process'",
                'ChildProcess, SpawnOptions',
              ],
            ].map(([mod, imp, types]) => (
              <tr key={mod}>
                <td>
                  <code>{mod}</code>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{imp}</code>
                </td>
                <td style={{ fontSize: 12 }}>{types}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>node: protocol prefix:</strong> Dùng{' '}
          <code className="ic">import fs from 'node:fs'</code> thay vì{' '}
          <code className="ic">'fs'</code> — rõ ràng hơn, tránh nhầm với npm package cùng tên, và
          TypeScript nhận diện tốt hơn với moduleResolution NodeNext.
        </Callout>
        <Callout type="warn">
          <strong>process.env luôn là string | undefined:</strong> Phải parse và validate khi khởi
          động. Dùng <code className="ic">loadConfig()</code> throw ngay nếu thiếu biến bắt buộc —
          fail fast thay vì lỗi runtime ở giữa chừng.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Viết function readConfig<T>(path: string): Promise<T> đọc file JSON và parse thành T. Xử lý lỗi file không tồn tại, JSON invalid với typed errors.',
            },
            {
              level: 'medium',
              text: 'Xây dựng HTTP router hỗ trợ path params: createRouter({ "/users/:id": handler }) — extract params thành Record<string, string>, parse query string thành typed object.',
            },
            {
              level: 'hard',
              text: 'Implement type-safe EventEmitter<Events extends Record<string, unknown>>: on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): this — đảm bảo handler nhận đúng type.',
            },
          ]}
          hint="readConfig: fs.readFile + JSON.parse as T. Router: regex match path pattern, extract named groups. EventEmitter generic: Map<K, Set<Handler>> với keyof Events constraint."
        />
      </Sec>
    </LessonCard>
  );
}
