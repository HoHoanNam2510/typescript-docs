import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const IMPLEMENTS_SINGLE = `// implements — class cam kết thực hiện interface contract

interface ILogger {
  log(message: string, level?: 'info' | 'warn' | 'error'): void;
}

interface IDisposable {
  dispose(): void;
}

// Class implement 1 interface
class ConsoleLogger implements ILogger {
  log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const prefix = \`[\${level.toUpperCase()}]\`;
    console[level](\`\${prefix} \${message}\`);
  }
}

// Class implement nhiều interfaces
class FileLogger implements ILogger, IDisposable {
  private isOpen = true;

  constructor(private filename: string) {}

  log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    if (!this.isOpen) throw new Error('Logger is disposed');
    console.log(\`[\${level}] → \${this.filename}: \${message}\`);
  }

  dispose(): void {
    this.isOpen = false;
    console.log(\`Closing \${this.filename}\`);
  }
}

// Type-safe: có thể dùng interface type
const logger: ILogger = new ConsoleLogger();
logger.log('Hello');
logger.log('Warning!', 'warn');`;

const INTERFACE_CONTRACT = `// Interface như contract — decoupling implementation

interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Implementation 1: in-memory
class InMemoryUserRepo implements IRepository<User> {
  private data = new Map<string, User>();

  async findById(id: string) { return this.data.get(id) ?? null; }
  async findAll() { return [...this.data.values()]; }
  async save(user: User) { this.data.set(user.id, user); return user; }
  async delete(id: string) { this.data.delete(id); }
}

// Service dùng interface — không care về implementation
class UserService {
  constructor(
    private repo: IRepository<User>,
    private email: IEmailService
  ) {}

  async createUser(name: string, emailAddr: string): Promise<User> {
    const user: User = { id: crypto.randomUUID(), name, email: emailAddr };
    await this.repo.save(user);
    await this.email.send(emailAddr, 'Welcome!', \`Hi \${name}!\`);
    return user;
  }
}`;

const CONSTRUCTOR_TYPE = `// Constructor type — type của class constructor

// Constructable<T>: type đại diện cho class có thể new được
type Constructor<T = object> = new (...args: unknown[]) => T;

// Dùng để generic factory
function createInstance<T>(Cls: Constructor<T>): T {
  return new Cls();
}

// Constructable với known args
type UserConstructor = new (name: string, email: string) => User;

// Abstract constructor type (cho abstract classes)
type AbstractConstructor<T> = abstract new (...args: unknown[]) => T;

// Ví dụ thực tế: registry pattern
class ServiceRegistry {
  private services = new Map<string, Constructor>();

  register<T>(name: string, Cls: Constructor<T>): void {
    this.services.set(name, Cls);
  }

  resolve<T>(name: string): T {
    const Cls = this.services.get(name) as Constructor<T> | undefined;
    if (!Cls) throw new Error(\`Service '\${name}' not registered\`);
    return new Cls();
  }
}`;

const MIXIN_PATTERN = `// Mixin pattern — multiple inheritance bằng function composition

type Constructor<T = object> = new (...args: unknown[]) => T;

// Mixin functions — nhận class, return class mở rộng
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date();
    updatedAt = new Date();

    touch() {
      this.updatedAt = new Date();
    }
  };
}

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false;

    activate()   { this.isActive = true; }
    deactivate() { this.isActive = false; }
    toggle()     { this.isActive = !this.isActive; }
  };
}

function Serializable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    serialize(): string {
      return JSON.stringify(this);
    }
  };
}

// Base class
class User {
  constructor(public name: string, public email: string) {}
}

// Compose mixins
const TimestampedUser = Timestamped(User);
const FullUser = Serializable(Activatable(Timestamped(User)));

const user = new FullUser('Alice', 'alice@example.com');
user.activate();
user.touch();
console.log(user.serialize());
// { name: "Alice", email: "...", isActive: true, createdAt: ..., updatedAt: ... }`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson05({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="oop-05"
      num="05"
      title="Interfaces với Classes"
      desc="implements, multiple interfaces, constructor type, mixin pattern"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Interfaces & Classes">
        <Concept>
          <p>
            <code className="ic">implements</code> cho phép class cam kết tuân theo một hoặc nhiều
            interfaces. Đây là nền tảng của <strong>Dependency Inversion</strong> — code dựa vào
            abstraction (interface), không phải concrete class. Kết hợp với <strong>Mixin</strong>{' '}
            để giả lập multiple inheritance.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'implements', code: IMPLEMENTS_SINGLE },
            { label: 'Interface as contract', code: INTERFACE_CONTRACT },
            { label: 'Constructor type', code: CONSTRUCTOR_TYPE },
            { label: 'Mixin pattern', code: MIXIN_PATTERN },
          ]}
        />
      </Sec>

      <Sec title="implements vs extends">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Tiêu chí</th>
              <th>implements (interface)</th>
              <th>extends (class)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Số lượng', 'Nhiều (A, B, C)', 'Chỉ 1'],
              ['Kế thừa code', '✗ (chỉ types)', '✓ (methods + state)'],
              ['Bắt buộc implement', '✓ (tất cả members)', 'Chỉ abstract methods'],
              ['Mục đích', 'Define contract', 'Code reuse + polymorphism'],
              ['Runtime overhead', 'Không', 'Prototype chain'],
            ].map(([criteria, impl, ext]) => (
              <tr key={criteria}>
                <td>
                  <strong>{criteria}</strong>
                </td>
                <td>{impl}</td>
                <td>{ext}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>implements không kế thừa code:</strong>{' '}
          <code className="ic">class A implements B</code> chỉ nghĩa là A phải có đủ members của B —
          không copy code. Khác với <code className="ic">extends</code>. Nếu cần cả hai: dùng
          abstract class implement interface, rồi extend abstract class đó.
        </Callout>
        <Callout type="warn">
          <strong>Mixin và type inference:</strong> Khi compose nhiều mixins, TypeScript có thể gặp
          khó khăn inferring type của result. Đặt explicit type annotation nếu cần:{' '}
          <code className="ic">const Mixed: Constructor&lt;A & B&gt; = MixinB(MixinA(Base))</code>.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo interface IShape với area(): number, perimeter(): number, describe(): string. Implement Circle, Square, Triangle. Viết function printShapeInfo(shape: IShape) dùng polymorphism.',
            },
            {
              level: 'medium',
              text: 'Thiết kế ICache<K, V> với get, set, delete, clear, size. Implement MemoryCache<K,V> dùng Map. Implement LRUCache<K,V> xóa item ít dùng nhất khi đầy (maxSize param).',
            },
            {
              level: 'hard',
              text: 'Implement Mixin Loggable<T>: thêm log(msg: string) và getLogs(): string[]. Mixin Validatable<T>: thêm abstract validate(): boolean, getErrors(): string[]. Compose thành ValidatableForm extends Validatable(Loggable(Base)).',
            },
          ]}
          hint="IShape: interface với 3 methods. LRUCache: dùng Map với insertion order, khi full xóa Map.keys().next().value. Mixin: type Constructor<T> = new(...args: any[]) => T."
        />
      </Sec>
    </LessonCard>
  );
}
