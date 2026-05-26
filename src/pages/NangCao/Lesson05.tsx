import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const BASIC_INDEX = `// Index Signatures — cho phép dynamic keys

// Basic index signature
interface StringMap {
  [key: string]: string;
}

const headers: StringMap = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer token123',
  'X-Custom-Header': 'value',
};

// Phải compatible — specific properties phải match value type
interface FlexibleObject {
  id: number;        // ✗ Error — id là number nhưng index signature là string → string
  [key: string]: string;
}

// Giải pháp: dùng unknown hoặc union
interface SafeFlexible {
  id: number;
  name: string;
  [key: string]: string | number; // union cover cả id và name
}

// Readonly index signature
interface ImmutableMap {
  readonly [key: string]: string;
}

const config: ImmutableMap = { host: 'localhost', port: '3000' };
// config.host = 'prod'; // Error — readonly

// Symbol index signature
interface SymbolMap {
  [key: symbol]: unknown;
}`;

const TEMPLATE_LITERAL_INDEX = `// Template literal index signatures (TypeScript 4.4+)
// Chỉ cho phép keys khớp với pattern

// data-* attributes
interface DataAttributes {
  [key: \`data-\${string}\`]: string;
}

const element: DataAttributes = {
  'data-id': '123',
  'data-user': 'alice',
  'data-testid': 'submit-btn',
  // 'id': 'main', // Error — không match pattern data-*
};

// aria-* attributes
interface AriaAttributes {
  [key: \`aria-\${string}\`]: string | boolean;
}

// Combine data-* + aria-* + specific props
interface HtmlAttributes extends DataAttributes, AriaAttributes {
  id?: string;
  class?: string;
  style?: string;
}

// Custom prefix patterns
interface EnvVars {
  [key: \`REACT_APP_\${string}\`]: string;
}

// Config keys với namespace
interface ConfigStore {
  [key: \`app.\${string}\`]: unknown;
  [key: \`db.\${string}\`]: string;
  [key: \`cache.\${string}\`]: number;
}`;

const PRACTICAL_PATTERNS = `// Practical index signature patterns

// fromEntries — type-safe
function fromEntries<K extends string, V>(entries: [K, V][]): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}

const result = fromEntries([
  ['name', 'Alice'] as const,
  ['city', 'Hanoi'] as const,
]);
// result: { name: string; city: string }

// Record<K, V> vs index signature
// Record là built-in — dùng khi biết keys trước
type StatusMap = Record<'active' | 'inactive' | 'banned', number>;
const counts: StatusMap = { active: 10, inactive: 5, banned: 1 };

// Index signature — khi keys động
type DynamicMap = { [key: string]: number };
const scores: DynamicMap = {}; // có thể thêm bất kỳ key nào

// Map pattern — Registry
class Registry<T> {
  private store: { [key: string]: T } = {};

  register(key: string, value: T): void {
    this.store[key] = value;
  }

  get(key: string): T | undefined {
    return this.store[key];
  }

  getAll(): { [key: string]: T } {
    return { ...this.store };
  }
}

// Type-safe config reader
interface AppConfig {
  [section: string]: {
    [key: string]: string | number | boolean;
  };
}

function getConfigValue(
  config: AppConfig,
  section: string,
  key: string
): string | number | boolean | undefined {
  return config[section]?.[key];
}`;

const NOUNCHECKED = `// noUncheckedIndexedAccess — strict index access (tsconfig)
// Khi bật: T[string] → T | undefined (an toàn hơn)

// Không bật noUncheckedIndexedAccess
const map1: Record<string, string> = {};
const val1: string = map1['key']; // OK — TypeScript tin là string, nhưng thực ra undefined

// Khi bật noUncheckedIndexedAccess
const map2: Record<string, string> = {};
// const val2: string = map2['key']; // Error — type là string | undefined
const val2: string | undefined = map2['key']; // phải xử lý undefined

// Với array cũng bị ảnh hưởng
const arr: string[] = ['a', 'b'];
// const first: string = arr[0]; // Error khi bật
const first: string | undefined = arr[0]; // phải handle

// Workaround: check trước khi dùng
function safeGet<T>(arr: T[], index: number): T | undefined {
  return arr[index];
}

function processFirst(items: string[]): void {
  const first = items[0]; // string | undefined khi noUncheckedIndexedAccess
  if (first !== undefined) {
    console.log(first.toUpperCase()); // OK
  }
}

// at() method — type-safe alternative
const last = arr.at(-1); // string | undefined — luôn đúng`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson05({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="nc-05"
      num="05"
      title="Index Signatures"
      desc="Dynamic keys, template literal index, Record vs index, noUncheckedIndexedAccess"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Index Signatures">
        <Concept>
          <p>
            <strong>Index signatures</strong> cho phép một type có các keys động —{' '}
            <code className="ic">{'{ [key: string]: T }'}</code>. TypeScript 4.4+ thêm
            <strong> template literal index signatures</strong> ({' '}
            <code className="ic">{'{ [`data-${string}`]: string }'}</code>) để pattern-match keys.
            Kết hợp <code className="ic">noUncheckedIndexedAccess</code> để truy cập index an toàn
            hơn.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Cơ bản', code: BASIC_INDEX },
            { label: 'Template literal index', code: TEMPLATE_LITERAL_INDEX },
            { label: 'Practical patterns', code: PRACTICAL_PATTERNS },
            { label: 'noUncheckedIndexedAccess', code: NOUNCHECKED },
          ]}
        />
      </Sec>

      <Sec title="Index signature vs Record">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Đặc điểm</th>
              <th>
                <code>{'{ [key: string]: V }'}</code>
              </th>
              <th>
                <code>{'Record<K, V>'}</code>
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Key type', 'string | number | symbol', 'Union literal, string, number'],
              ['Keys đã biết', 'Không bắt buộc', 'Phải assign tất cả keys K'],
              ['Flexibility', 'Hoàn toàn dynamic', 'Semi-dynamic'],
              ['IDE autocomplete', 'Không có', 'Có (với literal K)'],
              ['Type safety', 'Thấp hơn', 'Cao hơn với literal keys'],
            ].map(([feat, index, record]) => (
              <tr key={feat}>
                <td>{feat}</td>
                <td>{index}</td>
                <td>{record}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Specific properties phải compatible với index signature:</strong> Nếu có{' '}
          <code className="ic">{'{ id: number; [key: string]: string }'}</code>, TypeScript báo lỗi
          vì <code className="ic">number</code> không assignable vào{' '}
          <code className="ic">string</code>. Phải dùng union:{' '}
          <code className="ic">string | number</code>.
        </Callout>
        <Callout type="warn">
          <strong>noUncheckedIndexedAccess</strong> không bật mặc định — phải thêm vào
          tsconfig.json. Đây là tùy chọn rất hữu ích cho code production nhưng yêu cầu handle thêm
          nhiều <code className="ic">undefined</code> cases.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo interface CSSVariables với index signature cho CSS custom properties: --color-primary, --spacing-sm, v.v. Pattern: [key: `--${string}`]: string. Kết hợp với specific common variables.',
            },
            {
              level: 'medium',
              text: 'Implement type-safe Registry<T> class: register(key: string, value: T), get(key: string): T | undefined, has(key: string): boolean, getAll(): Record<string, T>. Dùng private Map bên trong.',
            },
            {
              level: 'hard',
              text: 'Implement typed EventBus với index signature: EventBus<Events extends Record<string, unknown>> có on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void), emit<K extends keyof Events>(event: K, data: Events[K]).',
            },
          ]}
          hint="CSSVariables: [key: `--${string}`]: string. Registry: private store = new Map<string, T>(). EventBus: handlers = new Map<string, Set<Function>>() với typed generic methods."
        />
      </Sec>
    </LessonCard>
  );
}
