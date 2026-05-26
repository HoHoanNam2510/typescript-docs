import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const DEEP_PARTIAL = `// Recursive types — types tự tham chiếu đến chính mình

// DeepPartial — Partial đệ quy cho nested objects
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

interface AppConfig {
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      cert: string;
    };
  };
  database: {
    url: string;
    poolSize: number;
  };
  features: {
    auth: boolean;
    cache: boolean;
  };
}

// Cho phép update nested fields một phần
type PartialConfig = DeepPartial<AppConfig>;

function updateConfig(current: AppConfig, patch: DeepPartial<AppConfig>): AppConfig {
  // Deep merge
  function merge(target: object, source: object): object {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      const sv = (source as Record<string, unknown>)[key];
      const tv = (target as Record<string, unknown>)[key];
      if (sv && typeof sv === 'object' && tv && typeof tv === 'object') {
        (result as Record<string, unknown>)[key] = merge(tv as object, sv as object);
      } else if (sv !== undefined) {
        (result as Record<string, unknown>)[key] = sv;
      }
    }
    return result;
  }
  return merge(current, patch) as AppConfig;
}`;

const DEEP_READONLY = `// DeepReadonly — Readonly đệ quy

type DeepReadonly<T> = T extends (infer E)[]
  ? ReadonlyArray<DeepReadonly<E>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

interface State {
  users: Array<{
    id: string;
    name: string;
    settings: { theme: 'light' | 'dark'; lang: string };
  }>;
  loading: boolean;
}

type ImmutableState = DeepReadonly<State>;

declare const state: ImmutableState;
// state.users[0].name = 'X';        // Error — readonly!
// state.users.push({...});          // Error — ReadonlyArray!
// state.users[0].settings.theme = 'dark'; // Error — readonly!

// DeepRequired — Required đệ quy
type DeepRequired<T> = T extends object
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : T;

interface Draft {
  title?: string;
  content?: string;
  meta?: {
    tags?: string[];
    author?: string;
  };
}

type CompleteDraft = DeepRequired<Draft>;
// { title: string; content: string; meta: { tags: string[]; author: string } }`;

const RECURSIVE_DATA = `// Recursive data structures

// Tree node
type TreeNode<T> = {
  value: T;
  children?: TreeNode<T>[];
};

// Linked list
type LinkedListNode<T> = {
  value: T;
  next: LinkedListNode<T> | null;
};

// JSON type — self-referential
type JSONPrimitive = string | number | boolean | null;
type JSONValue = JSONPrimitive | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];

// Safe parse
function parseJSON(input: string): JSONValue {
  return JSON.parse(input) as JSONValue;
}

// Deep clone với type preservation
function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(deepClone) as unknown as T;
  return Object.fromEntries(
    Object.entries(value as object).map(([k, v]) => [k, deepClone(v)])
  ) as T;
}

// Type-safe path accessor
type Path<T, K extends keyof T = keyof T> =
  K extends string
    ? T[K] extends Record<string, unknown>
      ? K | \`\${K}.\${Path<T[K]>}\`
      : K
    : never;

type ConfigPath = Path<AppConfig>;
// "server" | "server.host" | "server.port" | "database" | ...`;

const RECURSIVE_CONDITIONAL = `// Recursive conditional types — depth-limited (TS hạn chế đệ quy)

// Flatten array type (1 level)
type Flatten<T> = T extends (infer E)[] ? E : T;

// Deep flatten — TS giới hạn recursion depth
type DeepFlatten<T> = T extends (infer E)[]
  ? E extends (infer F)[]
    ? DeepFlatten<F[]>
    : E
  : T;

type F1 = DeepFlatten<number[][][]>; // number

// Tuple → union
type TupleToUnion<T extends unknown[]> = T[number];
type TU = TupleToUnion<['a', 'b', 'c']>; // "a" | "b" | "c"

// Union → tuple (order not guaranteed — use with care)
type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends
  (x: infer I) => void ? I : never;

// Flatten object (1 level)
type FlattenObject<T extends object, Prefix extends string = ''> = {
  [K in keyof T as T[K] extends object
    ? never
    : Prefix extends ''
    ? K & string
    : \`\${Prefix}.\${K & string}\`
  ]: T[K];
} & (T[keyof T] extends object
  ? FlattenObject<Extract<T[keyof T], object>>
  : Record<string, never>);

// Depth-limited DeepPartial (safer)
type DeepPartialN<T, Depth extends number = 5, Counter extends 0[] = []> =
  Counter['length'] extends Depth
    ? T
    : T extends object
    ? { [K in keyof T]?: DeepPartialN<T[K], Depth, [0, ...Counter]> }
    : T;`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson07({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="gen-07"
      num="07"
      title="Recursive Types"
      desc="DeepPartial, DeepReadonly, JSONValue, recursive data structures, depth limits"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Recursive Types">
        <Concept>
          <p>
            TypeScript hỗ trợ <strong>recursive type aliases</strong> từ 3.7 và cải thiện qua các
            version. Recursive types cho phép mô hình hóa <code className="ic">DeepPartial</code>,{' '}
            <code className="ic">DeepReadonly</code>, <code className="ic">JSONValue</code>,
            tree/linked list structures — những types mà không recursive không thể express được.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'DeepPartial<T>', code: DEEP_PARTIAL },
            { label: 'DeepReadonly & DeepRequired', code: DEEP_READONLY },
            { label: 'Recursive data structures', code: RECURSIVE_DATA },
            { label: 'Recursive conditionals', code: RECURSIVE_CONDITIONAL },
          ]}
        />
      </Sec>

      <Sec title="Recursive type patterns">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Định nghĩa</th>
              <th>Dùng khi</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                'DeepPartial<T>',
                'T extends object ? {[K]?: Deep<T[K]>} : T',
                'Patch/merge nested objects',
              ],
              ['DeepReadonly<T>', 'Readonly + arrays + recursion', 'Immutable state'],
              ['DeepRequired<T>', '-? recursive', 'Validate complete form'],
              ['JSONValue', 'Primitive | JSONObject | JSONArray', 'Typed JSON.parse result'],
              [
                'TreeNode<T>',
                '{ value: T; children?: TreeNode<T>[] }',
                'File tree, DOM, org chart',
              ],
            ].map(([type, def, when]) => (
              <tr key={type}>
                <td>
                  <code>{type}</code>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{def}</code>
                </td>
                <td>{when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>TypeScript giới hạn recursion depth:</strong> TypeScript có giới hạn độ sâu đệ quy
          để tránh vòng lặp vô hạn. Nếu gặp lỗi "Type instantiation is excessively deep", dùng trick
          counter với <code className="ic">Counter extends 0[]</code> để limit depth tường minh,
          hoặc đơn giản hóa type.
        </Callout>
        <Callout type="warn">
          <strong>Circular references trong objects:</strong> <code className="ic">deepClone</code>{' '}
          ở trên không handle circular references — sẽ stack overflow. Trong production, dùng{' '}
          <code className="ic">structuredClone()</code> (native) hoặc library như{' '}
          <code className="ic">rfdc</code> để handle edge cases.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Implement DeepPartial<T> và DeepReadonly<T>. Test với AppConfig interface có 3 levels nested. Verify bằng cách thử gán vào DeepReadonly object — TypeScript phải báo lỗi.',
            },
            {
              level: 'medium',
              text: 'Implement type-safe deepMerge<T extends object>(target: T, source: DeepPartial<T>): T — merge nested objects, không ghi đè arrays (replace thay vì concat). Xử lý trường hợp source property là undefined.',
            },
            {
              level: 'hard',
              text: 'Implement type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer Rest}` ? K extends keyof T ? PathValue<T[K], Rest & Path<T[K]>> : never : P extends keyof T ? T[P] : never. Sau đó viết getPath(obj, path) dùng type này.',
            },
          ]}
          hint="DeepPartial: T extends (infer E)[] ? DeepPartial<E>[] : ... để handle arrays. deepMerge: Object.keys(source).forEach recursive. PathValue: split path bằng conditional, stop khi không còn dấu chấm."
        />
      </Sec>
    </LessonCard>
  );
}
