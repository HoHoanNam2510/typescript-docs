import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const AS_KEYWORD = `// Type assertion với "as" — nói TypeScript "tin tôi, đây là type này"
// Dùng khi BẠN biết type chính xác hơn TypeScript

// DOM manipulation — phổ biến nhất
const input = document.getElementById('username') as HTMLInputElement;
input.value = 'Alice'; // OK — biết đây là input, có .value

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d'); // OK — HTMLCanvasElement có getContext

// Không dùng được trong TSX/JSX (conflict với generic syntax)
// const canvas = <HTMLCanvasElement>element; // ← này không dùng trong React

// Khi nào AS thực sự hợp lý:
// 1. Làm việc với DOM (querySelector trả về Element | null)
// 2. JSON.parse với schema đã biết
type Config = { host: string; port: number };
const raw = localStorage.getItem('config');
const config = JSON.parse(raw ?? '{}') as Config;

// 3. Test mocking
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;`;

const NON_NULL = `// Non-null assertion operator (!) — khẳng định không phải null/undefined
// Dùng khi BẠN chắc chắn giá trị không phải null/undefined

const root = document.getElementById('root')!; // Element (không phải Element | null)
root.innerHTML = '<p>Hello</p>'; // OK — không cần check null

// Tương đương với:
const root2 = document.getElementById('root');
if (!root2) throw new Error('Root element not found');
root2.innerHTML = '<p>Hello</p>'; // TypeScript biết không null sau check

// Chuỗi ! — có thể chain
const city = user?.address!.city!; // cẩn thận!

// Khi nào dùng !:
// ✓ Sau khi đã validate nhưng TypeScript không thể infer
// ✓ Trong tests với mock data chắc chắn có
// ✗ Tránh dùng để "bịt" lỗi mà không hiểu nguyên nhân

// Ưu tiên dùng optional chaining + nullish coalescing hơn !
const safeName = user?.name ?? 'Anonymous'; // tốt hơn user!.name`;

const DOUBLE_ASSERTION = `// Double assertion (as unknown as T) — khi TypeScript không cho phép trực tiếp
// Dùng CỰC KỲ hạn chế — thường là dấu hiệu design problem

// Trường hợp cần double assertion:
type Foo = { x: number };
type Bar = { y: string };

const foo: Foo = { x: 1 };
// const bar = foo as Bar; // Error: Foo và Bar không overlap
const bar = foo as unknown as Bar; // OK — "bước qua" type system

// Thực tế dùng hợp lý:
// Khi migrate từ JS — tạm thời bypass type checking
// Khi làm việc với legacy API trả về any
function legacyApi(): unknown { return { data: [] }; }
const result = legacyApi() as unknown as { data: string[] };

// TRÁNH pattern này trong production code — đây là code smell`;

const SATISFIES = `// satisfies operator (TypeScript 4.9+) — tốt hơn assertion
// Kiểm tra type nhưng GIỮ NGUYÊN type cụ thể

// Vấn đề với "as":
const palette1 = {
  red: [255, 0, 0],
  green: '#00ff00',
} as Record<string, string | number[]>;

// palette1.red là string | number[] — mất type info!

// satisfies giải quyết:
const palette2 = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Record<string, string | number[]>;

// palette2.red là number[] (giữ nguyên!)
// palette2.green là string (giữ nguyên!)
palette2.red.map(v => v * 2); // OK — biết là number[]
palette2.green.toUpperCase(); // OK — biết là string

// Dùng satisfies khi muốn:
// 1. Validate shape mà không mất type inference
// 2. Giữ literal types
const config = {
  env: 'production',
  debug: false,
} satisfies { env: string; debug: boolean };
// config.env là "production" literal, không phải string`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson04({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="kd-04"
      num="04"
      title="Type Casting & Assertions"
      desc="as, non-null assertion (!), double assertion, và satisfies operator"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Type assertions trong TypeScript">
        <Concept>
          <p>
            Type assertion (<code className="ic">as Type</code>) nói với TypeScript "tin tôi, tôi
            biết type này". Không có runtime effect — chỉ là compile-time hint. Dùng khi bạn có
            thông tin mà TypeScript không thể tự infer.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'as keyword', code: AS_KEYWORD },
            { label: 'Non-null (!) ', code: NON_NULL },
            { label: 'Double assertion', code: DOUBLE_ASSERTION },
            { label: 'satisfies (4.9+)', code: SATISFIES },
          ]}
        />
      </Sec>

      <Sec title="Khi nào dùng và không nên dùng">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Kỹ thuật</th>
              <th>Dùng khi</th>
              <th>Tránh khi</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['as Type', 'DOM, JSON.parse, biết type từ context', 'Chỉ để tắt lỗi'],
              ['!', 'Chắc chắn không null sau validation', 'Chưa validate — crash ngay'],
              ['as unknown as T', 'Legacy code, migration tạm thời', 'Production code mới'],
              ['satisfies', 'Validate shape + giữ type inference', 'Cần runtime check thực sự'],
            ].map(([tech, use, avoid]) => (
              <tr key={tech}>
                <td>
                  <code>{tech}</code>
                </td>
                <td>{use}</td>
                <td>{avoid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="warn">
          <strong>Type assertion không có runtime effect:</strong>{' '}
          <code className="ic">value as string</code> không convert value — nó chỉ nói TypeScript
          "coi đây là string". Nếu thực tế value là <code className="ic">number</code>, runtime sẽ
          có behavior unexpected. Luôn chắc chắn về type trước khi assert.
        </Callout>
        <Callout type="note">
          <strong>satisfies là pattern mới nhất và tốt nhất:</strong> Từ TS 4.9, ưu tiên{' '}
          <code className="ic">satisfies</code> thay vì <code className="ic">as</code> khi chỉ cần
          validate shape. Nó kiểm tra type đúng mà vẫn giữ nguyên type inference đã infer.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Viết function getInputValue(id: string): string — dùng getElementById + as HTMLInputElement + non-null assertion. Handle trường hợp element không tồn tại.',
            },
            {
              level: 'medium',
              text: 'Viết function parseConfig<T>(raw: string, defaults: T): T — dùng JSON.parse + satisfies để validate shape. Nếu parse lỗi, trả về defaults.',
            },
            {
              level: 'hard',
              text: 'Tại sao `as unknown as T` là anti-pattern? Cho ví dụ tình huống nó "bịt" lỗi TypeScript nhưng crash runtime. Sau đó viết phiên bản an toàn dùng type guard.',
            },
          ]}
          hint="getElementById trả về HTMLElement | null — cần assert HTMLInputElement và handle null. JSON.parse trả về any — satisfies { field: type } sẽ kiểm tra structure. Type guard: function isConfig(x: unknown): x is Config."
        />
      </Sec>
    </LessonCard>
  );
}
