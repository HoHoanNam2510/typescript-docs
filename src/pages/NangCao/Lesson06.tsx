import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const CLASS_DECORATORS = `// Decorators — metadata & behavior injection
// Cần: "experimentalDecorators": true trong tsconfig.json

// Class decorator — nhận constructor, trả về new constructor hoặc undefined
function sealed(constructor: Function): void {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

function singleton<T extends { new(...args: unknown[]): object }>(constructor: T): T {
  let instance: InstanceType<T>;
  return class extends constructor {
    constructor(...args: unknown[]) {
      super(...args);
      if (instance) return instance;
      instance = this as InstanceType<T>;
    }
  } as T;
}

@singleton
class DatabaseConnection {
  private connected = false;

  connect(url: string): void {
    this.connected = true;
    console.log(\`Connected to \${url}\`);
  }

  isConnected(): boolean { return this.connected; }
}

const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();
console.log(db1 === db2); // true — singleton

// Class decorator với options
function Component(options: { selector: string; template: string }) {
  return function<T extends { new(...args: unknown[]): object }>(constructor: T): T {
    Reflect.defineMetadata('selector', options.selector, constructor);
    Reflect.defineMetadata('template', options.template, constructor);
    return constructor;
  };
}`;

const METHOD_DECORATORS = `// Method decorators — wrap method behavior

// log — ghi lại calls và results
function log(target: object, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const original = descriptor.value as (...args: unknown[]) => unknown;
  descriptor.value = function (this: unknown, ...args: unknown[]) {
    console.log(\`[\${String(key)}] called with:\`, args);
    const result = original.apply(this, args);
    console.log(\`[\${String(key)}] returned:\`, result);
    return result;
  };
  return descriptor;
}

// throttle — giới hạn call frequency
function throttle(limitMs: number) {
  return function (target: object, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    let lastCall = 0;
    const original = descriptor.value as (...args: unknown[]) => unknown;
    descriptor.value = function (this: unknown, ...args: unknown[]) {
      const now = Date.now();
      if (now - lastCall >= limitMs) {
        lastCall = now;
        return original.apply(this, args);
      }
    };
    return descriptor;
  };
}

// memoize decorator
function memoize(target: object, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const cache = new Map<string, unknown>();
  const original = descriptor.value as (...args: unknown[]) => unknown;
  descriptor.value = function (this: unknown, ...args: unknown[]) {
    const cacheKey = JSON.stringify(args);
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    const result = original.apply(this, args);
    cache.set(cacheKey, result);
    return result;
  };
  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }

  @memoize
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }

  @throttle(500)
  onScroll(): void {
    console.log('Scroll handler');
  }
}`;

const PROPERTY_DECORATORS = `// Property decorators & accessor decorators

// Property decorator — nhận target và property key
function readonly(target: object, key: string): void {
  Object.defineProperty(target, key, {
    writable: false,
    configurable: false,
  });
}

function validate(min: number, max: number) {
  return function (target: object, key: string): void {
    let value: number;
    Object.defineProperty(target, key, {
      get() { return value; },
      set(newVal: number) {
        if (newVal < min || newVal > max) {
          throw new RangeError(\`\${key} must be between \${min} and \${max}\`);
        }
        value = newVal;
      },
      enumerable: true,
      configurable: true,
    });
  };
}

class Product {
  @readonly
  readonly id: string = crypto.randomUUID();

  name: string;

  @validate(0, 1_000_000)
  price: number;

  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

// Accessor decorator (TypeScript 5.0 stage 3)
// TS 5.0+ dùng kiểu mới không cần experimentalDecorators
// Nếu dùng TS 5.0+, syntax decorator thay đổi:
//
// function double(target: ClassAccessorDecoratorTarget<unknown, number>,
//                 context: ClassAccessorDecoratorContext) {
//   return {
//     get(this: unknown) { return target.get.call(this) * 2; },
//     set(this: unknown, value: number) { target.set.call(this, value); }
//   };
// }`;

const PARAM_DECORATOR = `// Parameter decorators — ít dùng nhất, thường kết hợp với DI frameworks

// Parameter decorator nhận: target, methodName, parameterIndex
function Required(target: object, key: string, index: number): void {
  const existing: number[] = Reflect.getMetadata('required', target, key) ?? [];
  existing.push(index);
  Reflect.defineMetadata('required', existing, target, key);
}

// Method decorator đọc metadata của parameters
function Validate(target: object, key: string, descriptor: PropertyDescriptor): PropertyDescriptor {
  const original = descriptor.value as (...args: unknown[]) => unknown;
  descriptor.value = function (this: unknown, ...args: unknown[]) {
    const requiredParams: number[] = Reflect.getMetadata('required', target, key) ?? [];
    for (const index of requiredParams) {
      if (args[index] === null || args[index] === undefined) {
        throw new Error(\`Parameter \${index} of \${key} is required\`);
      }
    }
    return original.apply(this, args);
  };
  return descriptor;
}

class UserService {
  @Validate
  createUser(
    @Required name: string,
    @Required email: string,
    role: string = 'user'
  ): { name: string; email: string; role: string } {
    return { name, email, role };
  }
}

// Decorator factories — pattern phổ biến
// Hàm trả về decorator (để nhận options)
function Inject(token: string) {
  return function (target: object, _key: string, index: number): void {
    const tokens: string[] = Reflect.getMetadata('inject', target) ?? [];
    tokens[index] = token;
    Reflect.defineMetadata('inject', tokens, target);
  };
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson06({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="nc-06"
      num="06"
      title="Decorators"
      desc="Class, method, property, parameter decorators — log, throttle, memoize, singleton"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Decorators">
        <Concept>
          <p>
            <strong>Decorators</strong> là syntax sugar để attach metadata và transform
            classes/methods/properties. Cần bật{' '}
            <code className="ic">"experimentalDecorators": true</code> (legacy, trước TS 5.0) hoặc
            dùng <strong>Stage 3 decorators</strong> của TypeScript 5.0+ (không cần flag). Hay dùng
            trong: Angular DI, NestJS, ORMs (TypeORM/MikroORM).
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Class decorators', code: CLASS_DECORATORS },
            { label: 'Method decorators', code: METHOD_DECORATORS },
            { label: 'Property decorators', code: PROPERTY_DECORATORS },
            { label: 'Parameter decorators', code: PARAM_DECORATOR },
          ]}
        />
      </Sec>

      <Sec title="Decorator types">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Loại</th>
              <th>Signature</th>
              <th>Dùng cho</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Class', '(constructor: T): T | void', 'Singleton, sealed, metadata'],
              ['Method', '(target, key, descriptor): descriptor', 'log, retry, throttle, auth'],
              ['Property', '(target, key): void', 'validate, transform, readonly'],
              ['Accessor', '(target, key, descriptor): descriptor', 'Computed getters'],
              ['Parameter', '(target, key, index): void', 'DI injection tokens, validation'],
            ].map(([type, sig, use]) => (
              <tr key={type}>
                <td>
                  <strong>{type}</strong>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{sig}</code>
                </td>
                <td>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Thứ tự thực thi decorators:</strong> Decorators được evaluate từ trên xuống nhưng
          thực thi từ dưới lên (gần method trước). Factory decorators: evaluate factories
          top-to-bottom, apply bottom-to-top. Class decorator chạy sau cùng (sau property/method
          decorators).
        </Callout>
        <Callout type="warn">
          <strong>Legacy vs Stage 3:</strong> TypeScript 5.0 implement Stage 3 decorators khác hoàn
          toàn với <code className="ic">experimentalDecorators</code>. Không tương thích nhau. Khi
          tạo project mới, chọn một trong hai — đừng mix. NestJS, Angular dùng{' '}
          <code className="ic">experimentalDecorators</code>.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Viết method decorator @deprecated(message: string) — log warning khi method được gọi. Viết @time — đo và log thời gian thực thi của method (Date.now() trước và sau call).',
            },
            {
              level: 'medium',
              text: 'Viết class decorator @Injectable() đăng ký class vào một global registry (Map<string, constructor>). Viết function resolve(token: string) lấy instance từ registry — hỗ trợ singleton.',
            },
            {
              level: 'hard',
              text: 'Viết @Cache(ttlMs: number) method decorator — cache kết quả theo args, sau ttlMs ms xóa cache entry đó. Hỗ trợ async functions. Key = JSON.stringify(args), value = { result, expiry: Date.now() + ttl }.',
            },
          ]}
          hint="@deprecated: console.warn trong wrapper. @Injectable: global Map<string, object>. @Cache: Map<string, {result, expiry}>, check Date.now() > expiry khi get."
        />
      </Sec>
    </LessonCard>
  );
}
