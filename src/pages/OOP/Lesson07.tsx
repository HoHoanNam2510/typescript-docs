import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const GENERIC_CLASS_BASICS = `// Generic class — type parameter ở class level

class Stack<T> {
  private items: T[] = [];

  push(item: T): this { // return this để chain
    this.items.push(item);
    return this;
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number { return this.items.length; }
  isEmpty(): boolean { return this.items.length === 0; }
  toArray(): T[]     { return [...this.items]; }
}

// TypeScript infers T từ usage
const numStack = new Stack<number>();
numStack.push(1).push(2).push(3); // chaining
console.log(numStack.peek()); // 3
console.log(numStack.pop());  // 3

const strStack = new Stack<string>();
strStack.push('a').push('b');
// strStack.push(42); // Error — phải là string!

// Generic Pair
class Pair<A, B> {
  constructor(public first: A, public second: B) {}

  swap(): Pair<B, A> {
    return new Pair(this.second, this.first);
  }

  toArray(): [A, B] { return [this.first, this.second]; }
}`;

const GENERIC_CONSTRAINTS = `// Generic constraints với extends

// T phải có id: string
class Repository<T extends { id: string }> {
  protected items: T[] = [];

  save(item: T): T {
    const existing = this.items.findIndex(i => i.id === item.id);
    if (existing >= 0) {
      this.items[existing] = item;
    } else {
      this.items.push(item);
    }
    return item;
  }

  findById(id: string): T | undefined {
    return this.items.find(i => i.id === id);
  }

  delete(id: string): boolean {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx < 0) return false;
    this.items.splice(idx, 1);
    return true;
  }

  findAll(): T[] { return [...this.items]; }
}

// T phải có length — dùng cho string, array, etc.
class MinLengthValidator<T extends { length: number }> {
  constructor(private min: number) {}

  validate(value: T): boolean {
    return value.length >= this.min;
  }

  getError(value: T): string | null {
    if (this.validate(value)) return null;
    return \`Min length is \${this.min}, got \${value.length}\`;
  }
}

const strValidator = new MinLengthValidator<string>(3);
const arrValidator = new MinLengthValidator<number[]>(2);`;

const GENERIC_MULTIPLE_PARAMS = `// Multiple type parameters

class KeyValueStore<K, V> {
  private store = new Map<K, V>();

  set(key: K, value: V): this {
    this.store.set(key, value);
    return this;
  }

  get(key: K): V | undefined {
    return this.store.get(key);
  }

  has(key: K): boolean { return this.store.has(key); }
  delete(key: K): boolean { return this.store.delete(key); }
  get size() { return this.store.size; }

  entries(): [K, V][] {
    return [...this.store.entries()];
  }
}

const store = new KeyValueStore<string, number>();
store.set('one', 1).set('two', 2).set('three', 3);
console.log(store.get('two')); // 2

// Transformer — A → B
class Transformer<TInput, TOutput> {
  private steps: Array<(input: unknown) => unknown> = [];

  pipe<TNext>(fn: (input: TOutput) => TNext): Transformer<TInput, TNext> {
    const next = new Transformer<TInput, TNext>();
    next.steps = [...this.steps, fn as (i: unknown) => unknown];
    return next;
  }

  transform(input: TInput): TOutput {
    return this.steps.reduce((acc, fn) => fn(acc), input as unknown) as TOutput;
  }
}`;

const GENERIC_LINKED_LIST = `// Ví dụ thực tế: Generic LinkedList<T>

interface ListNode<T> {
  value: T;
  next: ListNode<T> | null;
}

class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private _size = 0;

  get size(): number { return this._size; }
  isEmpty(): boolean { return this._size === 0; }

  prepend(value: T): this {
    this.head = { value, next: this.head };
    this._size++;
    return this;
  }

  append(value: T): this {
    const node: ListNode<T> = { value, next: null };
    if (!this.head) { this.head = node; }
    else {
      let curr = this.head;
      while (curr.next) curr = curr.next;
      curr.next = node;
    }
    this._size++;
    return this;
  }

  find(predicate: (value: T) => boolean): T | undefined {
    let curr = this.head;
    while (curr) {
      if (predicate(curr.value)) return curr.value;
      curr = curr.next;
    }
    return undefined;
  }

  toArray(): T[] {
    const result: T[] = [];
    let curr = this.head;
    while (curr) { result.push(curr.value); curr = curr.next; }
    return result;
  }

  [Symbol.iterator](): Iterator<T> {
    let curr = this.head;
    return {
      next(): IteratorResult<T> {
        if (curr) { const value = curr.value; curr = curr.next; return { value, done: false }; }
        return { value: undefined as unknown as T, done: true };
      }
    };
  }
}

const list = new LinkedList<number>().append(1).append(2).append(3);
console.log([...list]); // [1, 2, 3]`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson07({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="oop-07"
      num="07"
      title="Generics với Classes"
      desc="Generic class, constraints, multiple type params, LinkedList implementation"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Generic Classes">
        <Concept>
          <p>
            Generic classes cho phép một class làm việc với nhiều types khác nhau mà vẫn type-safe.
            Type parameter <code className="ic">{'<T>'}</code> ở class level được dùng trong tất cả
            methods và properties. Kết hợp với <code className="ic">extends</code> constraint để
            giới hạn T chỉ những type có properties cần thiết.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Generic class cơ bản', code: GENERIC_CLASS_BASICS },
            { label: 'Constraints', code: GENERIC_CONSTRAINTS },
            { label: 'Multiple type params', code: GENERIC_MULTIPLE_PARAMS },
            { label: 'LinkedList<T>', code: GENERIC_LINKED_LIST },
          ]}
        />
      </Sec>

      <Sec title="Pattern sử dụng Generic Classes">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Ví dụ</th>
              <th>Dùng khi</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Collection', 'Stack<T>, Queue<T>, LinkedList<T>', 'Cần data structure type-safe'],
              ['Repository', 'Repository<T extends {id}>', 'CRUD với entity cụ thể'],
              ['Transformer', 'Transformer<TIn, TOut>', 'Pipeline convert types'],
              ['Validator', 'Validator<T>', 'Validate và type narrow'],
              ['Key-Value', 'Map<K, V>, KeyValueStore<K,V>', 'Typed lookup table'],
              ['Builder', 'Builder<T>', 'Construct phức tạp step-by-step'],
            ].map(([pattern, example, when]) => (
              <tr key={pattern}>
                <td>
                  <strong>{pattern}</strong>
                </td>
                <td>
                  <code>{example}</code>
                </td>
                <td>{when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>return this cho fluent API:</strong> Khai báo return type là{' '}
          <code className="ic">this</code> thay vì tên class cụ thể. Khi subclass gọi method, return
          type sẽ tự động là subclass — không phải parent class. Quan trọng khi extend generic
          class.
        </Callout>
        <Callout type="warn">
          <strong>Generic không phải any:</strong> <code className="ic">Stack&lt;number&gt;</code>{' '}
          chỉ chấp nhận number — khác với <code className="ic">Stack&lt;any&gt;</code> chấp nhận mọi
          thứ. Luôn specify type param cụ thể hoặc để TypeScript infer từ usage đầu tiên.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Implement class Queue<T> với enqueue(item: T), dequeue(): T | undefined, peek(): T | undefined, size: number, isEmpty(): boolean. Dùng array nội bộ.',
            },
            {
              level: 'medium',
              text: 'Tạo class PriorityQueue<T> với enqueue(item: T, priority: number), dequeue(): T | undefined. Item có priority cao hơn được lấy ra trước. Implement với sorted array hoặc heap.',
            },
            {
              level: 'hard',
              text: 'Implement class ObservableList<T> extends LinkedList<T>. Override append, prepend, remove để emit events: "add" khi thêm item, "remove" khi xóa. Dùng EventEmitter pattern với typed events.',
            },
          ]}
          hint="Queue: enqueue = push, dequeue = shift. PriorityQueue: insert sorted by priority. ObservableList: thêm Map<string, Set<Function>> handlers, emit() sau mỗi mutation."
        />
      </Sec>
    </LessonCard>
  );
}
