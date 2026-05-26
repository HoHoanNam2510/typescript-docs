import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const MAPPED_BASIC = `// Mapped Types — tạo type mới bằng cách iterate qua keys
// Syntax: { [K in keyof T]: NewType }

type User = { id: number; name: string; email: string };

// Tự implement Partial — làm tất cả fields optional
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
type PartialUser = MyPartial<User>;
// { id?: number; name?: string; email?: string }

// Tự implement Required — làm tất cả fields bắt buộc
type MyRequired<T> = {
  [K in keyof T]-?: T[K]; // -? xóa optional modifier
};

// Tự implement Readonly
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Tự implement Mutable — xóa readonly
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]; // -readonly xóa readonly modifier
};`;

const MAPPED_TRANSFORM = `// Mapped Types với value transformation
type User = { id: number; name: string; active: boolean };

// Convert tất cả values sang string
type Stringify<T> = {
  [K in keyof T]: string;
};
type StringUser = Stringify<User>; // { id: string; name: string; active: string }

// Nullable — wrap tất cả values với | null
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};
type NullableUser = Nullable<User>; // { id: number | null; name: string | null; ... }

// Getters — transform mỗi property thành getter function
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
// Getters<User> = { getId: () => number; getName: () => string; getActive: () => boolean }

// Boolean flags — convert mỗi key thành boolean flag
type Flags<T> = {
  [K in keyof T]: boolean;
};`;

const MAPPED_FILTER = `// Key remapping (TS 4.1+) — đổi tên keys trong mapped type
// Syntax: [K in keyof T as NewKey]: ...

type User = { id: number; name: string; _internal: string };

// Lọc bỏ keys bắt đầu bằng _
type PublicProps<T> = {
  [K in keyof T as K extends \`_\${string}\` ? never : K]: T[K];
};
type PublicUser = PublicProps<User>; // { id: number; name: string }

// Convert sang camelCase getters
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

// Filter chỉ lấy string value types
type StringOnly<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
type StringUser = StringOnly<User>; // { name: string; _internal: string }

// Reverse mapping — từ values sang keys
type ReverseMap<T extends Record<string, string>> = {
  [V in T[keyof T]]: { [K in keyof T]: T[K] extends V ? K : never }[keyof T];
};`;

const MAPPED_PRACTICAL = `// Thực tế: Form validation types
type User = { name: string; email: string; age: number };

// Form state — tất cả fields là string (input values)
type FormValues<T> = { [K in keyof T]: string };

// Form errors — tất cả fields là string | undefined
type FormErrors<T> = { [K in keyof T]?: string };

// Form touched state
type FormTouched<T> = { [K in keyof T]: boolean };

type UserForm = {
  values: FormValues<User>;    // { name: string; email: string; age: string }
  errors: FormErrors<User>;    // { name?: string; email?: string; age?: string }
  touched: FormTouched<User>;  // { name: boolean; email: boolean; age: boolean }
};

// API response wrapper
type ApiResponse<T> = {
  [K in keyof T]: {
    data: T[K];
    loading: boolean;
    error: string | null;
  };
};
// Dùng cho store state với loading/error per field`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson07({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="kd-07"
      num="07"
      title="Mapped Types"
      desc="Tạo type mới bằng cách transform keys và values của type khác"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Mapped Types">
        <Concept>
          <p>
            <strong>Mapped Types</strong> tạo type mới bằng cách duyệt qua từng key của type khác và
            transform nó. Syntax: <code className="ic">{'{ [K in keyof T]: NewType }'}</code>. Đây
            là nền tảng của hầu hết built-in utility types.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Cơ bản — Partial/Required', code: MAPPED_BASIC },
            { label: 'Transform values', code: MAPPED_TRANSFORM },
            { label: 'Filter & remap keys', code: MAPPED_FILTER },
            { label: 'Thực tế — Form types', code: MAPPED_PRACTICAL },
          ]}
        />
      </Sec>

      <Sec title="Các modifier trong mapped type">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Modifier</th>
              <th>Ý nghĩa</th>
              <th>Ví dụ</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['?', 'Thêm optional', '[K in keyof T]?: T[K]'],
              ['-?', 'Xóa optional (Required)', '[K in keyof T]-?: T[K]'],
              ['readonly', 'Thêm readonly', 'readonly [K in keyof T]: T[K]'],
              ['-readonly', 'Xóa readonly (Mutable)', '-readonly [K in keyof T]: T[K]'],
              ['as NewKey', 'Đổi tên key (4.1+)', '[K in keyof T as NewName]: T[K]'],
              ['as never', 'Lọc bỏ key', '[K in keyof T as Condition ? K : never]'],
            ].map(([mod, meaning, example]) => (
              <tr key={mod}>
                <td>
                  <code>{mod}</code>
                </td>
                <td>{meaning}</td>
                <td>
                  <code>{example}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Mapped Types là nền tảng của Utility Types:</strong> Partial, Required, Readonly,
          Pick, Omit, Record đều được implement bằng mapped types. Hiểu mapped types giúp bạn tự tạo
          utility types phù hợp với dự án.
        </Callout>
        <Callout type="warn">
          <strong>Key remapping cần TS 4.1+:</strong> Syntax <code className="ic">as NewKey</code>{' '}
          trong mapped type chỉ có từ TypeScript 4.1. Kiểm tra version trước khi dùng. Template
          literal types trong key remapping (như{' '}
          <code className="ic">get${'${Capitalize<K>}'}</code>) cũng cần 4.1+.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tự implement Readonly<T> và Mutable<T> (xóa readonly). Viết type test để verify: type T1 = Readonly<{x: number}> phải có readonly x.',
            },
            {
              level: 'medium',
              text: 'Tạo type Nullable<T> — wrap tất cả properties với | null. Tạo type NonNullableProps<T> — xóa null khỏi tất cả properties dùng mapped type + conditional type.',
            },
            {
              level: 'hard',
              text: 'Implement type EventHandlers<T> — từ type T tạo ra object với các keys là "on" + Capitalize<K> và value là (event: T[K]) => void. EventHandlers<{click: MouseEvent}> = {onClick: (e: MouseEvent) => void}.',
            },
          ]}
          hint="Mutable: -readonly [K in keyof T]. Nullable: T[K] | null. NonNullableProps: T[K] extends null | undefined ? never : T[K]. EventHandlers: [K in keyof T as `on${Capitalize<string & K>}`]: (e: T[K]) => void."
        />
      </Sec>
    </LessonCard>
  );
}
