import CodeBlock from '../../components/CodeBlock';

const PROJECT_CODE = `// oop-project.ts — Project cuối Module 03
// Áp dụng: classes, generics, interfaces, design patterns, SOLID

// ═══════════════════════════════════════════════════
// PART 1: Generic LinkedList<T> với Iterator
// ═══════════════════════════════════════════════════

interface ListNode<T> {
  value: T;
  next: ListNode<T> | null;
}

class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private _size = 0;

  get size(): number { return this._size; }
  isEmpty(): boolean { return this._size === 0; }

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

  prepend(value: T): this {
    this.head = { value, next: this.head };
    this._size++;
    return this;
  }

  pop(): T | undefined {
    if (!this.head) return undefined;
    if (!this.head.next) {
      const val = this.head.value;
      this.head = null;
      this._size--;
      return val;
    }
    let curr = this.head;
    while (curr.next?.next) curr = curr.next;
    const val = curr.next!.value;
    curr.next = null;
    this._size--;
    return val;
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
        if (curr) {
          const value = curr.value;
          curr = curr.next;
          return { value, done: false };
        }
        return { value: undefined as unknown as T, done: true };
      }
    };
  }
}

// ═══════════════════════════════════════════════════
// PART 2: Animal Hierarchy
// ═══════════════════════════════════════════════════

abstract class Animal {
  constructor(
    public readonly name: string,
    protected readonly sound: string
  ) {}

  speak(): string { return \`\${this.name}: \${this.sound}!\`; }
  abstract describe(): string;
}

abstract class Mammal extends Animal {
  protected warmBlooded = true;
  nurseYoung(): string { return \`\${this.name} nurses young\`; }
}

abstract class Bird extends Animal {
  abstract canFly: boolean;
  sing(): string { return \`\${this.name} sings melodically\`; }
}

interface IHuntable {
  hunt(prey: string): string;
}

class Dog extends Mammal implements IHuntable {
  constructor(name: string, public breed: string) {
    super(name, 'Woof');
  }
  describe(): string { return \`Dog(\${this.name}, \${this.breed})\`; }
  hunt(prey: string): string { return \`\${this.name} chases the \${prey}!\`; }
}

class Cat extends Mammal {
  constructor(name: string, private indoor: boolean) {
    super(name, 'Meow');
  }
  describe(): string { return \`Cat(\${this.name}, \${this.indoor ? 'indoor' : 'outdoor'})\`; }
  purr(): string { return \`\${this.name} purrs contentedly\`; }
}

class Eagle extends Bird implements IHuntable {
  readonly canFly = true;
  constructor(name: string) { super(name, 'Screech'); }
  describe(): string { return \`Eagle(\${this.name})\`; }
  hunt(prey: string): string { return \`\${this.name} dives for the \${prey}!\`; }
}

class Penguin extends Bird {
  readonly canFly = false;
  constructor(name: string) { super(name, 'Squawk'); }
  describe(): string { return \`Penguin(\${this.name})\`; }
  swim(): string { return \`\${this.name} swims gracefully\`; }
}

function isHuntable(animal: Animal): animal is Animal & IHuntable {
  return 'hunt' in animal;
}

// ═══════════════════════════════════════════════════
// PART 3: Type-safe EventEmitter<Events>
// ═══════════════════════════════════════════════════

type EventMap = Record<string, unknown>;
type Listener<T> = (data: T) => void;

class EventEmitter<Events extends EventMap> {
  private listeners = new Map<keyof Events, Set<Listener<unknown>>>();

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener as Listener<unknown>);
    return this;
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this {
    this.listeners.get(event)?.delete(listener as Listener<unknown>);
    return this;
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): this {
    this.listeners.get(event)?.forEach(l => l(data));
    return this;
  }

  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this {
    const wrapper: Listener<Events[K]> = data => { listener(data); this.off(event, wrapper); };
    return this.on(event, wrapper);
  }

  removeAllListeners(event?: keyof Events): this {
    if (event) this.listeners.delete(event);
    else this.listeners.clear();
    return this;
  }
}

// Typed events cho Zoo
type ZooEvents = {
  animalAdded:   { animal: Animal };
  animalRemoved: { name: string };
  feeding:       { animal: Animal; food: string };
};

// ═══════════════════════════════════════════════════
// Putting it all together: Zoo
// ═══════════════════════════════════════════════════

class Zoo extends EventEmitter<ZooEvents> {
  private animals = new LinkedList<Animal>();

  addAnimal(animal: Animal): this {
    this.animals.append(animal);
    this.emit('animalAdded', { animal });
    return this;
  }

  removeAnimal(name: string): boolean {
    const arr = this.animals.toArray().filter(a => a.name !== name);
    if (arr.length === this.animals.size) return false;
    // rebuild list
    (this as { animals: LinkedList<Animal> }).animals = new LinkedList<Animal>();
    arr.forEach(a => this.animals.append(a));
    this.emit('animalRemoved', { name });
    return true;
  }

  feed(animalName: string, food: string): void {
    const animal = this.animals.find(a => a.name === animalName);
    if (animal) this.emit('feeding', { animal, food });
  }

  getAll(): Animal[] { return this.animals.toArray(); }

  getHunters(): Array<Animal & IHuntable> {
    return this.getAll().filter(isHuntable);
  }
}

// Demo
const zoo = new Zoo();

zoo.on('animalAdded', ({ animal }) => console.log(\`+ \${animal.describe()}\`));
zoo.on('feeding', ({ animal, food }) => console.log(\`\${animal.name} eats \${food}\`));

zoo.addAnimal(new Dog('Rex', 'German Shepherd'))
   .addAnimal(new Cat('Whiskers', true))
   .addAnimal(new Eagle('Sky'))
   .addAnimal(new Penguin('Tux'));

zoo.feed('Rex', 'steak');
zoo.getHunters().forEach(h => console.log(h.hunt('rabbit')));

// Iterate với for..of
for (const animal of zoo.getAll()) {
  console.log(animal.speak());
}`;

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
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>Cuối Module 03</span>
      </div>

      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
        oop-project.ts — Zoo Management System
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Kết hợp toàn bộ kiến thức Module 03: <strong>LinkedList&lt;T&gt;</strong> generic với
        Iterator protocol, <strong>Animal hierarchy</strong> (abstract class, inheritance,
        polymorphism, interface IHuntable), và <strong>EventEmitter&lt;Events&gt;</strong>{' '}
        type-safe. Zoo class compose tất cả lại, áp dụng SOLID principles.
      </p>

      <CodeBlock code={PROJECT_CODE} />

      <div style={{ marginTop: '1rem', fontSize: 12, color: 'var(--text3)' }}>
        Checklist tự review: <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span>{' '}
        <code className="ic">LinkedList&lt;T&gt;</code> — append, prepend, pop, find, toArray,{' '}
        <code className="ic">Symbol.iterator</code> <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> Animal hierarchy — abstract class,
        multi-level, interface <code className="ic">IHuntable</code>, type guard <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span>{' '}
        <code className="ic">EventEmitter&lt;Events&gt;</code> — typed on/off/emit/once <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> <code className="ic">tsc --noEmit</code>{' '}
        không lỗi — không có <code className="ic">any</code>
      </div>
    </div>
  );
}
