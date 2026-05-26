import CodeBlock from '../../components/CodeBlock';

const PROJECT_CODE = `// generics-project.ts — Project cuối Module 04
// Áp dụng: generic functions, constraints, recursive types, HOFs, custom utility types

// ═══════════════════════════════════════════════════
// PART 1: Generic Data Structures
// ═══════════════════════════════════════════════════

// Queue<T> — FIFO generic collection
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): this { this.items.push(item); return this; }

  dequeue(): T | undefined { return this.items.shift(); }

  peek(): T | undefined { return this.items[0]; }

  get size(): number { return this.items.length; }
  isEmpty(): boolean { return this.items.length === 0; }
  toArray(): T[] { return [...this.items]; }

  [Symbol.iterator](): Iterator<T> {
    let index = 0;
    const items = this.items;
    return {
      next(): IteratorResult<T> {
        return index < items.length
          ? { value: items[index++], done: false }
          : { value: undefined as unknown as T, done: true };
      }
    };
  }
}

// ═══════════════════════════════════════════════════
// PART 2: Custom Utility Types
// ═══════════════════════════════════════════════════

// DeepPartial — partial đệ quy
type DeepPartial<T> = T extends (infer E)[]
  ? DeepPartial<E>[]
  : T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

// DeepReadonly — readonly đệ quy
type DeepReadonly<T> = T extends (infer E)[]
  ? ReadonlyArray<DeepReadonly<E>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

// PickByValue — chọn keys theo value type
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

// CrudTypes — generate CRUD types từ entity
type CrudTypes<Entity extends { id: string }> = {
  Create: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>;
  Update: Partial<Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>>;
  Response: Omit<Entity, 'password' | 'secret'>;
};

// ═══════════════════════════════════════════════════
// PART 3: Higher-Order Functions
// ═══════════════════════════════════════════════════

// memoize — cache function results
function memoize<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R {
  const cache = new Map<string, R>();
  return (...args: Args): R => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key)!;
  };
}

// retry — tự động retry khi async function fail
function retry<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  maxAttempts = 3,
  delayMs = 500
): (...args: Args) => Promise<R> {
  return async (...args: Args): Promise<R> => {
    let lastError!: Error;
    for (let i = 1; i <= maxAttempts; i++) {
      try {
        return await fn(...args);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (i < maxAttempts) await new Promise(r => setTimeout(r, delayMs * i));
      }
    }
    throw lastError;
  };
}

// pipe — left-to-right function composition
function pipe<A>(a: A): A;
function pipe<A, B>(a: A, f1: (a: A) => B): B;
function pipe<A, B, C>(a: A, f1: (a: A) => B, f2: (b: B) => C): C;
function pipe<A, B, C, D>(a: A, f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D): D;
function pipe(value: unknown, ...fns: Array<(x: unknown) => unknown>): unknown {
  return fns.reduce((acc, fn) => fn(acc), value);
}

// ═══════════════════════════════════════════════════
// PART 4: deepClone — generic deep copy
// ═══════════════════════════════════════════════════

function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value.getTime()) as unknown as T;
  if (Array.isArray(value)) return value.map(deepClone) as unknown as T;
  return Object.fromEntries(
    Object.entries(value as object).map(([k, v]) => [k, deepClone(v)])
  ) as T;
}

// ═══════════════════════════════════════════════════
// Putting it all together
// ═══════════════════════════════════════════════════

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

// Generate CRUD types
type ProductCrud = CrudTypes<Product>;
type CreateProduct = ProductCrud['Create'];   // { name, price, stock, category }
type UpdateProduct = ProductCrud['Update'];   // all optional
type ProductResponse = ProductCrud['Response'];

// Type utilities
type NumberFields = PickByValue<Product, number>; // { price, stock }
type DateFields   = PickByValue<Product, Date>;   // { createdAt, updatedAt }

// Generic repository với constraint
class ProductRepository {
  private items = new Queue<Product>();

  create(data: CreateProduct): Product {
    const product: Product = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.enqueue(product);
    return product;
  }

  findAll(): ProductResponse[] {
    return this.items.toArray();
  }

  update(id: string, data: UpdateProduct): Product | undefined {
    const all = this.items.toArray();
    const idx = all.findIndex(p => p.id === id);
    if (idx < 0) return undefined;
    all[idx] = { ...all[idx], ...data, updatedAt: new Date() };
    return all[idx];
  }
}

// memoize expensive computation
const computeDiscount = memoize((price: number, percent: number): number => {
  console.log(\`Computing discount for \${price}...\`);
  return price * (1 - percent / 100);
});

// pipe transformation
const processProductName = (raw: string): string =>
  pipe(
    raw,
    s => s.trim(),
    s => s.toLowerCase(),
    s => s.replace(/\\s+/g, '-')
  );

// Demo
const repo = new ProductRepository();

const apple = repo.create({ name: 'Apple', price: 10000, stock: 100, category: 'fruit' });
const orange = repo.create({ name: 'Orange', price: 8000, stock: 50, category: 'fruit' });

console.log(computeDiscount(10000, 20)); // Computing... 8000
console.log(computeDiscount(10000, 20)); // 8000 (cached)
console.log(processProductName('  Fresh Apple  ')); // "fresh-apple"

// DeepClone state
const state: DeepReadonly<{ products: Product[] }> = { products: repo.findAll() };
const clone = deepClone(state as { products: Product[] });
clone.products[0].name = 'Modified'; // OK — clone is mutable`;

export default function ProjectSection() {
  return (
    <div
      style={{
        marginTop: '3rem',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '1.5rem 2rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            background: 'var(--accent)',
            color: '#000',
            padding: '2px 8px',
            borderRadius: 4,
            fontWeight: 700,
          }}
        >
          PROJECT
        </span>
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>Cuối Module 04</span>
      </div>

      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
        generics-project.ts — Generic Product System
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Kết hợp toàn bộ kiến thức Module 04: <strong>Queue&lt;T&gt;</strong> generic collection với
        Iterator, <strong>custom utility types</strong> (DeepPartial, DeepReadonly, PickByValue,
        CrudTypes), <strong>higher-order functions</strong> (memoize, retry, pipe), và{' '}
        <strong>deepClone&lt;T&gt;</strong>. ProductRepository áp dụng generic constraints và CRUD
        type generation.
      </p>

      <CodeBlock code={PROJECT_CODE} />

      <div style={{ marginTop: '1rem', fontSize: 12, color: 'var(--text3)' }}>
        Checklist tự review: <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> <code className="ic">Queue&lt;T&gt;</code>{' '}
        — enqueue, dequeue, peek, size, <code className="ic">Symbol.iterator</code> <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span>{' '}
        <code className="ic">deepClone&lt;T&gt;</code> — preserve type, handle Date và Array <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> Custom utilities: DeepPartial,
        PickByValue, CrudTypes — không có <code className="ic">any</code> <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> <code className="ic">tsc --noEmit</code>{' '}
        không lỗi
      </div>
    </div>
  );
}
