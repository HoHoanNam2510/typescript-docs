import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const ABSTRACT_BASICS = `// abstract class — không thể instantiate trực tiếp
// abstract method — phải implement ở subclass

abstract class Shape {
  // abstract method: không có body, subclass BẮT BUỘC implement
  abstract getArea(): number;
  abstract getPerimeter(): number;
  abstract readonly name: string;

  // Concrete method — subclass dùng chung, không cần override
  describe(): string {
    return \`\${this.name}: area=\${this.getArea().toFixed(2)}, perimeter=\${this.getPerimeter().toFixed(2)}\`;
  }

  isLargerThan(other: Shape): boolean {
    return this.getArea() > other.getArea();
  }
}

// new Shape() — Error: Cannot create an instance of an abstract class

class Circle extends Shape {
  readonly name = 'Circle';
  constructor(private radius: number) { super(); }

  getArea(): number { return Math.PI * this.radius ** 2; }
  getPerimeter(): number { return 2 * Math.PI * this.radius; }
}

class Rectangle extends Shape {
  readonly name = 'Rectangle';
  constructor(private w: number, private h: number) { super(); }

  getArea(): number { return this.w * this.h; }
  getPerimeter(): number { return 2 * (this.w + this.h); }
}

const shapes: Shape[] = [new Circle(5), new Rectangle(4, 6)];
shapes.forEach(s => console.log(s.describe()));`;

const TEMPLATE_METHOD = `// Template Method Pattern — abstract class định nghĩa algorithm skeleton

abstract class DataProcessor {
  // Template method — không override
  process(data: string[]): string[] {
    const filtered = this.filter(data);    // step 1 — abstract
    const transformed = this.transform(filtered); // step 2 — abstract
    return this.sort(transformed);         // step 3 — có default
  }

  protected abstract filter(data: string[]): string[];
  protected abstract transform(data: string[]): string[];

  // Concrete method với default — subclass có thể override
  protected sort(data: string[]): string[] {
    return data.sort();
  }
}

class UpperCaseProcessor extends DataProcessor {
  protected filter(data: string[]): string[] {
    return data.filter(s => s.length > 3); // lọc chuỗi ngắn
  }

  protected transform(data: string[]): string[] {
    return data.map(s => s.toUpperCase());
  }
}

class NumericProcessor extends DataProcessor {
  protected filter(data: string[]): string[] {
    return data.filter(s => !isNaN(Number(s)));
  }

  protected transform(data: string[]): string[] {
    return data.map(s => String(Number(s) * 2)); // nhân đôi
  }

  protected override sort(data: string[]): string[] {
    return data.sort((a, b) => Number(a) - Number(b)); // numeric sort
  }
}

const proc = new UpperCaseProcessor();
console.log(proc.process(['hi', 'hello', 'world', 'ok']));
// ['HELLO', 'WORLD']`;

const ABSTRACT_VS_INTERFACE = `// abstract class vs interface — khi nào dùng cái nào?

// Interface: pure contract — chỉ types, không có implementation
interface ILogger {
  log(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}

// Abstract class: partial implementation — có thể có concrete methods
abstract class BaseLogger {
  protected abstract writeLog(level: string, msg: string): void;

  log(msg: string): void   { this.writeLog('INFO',  msg); }
  warn(msg: string): void  { this.writeLog('WARN',  msg); }
  error(msg: string): void { this.writeLog('ERROR', msg); }
}

// Concrete implementation — chỉ override 1 abstract method
class ConsoleLogger extends BaseLogger {
  protected writeLog(level: string, msg: string): void {
    const ts = new Date().toISOString();
    console.log(\`[\${ts}][\${level}] \${msg}\`);
  }
}

class FileLogger extends BaseLogger {
  constructor(private filename: string) { super(); }

  protected writeLog(level: string, msg: string): void {
    // ghi vào file...
    console.log(\`Writing to \${this.filename}: [\${level}] \${msg}\`);
  }
}

// Có thể dùng interface type cho cả abstract và concrete
const logger: ILogger = new ConsoleLogger();
logger.log('App started');
logger.warn('Low memory');`;

const ABSTRACT_PRACTICAL = `// Ứng dụng thực tế: abstract Repository

abstract class BaseRepository<T extends { id: string }> {
  protected items: T[] = [];

  findById(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  findAll(): T[] {
    return [...this.items];
  }

  delete(id: string): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  // Abstract — subclass implement cách validate và create
  abstract create(data: Omit<T, 'id'>): T;
  abstract update(id: string, data: Partial<Omit<T, 'id'>>): T | undefined;
}

interface User {
  id: string;
  name: string;
  email: string;
}

class UserRepository extends BaseRepository<User> {
  create(data: Omit<User, 'id'>): User {
    const user: User = { ...data, id: crypto.randomUUID() };
    this.items.push(user);
    return user;
  }

  update(id: string, data: Partial<Omit<User, 'id'>>): User | undefined {
    const index = this.items.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    this.items[index] = { ...this.items[index], ...data };
    return this.items[index];
  }
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson04({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="oop-04"
      num="04"
      title="Abstract Classes"
      desc="abstract class, abstract methods, Template Method pattern, abstract vs interface"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Abstract Classes">
        <Concept>
          <p>
            <strong>Abstract class</strong> là class không thể instantiate trực tiếp — chỉ dùng làm
            base class. <strong>Abstract methods</strong> không có body và bắt buộc subclass phải
            implement. Dùng khi muốn cung cấp shared logic nhưng để subclass quyết định các phần cốt
            lõi.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'abstract cơ bản', code: ABSTRACT_BASICS },
            { label: 'Template Method', code: TEMPLATE_METHOD },
            { label: 'abstract vs interface', code: ABSTRACT_VS_INTERFACE },
            { label: 'Thực tế: Repository', code: ABSTRACT_PRACTICAL },
          ]}
        />
      </Sec>

      <Sec title="abstract class vs interface">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Tiêu chí</th>
              <th>abstract class</th>
              <th>interface</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Instantiate', '✗ (không trực tiếp)', '✗ (không được)'],
              ['Implementation', '✓ (có concrete methods)', '✗ (chỉ types)'],
              ['Constructor', '✓ (có thể có)', '✗'],
              ['State (fields)', '✓ (có thể có)', '✗ (chỉ types)'],
              ['Multiple inheritance', '✗ (chỉ extends 1)', '✓ (implements nhiều)'],
              ['Khi nào dùng', 'Share implementation + force override', 'Define contract/shape'],
            ].map(([criteria, abs, iface]) => (
              <tr key={criteria}>
                <td>
                  <strong>{criteria}</strong>
                </td>
                <td>{abs}</td>
                <td>{iface}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Rule of thumb:</strong> Dùng <code className="ic">abstract class</code> khi có
          shared implementation (code chung). Dùng <code className="ic">interface</code> khi chỉ cần
          define shape/contract. Trong nhiều trường hợp, có thể dùng cả hai cùng nhau: abstract
          class implement interface.
        </Callout>
        <Callout type="warn">
          <strong>abstract method phải override hết:</strong> Nếu subclass không implement tất cả
          abstract methods, TypeScript báo lỗi và subclass đó cũng phải là abstract. Không có cách
          "partial implement" — phải implement tất cả hoặc tiếp tục abstract.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo abstract class Validator<T> với abstract validate(value: T): boolean và abstract getErrorMessage(): string. Implement StringValidator (min/max length) và NumberValidator (min/max value).',
            },
            {
              level: 'medium',
              text: 'Implement Template Method: abstract class ReportGenerator với template method generate(data: unknown[]): string. Abstract methods: formatHeader(), formatRow(item: unknown): string, formatFooter(). Implement CsvReport và JsonReport.',
            },
            {
              level: 'hard',
              text: 'Tạo abstract BaseCache<K, V> với abstract storage. Implement methods: get(key: K), set(key: K, value: V, ttl?: number), invalidate(key: K). Concrete: MemoryCache (Map) và TimedCache (tự xóa sau TTL).',
            },
          ]}
          hint="Validator: abstract class với generic T. ReportGenerator: generate() gọi formatHeader() + data.map(formatRow) + formatFooter(). BaseCache: dùng Map<K, {value: V, expiresAt?: number}>."
        />
      </Sec>
    </LessonCard>
  );
}
