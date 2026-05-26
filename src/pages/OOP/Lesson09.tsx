import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const OBSERVER_PATTERN = `// Observer Pattern — type-safe EventEmitter

type EventMap = Record<string, unknown>;
type Listener<T> = (data: T) => void;

class EventEmitter<Events extends EventMap> {
  private listeners = new Map<
    keyof Events,
    Set<Listener<unknown>>
  >();

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener as Listener<unknown>);
    return this;
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this {
    this.listeners.get(event)?.delete(listener as Listener<unknown>);
    return this;
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): this {
    this.listeners.get(event)?.forEach(listener => listener(data));
    return this;
  }

  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): this {
    const wrapper: Listener<Events[K]> = data => {
      listener(data);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }
}

// Usage — fully type-safe
type StoreEvents = {
  productAdded:   { id: string; name: string; price: number };
  productRemoved: { id: string };
  stockUpdated:   { id: string; stock: number };
};

const store = new EventEmitter<StoreEvents>();
store.on('productAdded', p => console.log(\`Added: \${p.name}\`));
// store.on('productAdded', p => p.nonExistent); // Error!
store.emit('productAdded', { id: '1', name: 'Apple', price: 10 });`;

const FACTORY_PATTERN = `// Factory Pattern — tạo objects mà không biết class cụ thể

interface Button {
  render(): string;
  onClick(handler: () => void): void;
}

interface Dialog {
  render(): string;
  close(): void;
}

// Abstract factory
abstract class UIFactory {
  abstract createButton(label: string): Button;
  abstract createDialog(title: string): Dialog;

  // Template method dùng factory methods
  createConfirmDialog(title: string, confirmLabel: string): Dialog {
    const dialog = this.createDialog(title);
    const btn = this.createButton(confirmLabel);
    btn.onClick(() => dialog.close());
    return dialog;
  }
}

class WebUIFactory extends UIFactory {
  createButton(label: string): Button {
    return {
      render: () => \`<button class="btn">\${label}</button>\`,
      onClick: (h) => document.querySelector('button')?.addEventListener('click', h),
    };
  }

  createDialog(title: string): Dialog {
    return {
      render: () => \`<dialog><h2>\${title}</h2></dialog>\`,
      close: () => console.log('Dialog closed'),
    };
  }
}

class MobileUIFactory extends UIFactory {
  createButton(label: string): Button {
    return {
      render: () => \`<TouchableOpacity><Text>\${label}</Text></TouchableOpacity>\`,
      onClick: (h) => { /* register touch handler */ },
    };
  }

  createDialog(title: string): Dialog {
    return {
      render: () => \`<Modal><Text>\${title}</Text></Modal>\`,
      close: () => console.log('Modal dismissed'),
    };
  }
}`;

const STRATEGY_PATTERN = `// Strategy Pattern — swap algorithms at runtime

interface SortStrategy<T> {
  sort(data: T[], compare: (a: T, b: T) => number): T[];
}

class BubbleSort<T> implements SortStrategy<T> {
  sort(data: T[], compare: (a: T, b: T) => number): T[] {
    const arr = [...data];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (compare(arr[j], arr[j + 1]) > 0) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class QuickSort<T> implements SortStrategy<T> {
  sort(data: T[], compare: (a: T, b: T) => number): T[] {
    if (data.length <= 1) return data;
    const pivot = data[Math.floor(data.length / 2)];
    const left  = data.filter(x => compare(x, pivot) < 0);
    const mid   = data.filter(x => compare(x, pivot) === 0);
    const right = data.filter(x => compare(x, pivot) > 0);
    return [...this.sort(left, compare), ...mid, ...this.sort(right, compare)];
  }
}

class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}

  setStrategy(strategy: SortStrategy<T>): void {
    this.strategy = strategy;
  }

  sort(data: T[], compare: (a: T, b: T) => number): T[] {
    return this.strategy.sort(data, compare);
  }
}

const sorter = new Sorter<number>(new QuickSort());
console.log(sorter.sort([5,3,1,4,2], (a,b) => a - b)); // [1,2,3,4,5]`;

const DECORATOR_PATTERN = `// Decorator Pattern — thêm behavior mà không sửa class gốc

interface Logger {
  log(message: string): void;
}

// Base component
class SimpleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}

// Decorator base
abstract class LoggerDecorator implements Logger {
  constructor(protected wrapped: Logger) {}
  abstract log(message: string): void;
}

// Concrete decorators
class TimestampDecorator extends LoggerDecorator {
  log(message: string): void {
    const ts = new Date().toISOString();
    this.wrapped.log(\`[\${ts}] \${message}\`);
  }
}

class PrefixDecorator extends LoggerDecorator {
  constructor(wrapped: Logger, private prefix: string) {
    super(wrapped);
  }

  log(message: string): void {
    this.wrapped.log(\`\${this.prefix}: \${message}\`);
  }
}

class FilterDecorator extends LoggerDecorator {
  constructor(wrapped: Logger, private minLevel: 'info' | 'warn' | 'error') {
    super(wrapped);
  }

  log(message: string): void {
    // chỉ log nếu message chứa level phù hợp
    if (message.includes(this.minLevel) || this.minLevel === 'info') {
      this.wrapped.log(message);
    }
  }
}

// Compose decorators
const logger: Logger =
  new TimestampDecorator(
    new PrefixDecorator(
      new SimpleLogger(),
      'APP'
    )
  );
logger.log('Server started'); // "[2024-...] APP: Server started"`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson09({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="oop-09"
      num="09"
      title="Design Patterns"
      desc="Observer/EventEmitter, Factory, Strategy, Decorator — patterns OOP cổ điển"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Design Patterns với TypeScript">
        <Concept>
          <p>
            Design patterns là giải pháp đã được kiểm chứng cho các vấn đề OOP phổ biến. TypeScript
            cho phép implement chúng với <strong>full type safety</strong> — không cần cast hay{' '}
            <code className="ic">any</code>. Generics và interfaces làm cho patterns trở nên
            flexible và reusable hơn.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Observer / EventEmitter', code: OBSERVER_PATTERN },
            { label: 'Factory (Abstract)', code: FACTORY_PATTERN },
            { label: 'Strategy', code: STRATEGY_PATTERN },
            { label: 'Decorator', code: DECORATOR_PATTERN },
          ]}
        />
      </Sec>

      <Sec title="Tổng quan Design Patterns">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Nhóm</th>
              <th>Mục đích</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Observer', 'Behavioral', 'Notify nhiều objects khi state thay đổi'],
              [
                'Factory / Abstract Factory',
                'Creational',
                'Tạo objects mà không biết class cụ thể',
              ],
              ['Strategy', 'Behavioral', 'Swap algorithm tại runtime'],
              ['Decorator', 'Structural', 'Thêm behavior không sửa class gốc'],
              ['Singleton', 'Creational', 'Đảm bảo chỉ 1 instance (bài 06)'],
              ['Repository', 'Architectural', 'Abstract data access (bài 04)'],
            ].map(([pattern, group, purpose]) => (
              <tr key={pattern}>
                <td>
                  <strong>{pattern}</strong>
                </td>
                <td>{group}</td>
                <td>{purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Typed EventEmitter với generic:</strong>{' '}
          <code className="ic">
            EventEmitter&lt;Events extends Record&lt;string, unknown&gt;&gt;
          </code>{' '}
          đảm bảo <code className="ic">emit('productAdded', data)</code> kiểm tra data phải match
          type của event đó. Đây là cách TypeScript-idiomatic để implement Observer.
        </Callout>
        <Callout type="warn">
          <strong>Đừng pattern over-engineer:</strong> Không phải mọi code đều cần Design Pattern.
          Chỉ dùng khi bài toán thực sự khớp — ví dụ Strategy khi có nhiều algorithm cần swap,
          Factory khi có nhiều class cần tạo theo condition. Over-engineering tăng complexity không
          cần thiết.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Implement Observer đơn giản: class Subject<T> với subscribe(observer: (data: T) => void), unsubscribe, notify(data: T). Test với temperature sensor phát ra nhiệt độ.',
            },
            {
              level: 'medium',
              text: 'Implement Strategy Pattern cho payment processing: interface PaymentStrategy với pay(amount: number). Concrete: CashPayment, CardPayment, CryptoPayment. class ShoppingCart dùng strategy.',
            },
            {
              level: 'hard',
              text: 'Implement typed EventEmitter<Events> đầy đủ: on, off, emit, once, removeAllListeners(event?). Thêm method pipe<K>(event: K, target: EventEmitter<Events>): unsubscribe — forward events sang emitter khác.',
            },
          ]}
          hint="Subject: Set<observer> để lưu. ShoppingCart: constructor(private strategy: PaymentStrategy), setStrategy(). EventEmitter.pipe: đăng ký listener rồi re-emit sang target."
        />
      </Sec>
    </LessonCard>
  );
}
