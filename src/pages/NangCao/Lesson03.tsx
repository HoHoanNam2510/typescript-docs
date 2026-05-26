import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const BASIC_MAPPED = `// Mapped types — transform mọi property trong một type
// Syntax: { [K in keyof T]: transform(T[K]) }

// Tự build Partial
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// Tự build Readonly
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Tự build Record
type MyRecord<K extends string | number | symbol, V> = {
  [P in K]: V;
};

// Nullable — wrap mọi value trong T | null
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Stringify — convert mọi value sang string (dùng cho form state)
type Stringify<T> = {
  [K in keyof T]: string;
};

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

type UserForm = Stringify<User>;
// { id: string; name: string; email: string; isAdmin: string }

type NullableUser = Nullable<User>;
// { id: number | null; name: string | null; ... }`;

const MODIFIERS = `// Modifier +/- trong mapped types
// + thêm modifier (mặc định), - xóa modifier

// Mutable — xóa readonly
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Required — xóa optional (-)
type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};

// ReadonlyRequired — thêm readonly, xóa optional
type ReadonlyRequired<T> = {
  readonly [K in keyof T]-?: T[K];
};

interface Draft {
  title?: string;
  content?: string;
  readonly id: string;
  readonly createdAt: Date;
}

type EditableDraft = Mutable<Draft>;
// { title?: string; content?: string; id: string; createdAt: Date } — id không còn readonly

type CompleteDraft = MyRequired<Draft>;
// { title: string; content: string; readonly id: string; readonly createdAt: Date }

// PartialKeys — chỉ optional specific keys
type PartialKeys<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: T[P];
};

// ReadonlyKeys — chỉ readonly specific keys
type ReadonlyKeys<T, K extends keyof T> = Omit<T, K> & {
  readonly [P in K]: T[P];
};

type UserWithOptionalEmail = PartialKeys<User, 'email' | 'isAdmin'>;
// { id: number; name: string; email?: string; isAdmin?: boolean }`;

const KEY_REMAPPING = `// Key remapping với as (TypeScript 4.1+)
// { [K in keyof T as NewKey]: T[K] }

// Getters — transform key names
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type UserGetters = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }

// Setters
type Setters<T> = {
  [K in keyof T as \`set\${Capitalize<string & K>}\`]: (value: T[K]) => void;
};

// Prefix all keys
type Prefixed<T, Prefix extends string> = {
  [K in keyof T as \`\${Prefix}_\${string & K}\`]: T[K];
};

type PrefixedUser = Prefixed<User, 'user'>;
// { user_id: number; user_name: string; ... }

// InvertRecord — flip keys & values
type InvertRecord<T extends Record<string, string | number | symbol>> = {
  [K in keyof T as \`\${T[K] & (string | number | symbol)}\`]: K;
};

type StatusCodes = { ok: 200; created: 201; notFound: 404 };
type Inverted = InvertRecord<StatusCodes>;
// { "200": "ok"; "201": "created"; "404": "notFound" }

// Flatten nested object keys (1 level)
type FlattenKeys<T, Prefix extends string = ''> = {
  [K in keyof T as T[K] extends object
    ? never
    : Prefix extends '' ? K & string : \`\${Prefix}.\${K & string}\`
  ]: T[K];
};`;

const FILTER_KEYS = `// Filtering keys với as never — loại bỏ keys không muốn

// PickByValue — giữ keys có value type match V
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

// OmitByValue — loại keys có value type match V
type OmitByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  description: string;
}

type StringFields  = PickByValue<Product, string>;   // { id, name, description }
type NumberFields  = PickByValue<Product, number>;   // { price, stock }
type BooleanFields = PickByValue<Product, boolean>;  // { isActive }

// FunctionKeys — chỉ lấy keys là methods
type FunctionKeys<T> = {
  [K in keyof T as T[K] extends (...args: never[]) => unknown ? K : never]: T[K];
};

interface Service {
  name: string;
  version: number;
  start(): void;
  stop(): void;
  getStatus(): string;
}

type ServiceMethods = FunctionKeys<Service>;
// { start: () => void; stop: () => void; getStatus: () => string }

// RequiredKeys / OptionalKeys
type RequiredKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

interface Form {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
}

type Req = RequiredKeys<Form>; // "name" | "email"
type Opt = OptionalKeys<Form>; // "phone" | "bio"`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson03({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="nc-03"
      num="03"
      title="Mapped Types"
      desc="[K in keyof T], modifiers +/-, key remapping as, PickByValue, Getters/Setters"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Mapped Types">
        <Concept>
          <p>
            <strong>Mapped types</strong> transform mọi property của một type theo một quy tắc nhất
            quán. Syntax cốt lõi:{' '}
            <code className="ic">{'{ [K in keyof T]: transform(T[K]) }'}</code>. Kết hợp với{' '}
            <strong>modifier (+/−)</strong> và <strong>key remapping (as)</strong> (TS 4.1+), mapped
            types là công cụ mạnh nhất để generate types từ types khác.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Cơ bản', code: BASIC_MAPPED },
            { label: 'Modifiers +/-', code: MODIFIERS },
            { label: 'Key remapping', code: KEY_REMAPPING },
            { label: 'Filtering keys', code: FILTER_KEYS },
          ]}
        />
      </Sec>

      <Sec title="Mapped type patterns">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Cú pháp key</th>
              <th>Dùng cho</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Basic transform', '[K in keyof T]', 'Nullable<T>, Stringify<T>'],
              ['Add optional', '[K in keyof T]?', 'Partial<T>'],
              ['Remove optional', '[K in keyof T]-?', 'Required<T>'],
              ['Add readonly', 'readonly [K in keyof T]', 'Readonly<T>'],
              ['Remove readonly', '-readonly [K in keyof T]', 'Mutable<T>'],
              ['Rename keys', '[K in keyof T as NewName]', 'Getters<T>, Prefixed<T>'],
              ['Filter keys', '[K in keyof T as Cond ? K : never]', 'PickByValue<T,V>'],
            ].map(([pattern, syntax, use]) => (
              <tr key={pattern}>
                <td>
                  <strong>{pattern}</strong>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{syntax}</code>
                </td>
                <td>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>string & K để dùng trong template literal:</strong> Khi remapping key,{' '}
          <code className="ic">K</code> là <code className="ic">string | number | symbol</code>.
          Phải dùng <code className="ic">string & K</code> hoặc{' '}
          <code className="ic">K & string</code> trong template literal để TypeScript biết K là
          string.
        </Callout>
        <Callout type="warn">
          <strong>Intersection để combine partial mapped types:</strong> Pattern{' '}
          <code className="ic">ReadonlyKeys&lt;T, K&gt;</code> dùng{' '}
          <code className="ic">Omit&lt;T, K&gt; & {'{ readonly [P in K]: T[P] }'}</code> —
          intersection của hai mapped types. Có thể cần <code className="ic">Prettify</code> để IDE
          hiển thị đẹp hơn.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Implement EventHandlers<T> — với mỗi key K trong T, tạo key onK (capitalize K) có value là (event: T[K]) => void. Test với { click: MouseEvent; keydown: KeyboardEvent }.',
            },
            {
              level: 'medium',
              text: 'Implement FormState<T extends object> = { values: Stringify<T>; errors: Partial<Record<keyof T, string>>; touched: Record<keyof T, boolean>; dirty: Partial<Record<keyof T, boolean>> }.',
            },
            {
              level: 'hard',
              text: 'Implement DeepMutable<T> — xóa readonly đệ quy: T extends (infer E)[] ? DeepMutable<E>[] : T extends object ? { -readonly [K in keyof T]: DeepMutable<T[K]> } : T. Test với DeepReadonly<Config> → mutable lại.',
            },
          ]}
          hint="EventHandlers: [K in keyof T as `on${Capitalize<string & K>}`]. FormState: kết hợp 4 mapped types riêng lẻ. DeepMutable: mirror của DeepReadonly với -readonly modifier."
        />
      </Sec>
    </LessonCard>
  );
}
