import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const COMPONENTS = `// TypeScript với React — Components & Props
import { ReactNode, CSSProperties } from 'react';

// Props typing — function component (không dùng React.FC)
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button
      className={\`btn btn--\${variant}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

// children prop — dùng ReactNode
interface CardProps {
  title: string;
  children: ReactNode;
  style?: CSSProperties;
}

function Card({ title, children, style }: CardProps) {
  return (
    <div className="card" style={style}>
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Discriminated union props
type AlertProps =
  | { type: 'info';    message: string }
  | { type: 'error';   message: string; onRetry?: () => void }
  | { type: 'success'; message: string; onDismiss: () => void };

function Alert(props: AlertProps) {
  return (
    <div className={\`alert alert--\${props.type}\`}>
      {props.message}
      {props.type === 'error' && props.onRetry && (
        <button onClick={props.onRetry}>Retry</button>
      )}
      {props.type === 'success' && (
        <button onClick={props.onDismiss}>Dismiss</button>
      )}
    </div>
  );
}`;

const HOOKS = `// Typed Hooks — useState, useRef, useReducer, useContext

import { useState, useRef, useReducer, createContext, useContext } from 'react';

// useState — TypeScript infer type từ initial value
const [count, setCount] = useState(0);          // number
const [name, setName] = useState('');            // string
const [user, setUser] = useState<User | null>(null); // cần explicit khi null

// useRef — DOM vs mutable ref
const inputRef = useRef<HTMLInputElement>(null);  // DOM ref — nullable
const timerRef = useRef<ReturnType<typeof setInterval>>(null); // mutable ref

// Dùng ref DOM
function focusInput() {
  inputRef.current?.focus(); // optional chaining vì có thể null
}

// useReducer với discriminated union actions
type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset';  value: number }
  | { type: 'set';    value: number };

interface State { count: number; history: number[]; }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment': return { count: state.count + 1, history: [...state.history, state.count] };
    case 'decrement': return { count: state.count - 1, history: [...state.history, state.count] };
    case 'reset':     return { count: action.value, history: [] };
    case 'set':       return { ...state, count: action.value };
  }
}

// useContext — typed context
interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}`;

const EVENTS = `// Event handlers — typed events
import { ChangeEvent, FormEvent, MouseEvent, KeyboardEvent } from 'react';

// Input change
function handleChange(e: ChangeEvent<HTMLInputElement>): void {
  console.log(e.target.value);      // string
  console.log(e.target.checked);    // boolean (checkbox)
}

// Select change
function handleSelect(e: ChangeEvent<HTMLSelectElement>): void {
  console.log(e.target.value); // string
}

// Form submit
function handleSubmit(e: FormEvent<HTMLFormElement>): void {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const name = data.get('name') as string;
  console.log(name);
}

// Mouse event
function handleClick(e: MouseEvent<HTMLButtonElement>): void {
  console.log(e.currentTarget.dataset.id); // string | undefined
}

// Keyboard event
function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
  if (e.key === 'Enter') {
    console.log(e.currentTarget.value);
  }
}

// Component sử dụng
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)} // inferred type
      />
      <input
        type="password"
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}`;

const GENERIC_COMPONENTS = `// Generic components & custom hooks

// Generic List component
interface ListProps<T> {
  items: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
}

function List<T>({ items, keyExtractor, renderItem, emptyMessage = 'No items' }: ListProps<T>) {
  if (items.length === 0) return <p>{emptyMessage}</p>;
  return (
    <ul>
      {items.map((item, i) => (
        <li key={keyExtractor(item)}>{renderItem(item, i)}</li>
      ))}
    </ul>
  );
}

// Usage — T inferred từ items
<List
  items={users}
  keyExtractor={u => u.id}
  renderItem={u => <span>{u.name}</span>}
/>

// Custom hooks — typed return values
function useFetch<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch_ = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      setData(await res.json() as T);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch_(); }, [url]);

  return { data, loading, error, refetch: fetch_ };
}

// Usage — T phải explicit vì không thể infer từ url string
const { data, loading } = useFetch<User[]>('/api/users');`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson03({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="tc-03"
      num="03"
      title="TypeScript với React"
      desc="Components, hooks, event handlers, generic components, custom hooks"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="React + TypeScript">
        <Concept>
          <p>
            React + TypeScript: props typing bằng <code className="ic">interface</code>, hooks tự
            infer type từ initial value (trừ khi cần <code className="ic">null</code> initial).
            Event handlers dùng <code className="ic">ChangeEvent&lt;T&gt;</code>,{' '}
            <code className="ic">FormEvent&lt;T&gt;</code>,{' '}
            <code className="ic">MouseEvent&lt;T&gt;</code> từ React types. Generic components (
            <code className="ic">function List&lt;T&gt;</code>) cho tái sử dụng type-safe.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Components & Props', code: COMPONENTS },
            { label: 'Hooks typing', code: HOOKS },
            { label: 'Event handlers', code: EVENTS },
            { label: 'Generic components', code: GENERIC_COMPONENTS },
          ]}
        />
      </Sec>

      <Sec title="React types cheat sheet">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Tình huống</th>
              <th>Type đúng</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Children prop', 'children: ReactNode'],
              ['Render prop', 'render: (data: T) => ReactNode'],
              ['Ref DOM element', 'useRef<HTMLDivElement>(null)'],
              ['Ref mutable', 'useRef<number>(0)'],
              ['Input onChange', 'ChangeEvent<HTMLInputElement>'],
              ['Form onSubmit', 'FormEvent<HTMLFormElement>'],
              ['Button onClick', 'MouseEvent<HTMLButtonElement>'],
              ['setState với null init', 'useState<User | null>(null)'],
              ['Context', 'createContext<CtxType | null>(null)'],
              ['Async event handler', '(e: FormEvent) => Promise<void>'],
            ].map(([situation, type]) => (
              <tr key={situation}>
                <td style={{ fontSize: 12 }}>{situation}</td>
                <td>
                  <code style={{ fontSize: 11 }}>{type}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Không dùng React.FC:</strong> <code className="ic">React.FC</code> (
          <code className="ic">React.FunctionComponent</code>) đã bị discouraged từ React 18 — nó
          thêm <code className="ic">children</code> implicitly (không cần nữa) và phức tạp hóa
          generic components. Dùng function thông thường với typed props.
        </Callout>
        <Callout type="warn">
          <strong>useContext cần null check:</strong>{' '}
          <code className="ic">createContext(null)</code> và custom hook kiểm tra null sẽ throw
          early nếu dùng ngoài Provider — tốt hơn là để lỗi runtime âm thầm. Pattern này cũng tránh
          phải khai báo <code className="ic">undefined</code> trong ContextValue type.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo component Select<T extends string>(props: { options: T[]; value: T; onChange: (v: T) => void }) — type-safe select với union type options.',
            },
            {
              level: 'medium',
              text: 'Implement useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] — lưu/đọc từ localStorage với JSON serialization. Handle SSR (window undefined).',
            },
            {
              level: 'hard',
              text: 'Implement type-safe form hook: useForm<T extends object>(schema: ZodSchema<T>) — trả về { register(field: keyof T), errors: Partial<Record<keyof T, string>>, handleSubmit(onValid: (data: T) => void) }.',
            },
          ]}
          hint="Select generic: value phải extend string để dùng làm option value. useLocalStorage: try/catch JSON.parse, type guard check window. useForm: kết hợp Zod safeParse với useState errors."
        />
      </Sec>
    </LessonCard>
  );
}
