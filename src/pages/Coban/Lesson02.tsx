import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const INSTALL_CODE = `# Cài TypeScript toàn cục
npm install -g typescript

# Kiểm tra phiên bản
tsc --version   # Version 5.x.x

# Biên dịch file .ts sang .js
tsc hello.ts

# Khởi tạo tsconfig.json
tsc --init

# Chạy trực tiếp với ts-node (không cần compile trước)
npx ts-node hello.ts

# Dùng tsx (nhanh hơn, hỗ trợ ESM)
npx tsx hello.ts`;

const TSCONFIG_CODE = `// tsconfig.json — cấu hình TypeScript compiler
{
  "compilerOptions": {
    // Target JS version output
    "target": "ES2020",

    // Module system
    "module": "CommonJS",

    // Bật tất cả strict checks — LUÔN BẬT khi học
    "strict": true,

    // Thư mục output
    "outDir": "./dist",
    "rootDir": "./src",

    // Skip type checking cho node_modules
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`;

const HELLO_CODE = `// src/hello.ts
function sayHello(name: string): string {
  return \`Hello, \${name}! Welcome to TypeScript.\`;
}

const message = sayHello('Alice');
console.log(message);

// Chạy: npx ts-node src/hello.ts
// Output: Hello, Alice! Welcome to TypeScript.`;

const PACKAGE_CODE = `// package.json — scripts cho TypeScript project
{
  "name": "my-ts-project",
  "scripts": {
    "dev":   "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0"
  }
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson02({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="cb-02"
      num="02"
      title="Cài Đặt & Bắt Đầu"
      desc="tsc, ts-node, tsconfig.json — setup project TypeScript đúng cách"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Các cách chạy TypeScript">
        <Concept>
          <p>
            TypeScript cần được <strong>compile sang JavaScript</strong> trước khi chạy. Có 3 cách
            phổ biến:
          </p>
        </Concept>
        <div className="explain-grid" style={{ marginTop: '0.75rem' }}>
          <div className="explain-box">
            <h4>tsc (TypeScript Compiler)</h4>
            <p>
              Tool chính thức. <code className="ic">tsc hello.ts</code> → tạo{' '}
              <code className="ic">hello.js</code>. Dùng khi build production.
            </p>
          </div>
          <div className="explain-box">
            <h4>ts-node</h4>
            <p>
              Compile và chạy ngay không tạo file .js. Tiện cho development và scripts.
              <code className="ic">npx ts-node hello.ts</code>
            </p>
          </div>
          <div className="explain-box">
            <h4>tsx (khuyến nghị)</h4>
            <p>
              Nhanh hơn ts-node, hỗ trợ ESM, watch mode.{' '}
              <code className="ic">tsx watch src/index.ts</code> — hot reload.
            </p>
          </div>
          <div className="explain-box">
            <h4>Vite / Next.js / CRA</h4>
            <p>
              Framework tích hợp sẵn TS support. Không cần cấu hình thủ công — chỉ tạo project và
              code.
            </p>
          </div>
        </div>
      </Sec>

      <Sec title="Lệnh cơ bản & tsconfig.json">
        <CodeTabs
          tabs={[
            { label: 'CLI commands', code: INSTALL_CODE },
            { label: 'tsconfig.json', code: TSCONFIG_CODE },
            { label: 'hello.ts', code: HELLO_CODE },
            { label: 'package.json', code: PACKAGE_CODE },
          ]}
        />
      </Sec>

      <Sec title="tsconfig.json — các option quan trọng nhất">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Option</th>
              <th>Giải thích</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                'strict',
                'Bật tất cả strict checks: noImplicitAny, strictNullChecks, v.v. LUÔN bật khi làm việc thực tế',
              ],
              [
                'target',
                'Version JS output: ES5, ES2020, ESNext. Ảnh hưởng đến syntax JS được generate',
              ],
              ['module', 'Module system: CommonJS (Node.js), ESNext (browser/ESM), NodeNext'],
              ['outDir', 'Thư mục chứa file .js sau khi compile. Thường là ./dist'],
              [
                'noEmit',
                'Chỉ type-check, không tạo file output. Dùng khi Vite/webpack lo phần build',
              ],
              ['skipLibCheck', 'Bỏ qua type check cho node_modules. Tăng tốc compile đáng kể'],
            ].map(([opt, desc]) => (
              <tr key={opt}>
                <td>{opt}</td>
                <td>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>strict: true là bắt buộc:</strong> Khi mới học, bật{' '}
          <code className="ic">strict: true</code> ngay từ đầu. Nó bật{' '}
          <code className="ic">strictNullChecks</code> (không thể gán null cho string),{' '}
          <code className="ic">noImplicitAny</code> (không được bỏ qua type annotation), và nhiều
          check khác. Công ty nào code TS nghiêm túc đều bật strict.
        </Callout>
        <Callout type="warn">
          <strong>tsc --noEmit trong CI:</strong> Thêm script{' '}
          <code className="ic">"check": "tsc --noEmit"</code> vào package.json. Chạy trong CI
          pipeline để đảm bảo không merge code có type error.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo file hello.ts với hàm sayHello(name: string) và biên dịch sang JS bằng tsc. Quan sát file .js được tạo ra — type annotations đã bị xóa.',
            },
            {
              level: 'medium',
              text: 'Dùng tsc --init để tạo tsconfig.json. Đọc và giải thích 5 option quan trọng nhất. Bật strict: true và thử tạo lỗi.',
            },
            {
              level: 'hard',
              text: 'Thiết lập TypeScript project hoàn chỉnh: package.json với scripts dev/build/check, tsconfig.json với strict, src/ folder. Chạy được với tsx watch.',
            },
          ]}
          hint="mkdir my-project && cd my-project && npm init -y && npm install -D typescript @types/node tsx && npx tsc --init"
        />
      </Sec>
    </LessonCard>
  );
}
