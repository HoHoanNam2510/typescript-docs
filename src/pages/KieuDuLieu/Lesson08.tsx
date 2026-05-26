import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const TL_BASIC = `// Template Literal Types (TS 4.1+) — tạo string types từ template
// Giống template literals JS nhưng ở type level

type Greeting = \`Hello, \${string}!\`;
const g1: Greeting = 'Hello, Alice!'; // OK
const g2: Greeting = 'Hi, Alice!';    // Error — phải bắt đầu bằng "Hello, "

// Kết hợp union types → tạo tất cả tổ hợp
type Color = 'red' | 'green' | 'blue';
type Size = 'sm' | 'md' | 'lg';
type ButtonVariant = \`\${Color}-\${Size}\`;
// "red-sm" | "red-md" | "red-lg" | "green-sm" | ... (9 variants)

// HTTP routes
type HttpVerb = 'get' | 'post' | 'put' | 'delete';
type ApiRoute = \`/api/\${string}\`;

function fetchApi(route: ApiRoute) { /* ... */ }
fetchApi('/api/users');  // OK
fetchApi('/users');      // Error — phải bắt đầu bằng /api/

// CSS property names
type CssProperty = 'margin' | 'padding' | 'border';
type CssDirection = 'top' | 'right' | 'bottom' | 'left';
type CssShorthand = \`\${CssProperty}-\${CssDirection}\`;
// "margin-top" | "margin-right" | ... (12 variants)`;

const TL_CAPITALIZE = `// Intrinsic string manipulation types
// Uppercase, Lowercase, Capitalize, Uncapitalize

type Upper = Uppercase<'hello'>; // "HELLO"
type Lower = Lowercase<'WORLD'>; // "world"
type Cap = Capitalize<'hello'>;  // "Hello"
type Uncap = Uncapitalize<'Hello'>; // "hello"

// Tạo getter/setter names
type User = { id: number; name: string; email: string };

type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getId: () => number; getName: () => string; getEmail: () => string }

type Setters<T> = {
  [K in keyof T as \`set\${Capitalize<string & K>}\`]: (value: T[K]) => void;
};

type UserSetters = Setters<User>;
// { setId: (value: number) => void; ... }

// Event handler names
type EventNames<T> = {
  [K in keyof T as \`on\${Capitalize<string & K>}\`]: (e: T[K]) => void;
};`;

const TL_PARSING = `// Template Literal Types để parse string patterns

// Tách prefix
type ExtractRoute<T extends string> =
  T extends \`/api/\${infer Rest}\` ? Rest : never;

type Routes = '/api/users' | '/api/posts' | '/home';
type ApiPaths = ExtractRoute<Routes>; // "users" | "posts"

// EventEmitter type-safe
type EventMap = {
  userCreated: { id: number; name: string };
  userDeleted: { id: number };
  postPublished: { postId: number; title: string };
};

// Extract entity và action từ event name
type ExtractEntity<T extends string> =
  T extends \`\${infer Entity}\${Capitalize<string>}\` ? Entity : never;

// Type-safe emit
function emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
  console.log(event, payload);
}

emit('userCreated', { id: 1, name: 'Alice' }); // OK
emit('userDeleted', { id: 1 });                 // OK
// emit('userCreated', { id: 1 }); // Error — thiếu name`;

const TL_PRACTICAL = `// Ứng dụng thực tế: CSS-in-JS type safety

type SpacingScale = 0 | 1 | 2 | 4 | 8 | 16 | 24 | 32;
type SpacingProp = 'p' | 'px' | 'py' | 'pt' | 'pb' | 'pl' | 'pr'
                | 'm' | 'mx' | 'my' | 'mt' | 'mb' | 'ml' | 'mr';

type TailwindSpacing = \`\${SpacingProp}-\${SpacingScale}\`;
// "p-0" | "p-1" | "p-2" | ... | "mr-32" (nhiều variants)

// API endpoint builder
type ApiVersion = 'v1' | 'v2';
type ResourceName = 'users' | 'posts' | 'comments';
type ApiEndpoint = \`/api/\${ApiVersion}/\${ResourceName}\`;
// "/api/v1/users" | "/api/v1/posts" | "/api/v2/users" | ...

// i18n keys type-safe
type Locale = 'en' | 'vi' | 'ja';
type TranslationKey = \`\${string}.\${string}\`; // "nav.home" | "auth.login" | ...

function t(key: TranslationKey): string {
  return translations[key] ?? key;
}

t('nav.home');    // OK
t('auth.login');  // OK
// t('invalid');  // Error — không có dấu .`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson08({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="kd-08"
      num="08"
      title="Template Literal Types"
      desc="Tạo string types từ template — Capitalize, pattern matching, và type-safe strings"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Template Literal Types (TS 4.1+)">
        <Concept>
          <p>
            <strong>Template Literal Types</strong> cho phép tạo string types bằng cách kết hợp các
            string types khác — giống template literals trong JavaScript nhưng ở type level. Kết hợp
            với union types, tạo ra tất cả tổ hợp có thể.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Cơ bản', code: TL_BASIC },
            { label: 'Capitalize & Getters', code: TL_CAPITALIZE },
            { label: 'infer & parsing', code: TL_PARSING },
            { label: 'Thực tế', code: TL_PRACTICAL },
          ]}
        />
      </Sec>

      <Sec title="Intrinsic string types">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Input</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Uppercase<S>', '"hello"', '"HELLO"'],
              ['Lowercase<S>', '"HELLO"', '"hello"'],
              ['Capitalize<S>', '"hello"', '"Hello"'],
              ['Uncapitalize<S>', '"Hello"', '"hello"'],
            ].map(([type, input, output]) => (
              <tr key={type}>
                <td>
                  <code>{type}</code>
                </td>
                <td>
                  <code>{input}</code>
                </td>
                <td>
                  <code>{output}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Union × union tạo ra tổ hợp:</strong> Khi dùng{' '}
          <code className="ic">{'`${A | B}-${C | D}`'}</code>, TypeScript tự tạo tất cả tổ hợp:{' '}
          <code className="ic">"A-C" | "A-D" | "B-C" | "B-D"</code>. Rất hữu ích cho Tailwind
          classes, CSS properties, API routes. Nhưng cẩn thận với số lượng tổ hợp quá lớn.
        </Callout>
        <Callout type="warn">
          <strong>string & K để tránh symbol:</strong> Khi dùng{' '}
          <code className="ic">Capitalize&lt;K&gt;</code> trong mapped types, K có thể là{' '}
          <code className="ic">string | symbol</code>. Dùng <code className="ic">string & K</code>{' '}
          để lọc bỏ symbol và đảm bảo chỉ string mới được Capitalize.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: "Tạo type EventName<T extends string> = `on${Capitalize<T>}`. Dùng nó để tạo React-style event props: EventName<'click'> = 'onClick', EventName<'change'> = 'onChange'.",
            },
            {
              level: 'medium',
              text: 'Tạo type Getters<T> và Setters<T> dùng template literal types và mapped types. Test với User = { id: number; name: string } để verify output.',
            },
            {
              level: 'hard',
              text: "Implement type-safe CSS class builder: type TailwindClass = `${'text' | 'bg' | 'border'}-${'red' | 'green' | 'blue'}-${100 | 200 | 500}`. Đếm số variants (hint: 3×3×3 = 27).",
            },
          ]}
          hint="EventName: `on${Capitalize<T>}`. Getters: [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]. TailwindClass: mỗi union nhân với nhau tạo tổ hợp."
        />
      </Sec>
    </LessonCard>
  );
}
