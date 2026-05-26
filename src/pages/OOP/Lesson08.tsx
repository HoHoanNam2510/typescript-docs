import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const TYPEOF_CLASS = `// typeof Class — type của constructor, không phải instance

class User {
  constructor(
    public name: string,
    public email: string,
    public role: 'admin' | 'user' = 'user'
  ) {}

  greet(): string { return \`Hi, I'm \${this.name}\`; }
}

// typeof User = constructor type (class itself)
type UserConstructor = typeof User;
// = { new(name: string, email: string, role?): User }

// InstanceType<T> = instance type
type UserInstance = InstanceType<typeof User>;
// = User (the instance)

// Dùng để generic factory
function create<T>(Cls: new(...args: unknown[]) => T, ...args: unknown[]): T {
  return new Cls(...args);
}

// Type-safe version với specific constructor
function createUser(Cls: typeof User, name: string, email: string): User {
  return new Cls(name, email);
}

// Subclass thay thế được
class AdminUser extends User {
  constructor(name: string, email: string) {
    super(name, email, 'admin');
  }
}

const admin = createUser(AdminUser, 'Alice', 'alice@example.com');
console.log(admin.role); // "admin"`;

const INSTANCE_TYPE = `// InstanceType<T> — extract instance type từ constructor type

class HttpClient {
  constructor(private baseUrl: string) {}

  async get<T>(path: string): Promise<T> {
    const res = await fetch(\`\${this.baseUrl}\${path}\`);
    return res.json();
  }
}

class DatabaseClient {
  constructor(private connectionString: string) {}

  query<T>(sql: string): Promise<T[]> {
    console.log(\`Query: \${sql}\`);
    return Promise.resolve([]);
  }
}

// InstanceType để lấy type từ class
type HttpClientInstance = InstanceType<typeof HttpClient>;
// = HttpClient

// Dùng trong service registry
type ServiceMap = {
  http: typeof HttpClient;
  db:   typeof DatabaseClient;
};

type ServiceInstances = {
  [K in keyof ServiceMap]: InstanceType<ServiceMap[K]>;
};
// = { http: HttpClient; db: DatabaseClient }

// Factory từ ServiceMap
function createServices(config: {
  http: ConstructorParameters<typeof HttpClient>[0];
  db:   ConstructorParameters<typeof DatabaseClient>[0];
}): ServiceInstances {
  return {
    http: new HttpClient(config.http),
    db:   new DatabaseClient(config.db),
  };
}`;

const CLASS_AS_VALUE = `// Class là first-class value trong TypeScript

// Lưu class trong variable
const shapes: Array<new (size: number) => { getArea(): number }> = [];

class Square {
  constructor(private size: number) {}
  getArea() { return this.size ** 2; }
}

class Circle {
  constructor(private radius: number) {}
  getArea() { return Math.PI * this.radius ** 2; }
}

shapes.push(Square, Circle);
const instances = shapes.map(Cls => new Cls(5));
instances.forEach(s => console.log(s.getArea()));

// Decorators pattern (simplified)
function addLogging<T extends new(...args: unknown[]) => object>(Base: T) {
  return class extends Base {
    constructor(...args: unknown[]) {
      super(...args);
      console.log(\`Created instance of \${Base.name}\`);
    }
  };
}

// Registry của classes
class ClassRegistry {
  private registry = new Map<string, new(...args: unknown[]) => unknown>();

  register(name: string, Cls: new(...args: unknown[]) => unknown): void {
    this.registry.set(name, Cls);
  }

  create<T>(name: string, ...args: unknown[]): T {
    const Cls = this.registry.get(name) as (new(...args: unknown[]) => T) | undefined;
    if (!Cls) throw new Error(\`Unknown class: \${name}\`);
    return new Cls(...args);
  }
}`;

const CONSTRUCTOR_PARAMS = `// ConstructorParameters<T> — extract constructor param types

class ApiClient {
  constructor(
    private baseUrl: string,
    private apiKey: string,
    private timeout: number = 5000
  ) {}
}

// Lấy constructor params như tuple
type ApiClientParams = ConstructorParameters<typeof ApiClient>;
// [baseUrl: string, apiKey: string, timeout?: number]

// Dùng để build factory với type safety
function buildApiClient(...args: ConstructorParameters<typeof ApiClient>): ApiClient {
  return new ApiClient(...args);
}

// Spread constructor params
const params: ConstructorParameters<typeof ApiClient> = [
  'https://api.example.com',
  'my-secret-key',
  3000
];
const client = new ApiClient(...params); // type-safe!

// Kết hợp ConstructorParameters + Parameters + ReturnType
class ServiceContainer {
  private factories = new Map<string, (...args: unknown[]) => unknown>();

  bind<T extends new(...args: unknown[]) => unknown>(
    name: string,
    Cls: T,
    ...args: ConstructorParameters<T>
  ): void {
    this.factories.set(name, () => new Cls(...args));
  }

  get<T>(name: string): T {
    const factory = this.factories.get(name);
    if (!factory) throw new Error(\`Not bound: \${name}\`);
    return factory() as T;
  }
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson08({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="oop-08"
      num="08"
      title="Class Types & Type Utilities"
      desc="typeof class, InstanceType<T>, ConstructorParameters<T>, class as first-class value"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Class Types trong TypeScript">
        <Concept>
          <p>
            Trong TypeScript, một class tạo ra <strong>hai</strong> things: (1) constructor function
            (type dùng với <code className="ic">typeof</code>) và (2) instance type (type dùng trực
            tiếp). <code className="ic">InstanceType&lt;T&gt;</code> và{' '}
            <code className="ic">ConstructorParameters&lt;T&gt;</code> cho phép derive types từ
            class definitions.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'typeof Class', code: TYPEOF_CLASS },
            { label: 'InstanceType<T>', code: INSTANCE_TYPE },
            { label: 'Class as value', code: CLASS_AS_VALUE },
            { label: 'ConstructorParameters', code: CONSTRUCTOR_PARAMS },
          ]}
        />
      </Sec>

      <Sec title="Type Utilities cho Classes">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Utility</th>
              <th>Input</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['typeof MyClass', 'Class definition', 'Constructor type'],
              ['InstanceType<typeof MyClass>', 'Constructor type', 'Instance type (= MyClass)'],
              ['ConstructorParameters<typeof MyClass>', 'Constructor type', 'Param tuple'],
              ['new(...args) => T', 'Inline', 'Anonymous constructor type'],
              ['abstract new() => T', 'Inline', 'Abstract constructor type'],
            ].map(([util, input, output]) => (
              <tr key={util}>
                <td>
                  <code>{util}</code>
                </td>
                <td>{input}</td>
                <td>{output}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Class tạo ra 2 types:</strong> <code className="ic">class Foo {'{}'}</code> tạo ra{' '}
          <code className="ic">Foo</code> (instance type) và <code className="ic">typeof Foo</code>{' '}
          (constructor type). Khi dùng Foo làm type annotation, là instance type. Khi dùng{' '}
          <code className="ic">typeof Foo</code> trong generic, là constructor type.
        </Callout>
        <Callout type="warn">
          <strong>Abstract class không thể dùng với new():</strong> Abstract constructor type phải
          khai báo là <code className="ic">abstract new() =&gt; T</code> thay vì{' '}
          <code className="ic">new() =&gt; T</code>. Nếu function nhận abstract class, TypeScript sẽ
          báo lỗi nếu dùng concrete constructor type.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Viết function instantiate<T>(Cls: new() => T): T và instantiateWith<T, Args extends unknown[]>(Cls: new(...args: Args) => T, ...args: Args): T. Test với các classes khác nhau.',
            },
            {
              level: 'medium',
              text: 'Tạo class TypedRegistry<TMap extends Record<string, new(...args: unknown[]) => unknown>> với register<K extends keyof TMap>(key: K, Cls: TMap[K]) và create<K extends keyof TMap>(key: K): InstanceType<TMap[K]>.',
            },
            {
              level: 'hard',
              text: 'Implement type-safe Dependency Injection container: Container với bind<T>(token, factory), bindClass<T>(token, Cls, ...args), get<T>(token): T. Tất cả type-safe — get() return đúng type đã bind.',
            },
          ]}
          hint="instantiate: new Cls(). TypedRegistry: Map<keyof TMap, TMap[keyof TMap]>. DI Container: Map<symbol|string, () => unknown> với overloads cho bind/bindClass."
        />
      </Sec>
    </LessonCard>
  );
}
