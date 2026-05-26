import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const STATIC_BASICS = `// static — thuộc về class, không phải instance

class MathUtils {
  // static property
  static readonly PI = 3.14159265358979;
  static readonly E  = 2.71828182845905;

  // static method — gọi qua MathUtils.xxx(), không cần instance
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

console.log(MathUtils.PI);              // 3.14159...
console.log(MathUtils.clamp(15, 0, 10)); // 10
console.log(MathUtils.lerp(0, 100, 0.5)); // 50
console.log(MathUtils.randomInt(1, 6));   // 1-6

// Static không truy cập qua instance
const utils = new MathUtils();
// utils.PI        // Error — PI là static
// utils.clamp(...)// Error — static methods only on class`;

const STATIC_VS_INSTANCE = `// static vs instance — sự khác biệt

class Counter {
  // static: shared across ALL instances
  private static totalCount = 0;
  static getTotal() { return Counter.totalCount; }

  // instance: mỗi instance có riêng
  private instanceCount = 0;

  increment(): void {
    this.instanceCount++;  // instance state
    Counter.totalCount++;  // class state
  }

  getInstanceCount(): number { return this.instanceCount; }
}

const c1 = new Counter();
const c2 = new Counter();

c1.increment(); c1.increment();
c2.increment();

console.log(c1.getInstanceCount()); // 2
console.log(c2.getInstanceCount()); // 1
console.log(Counter.getTotal());    // 3 — shared!

// Static block (ES2022 / TS 4.4+)
class Config {
  static readonly DB_URL: string;
  static readonly MAX_RETRIES: number;

  static {
    // Complex initialization
    Config.DB_URL = process.env?.DATABASE_URL ?? 'localhost:5432';
    Config.MAX_RETRIES = parseInt(process.env?.MAX_RETRIES ?? '3');
  }
}`;

const SINGLETON = `// Singleton Pattern — đảm bảo chỉ 1 instance tồn tại

class Database {
  private static instance: Database | null = null;
  private connectionCount = 0;

  // private constructor — ngăn new Database()
  private constructor(private readonly url: string) {
    console.log(\`Connecting to \${url}...\`);
  }

  // Static factory method
  static getInstance(url: string): Database {
    if (!Database.instance) {
      Database.instance = new Database(url);
    }
    return Database.instance;
  }

  static resetInstance(): void { // dùng trong tests
    Database.instance = null;
  }

  query(sql: string): string {
    this.connectionCount++;
    return \`Result of: \${sql} (query #\${this.connectionCount})\`;
  }
}

const db1 = Database.getInstance('postgres://localhost/mydb');
const db2 = Database.getInstance('postgres://localhost/mydb');
console.log(db1 === db2); // true — cùng instance

db1.query('SELECT * FROM users');
db2.query('SELECT * FROM posts'); // vẫn là db1 bên trong`;

const FACTORY_METHOD = `// Factory Method Pattern — static method tạo instances

class Color {
  private constructor(
    public readonly r: number,
    public readonly g: number,
    public readonly b: number,
    public readonly a: number = 1
  ) {}

  // Named factories — tên rõ ràng hơn constructor
  static fromRGB(r: number, g: number, b: number): Color {
    return new Color(r, g, b);
  }

  static fromHex(hex: string): Color {
    const n = parseInt(hex.replace('#', ''), 16);
    return new Color((n >> 16) & 255, (n >> 8) & 255, n & 255);
  }

  static fromHSL(h: number, s: number, l: number): Color {
    // Simplified HSL → RGB conversion
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    return new Color(
      Math.round(f(0) * 255),
      Math.round(f(8) * 255),
      Math.round(f(4) * 255)
    );
  }

  static readonly RED   = new Color(255, 0,   0);
  static readonly GREEN = new Color(0,   255, 0);
  static readonly BLUE  = new Color(0,   0,   255);

  toHex(): string {
    return '#' + [this.r, this.g, this.b]
      .map(v => v.toString(16).padStart(2, '0')).join('');
  }

  toString(): string { return \`rgb(\${this.r}, \${this.g}, \${this.b})\`; }
}

const red   = Color.fromHex('#ff0000');
const blue  = Color.fromRGB(0, 0, 255);
const green = Color.GREEN; // static instance`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson06({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="oop-06"
      num="06"
      title="Static Members"
      desc="static properties, static methods, Singleton pattern, Factory method"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Static Members">
        <Concept>
          <p>
            <code className="ic">static</code> members thuộc về <strong>class</strong>, không phải
            instance. Chúng được share across tất cả instances và truy cập qua tên class. Dùng cho
            utility functions, constants, factory methods, và tracking class-level state.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'static cơ bản', code: STATIC_BASICS },
            { label: 'static vs instance', code: STATIC_VS_INSTANCE },
            { label: 'Singleton Pattern', code: SINGLETON },
            { label: 'Factory Method', code: FACTORY_METHOD },
          ]}
        />
      </Sec>

      <Sec title="Khi nào dùng static">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Use case</th>
              <th>Ví dụ</th>
              <th>Lý do</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Utility functions', 'MathUtils.clamp()', 'Không cần state của instance'],
              ['Constants', 'Color.RED, Config.MAX', 'Giá trị chung, không đổi'],
              ['Factory methods', 'Color.fromHex()', 'Tên rõ, nhiều cách tạo'],
              ['Singleton', 'Database.getInstance()', 'Chỉ 1 instance'],
              ['Global counters', 'Counter.totalCount', 'Track class-level state'],
              ['Registry', 'ServiceRegistry.register()', 'Map of services/types'],
            ].map(([use, example, reason]) => (
              <tr key={use}>
                <td>
                  <strong>{use}</strong>
                </td>
                <td>
                  <code>{example}</code>
                </td>
                <td>{reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Factory method &gt; constructor overloading:</strong> TypeScript không có
          constructor overloading kiểu C++/Java. Thay vào đó, dùng static factory methods với tên mô
          tả: <code className="ic">Color.fromHex()</code>,{' '}
          <code className="ic">Color.fromRGB()</code> rõ hơn nhiều constructor với signature khác
          nhau.
        </Callout>
        <Callout type="warn">
          <strong>Singleton và testability:</strong> Singleton khó test vì global state persist giữa
          các tests. Luôn thêm <code className="ic">static resetInstance()</code> hoặc dùng
          Dependency Injection thay thế nếu cần mock trong tests.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo class StringUtils với static methods: capitalize(s), truncate(s, maxLen), slugify(s: string): string (lowercase, dấu cách → gạch ngang, bỏ ký tự đặc biệt).',
            },
            {
              level: 'medium',
              text: 'Implement class IdGenerator với static nextId(): string tự tăng. Thêm static prefix(p: string): IdGenerator cho phép set prefix. Mỗi lần gọi nextId() trả về "prefix-001", "prefix-002",... Thread-safe không cần thiết.',
            },
            {
              level: 'hard',
              text: 'Implement class EventBus (Singleton) với static getInstance(), emit(event, data), on(event, handler), off(event, handler). Typed với generic: EventBus<{ userCreated: User; postPublished: Post }>.',
            },
          ]}
          hint="StringUtils: static methods không cần instance. IdGenerator: private static counter = 0, increment trong nextId(). EventBus<Events>: Map<keyof Events, Set<Function>> cho handlers."
        />
      </Sec>
    </LessonCard>
  );
}
