import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const BASICS = `// Template Literal Types — kết hợp string literal types
// Syntax: \`prefix\${Union}\` → tạo union của tất cả combinations

// Basic — interpolate type vào string
type Greeting = \`Hello, \${string}!\`;
const g1: Greeting = 'Hello, Alice!'; // OK
// const g2: Greeting = 'Hi, Alice!'; // Error — không match pattern

// Union expansion — cartesian product
type Direction = 'left' | 'right' | 'top' | 'bottom';
type CSSPadding = \`padding-\${Direction}\`;
// "padding-left" | "padding-right" | "padding-top" | "padding-bottom"

type Color = 'red' | 'green' | 'blue';
type Shade = 'light' | 'dark';
type ColorShade = \`\${Shade}-\${Color}\`;
// "light-red" | "light-green" | "light-blue" | "dark-red" | "dark-green" | "dark-blue"

// Number interpolation
type GridArea = \`\${number}fr\`;
const col: GridArea = '1fr'; // OK

// CSS value patterns
type CSSUnit = 'px' | 'em' | 'rem' | '%' | 'vw' | 'vh';
type CSSValue = \`\${number}\${CSSUnit}\`;
const size: CSSValue = '16px';  // OK
const size2: CSSValue = '1.5rem'; // OK
// const bad: CSSValue = '16vmin'; // Error`;

const INTRINSIC_STRINGS = `// Intrinsic string manipulation types (built-in TypeScript)
// Uppercase, Lowercase, Capitalize, Uncapitalize

type U = Uppercase<'hello world'>;     // "HELLO WORLD"
type L = Lowercase<'HELLO WORLD'>;     // "hello world"
type C = Capitalize<'hello world'>;    // "Hello world" (chỉ chữ đầu)
type UC = Uncapitalize<'HelloWorld'>;  // "helloWorld"

// Kết hợp với mapped types — generate API methods

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
type ApiMethod = Uppercase<HttpMethod>;
// "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

// Getters pattern với Capitalize
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type UserGetters = Getters<{ name: string; age: number; email: string }>;
// { getName: () => string; getAge: () => number; getEmail: () => string }

// Event handler naming
type EventName<T extends string> = \`on\${Capitalize<T>}\`;
type Events = 'click' | 'focus' | 'blur' | 'change';
type EventHandlerKeys = EventName<Events>;
// "onClick" | "onFocus" | "onBlur" | "onChange"

// camelCase to snake_case (simplified — chỉ handle simple cases)
type CamelToSnake<S extends string> =
  S extends \`\${infer H}\${infer T}\`
    ? T extends Uncapitalize<T>
      ? \`\${Lowercase<H>}\${CamelToSnake<T>}\`
      : \`\${Lowercase<H>}_\${CamelToSnake<Uncapitalize<T>>}\`
    : S;

type SnakeCase = CamelToSnake<'helloWorldTest'>; // "hello_world_test"`;

const PARSING_STRINGS = `// Parse string types với conditional + infer

// Extract path segments — split by "/"
type Split<S extends string, D extends string> =
  S extends \`\${infer Head}\${D}\${infer Tail}\`
    ? [Head, ...Split<Tail, D>]
    : [S];

type Segments = Split<'users/123/posts', '/'>; // ["users", "123", "posts"]

// Extract path params — :param pattern
type ExtractParams<Path extends string> =
  Path extends \`\${string}:\${infer Param}/\${infer Rest}\`
    ? { [K in Param | keyof ExtractParams<Rest>]: string }
    : Path extends \`\${string}:\${infer Param}\`
    ? { [K in Param]: string }
    : Record<string, never>;

type UserRouteParams = ExtractParams<'/users/:userId/posts/:postId'>;
// { userId: string; postId: string }

// Parse query string type
type QueryString<T extends Record<string, string>> = {
  [K in keyof T]: \`\${K & string}=\${T[K]}\`;
}[keyof T];

// Route builder
type ApiRoute = \`/\${string}\`;
type VersionedRoute<V extends string, Path extends string> = \`/api/\${V}\${Path}\`;

type V1Route = VersionedRoute<'v1', '/users'>; // "/api/v1/users"
type V2Route = VersionedRoute<'v2', '/posts'>; // "/api/v2/posts"`;

const PRACTICAL_PATTERNS = `// Practical template literal patterns

// CSS class generation
type Size = 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'primary' | 'secondary' | 'danger';
type ButtonClass = \`btn-\${Variant}-\${Size}\` | \`btn-\${Variant}\`;

// Type-safe i18n keys
type Namespace = 'common' | 'auth' | 'dashboard';
type CommonKeys = 'title' | 'subtitle' | 'close' | 'confirm';
type AuthKeys = 'login' | 'logout' | 'register' | 'forgotPassword';
type I18nKey<N extends Namespace> =
  N extends 'common' ? \`common:\${CommonKeys}\` :
  N extends 'auth'   ? \`auth:\${AuthKeys}\` :
  never;

type CommonI18n = I18nKey<'common'>; // "common:title" | "common:subtitle" | ...
type AuthI18n   = I18nKey<'auth'>;   // "auth:login" | "auth:logout" | ...

// Event system với template literals
type DOMEventMap = {
  click: MouseEvent;
  keydown: KeyboardEvent;
  focus: FocusEvent;
};

type NativeEvent<K extends string> = K extends keyof DOMEventMap
  ? DOMEventMap[K]
  : Event;

// Store action types
type Entity = 'user' | 'post' | 'comment';
type CrudAction = 'fetch' | 'create' | 'update' | 'delete';
type StoreAction = \`\${Uppercase<Entity>}_\${Uppercase<CrudAction>}\`;
// "USER_FETCH" | "USER_CREATE" | ... | "COMMENT_DELETE"`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson04({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="nc-04"
      num="04"
      title="Template Literal Types"
      desc="String unions, Capitalize/Uppercase, path params extraction, CSS/event patterns"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Template Literal Types">
        <Concept>
          <p>
            <strong>Template literal types</strong> (TypeScript 4.1+) cho phép tạo string literal
            types bằng cách interpolate types vào template strings. Kết hợp với intrinsic utilities
            (<code className="ic">Capitalize</code>, <code className="ic">Uppercase</code>) và{' '}
            <code className="ic">infer</code>, chúng cho phép{' '}
            <strong>parse và generate string types</strong> ở compile-time — từ route params đến CSS
            class names.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Cơ bản & Union expansion', code: BASICS },
            { label: 'Intrinsic string types', code: INTRINSIC_STRINGS },
            { label: 'Parsing string types', code: PARSING_STRINGS },
            { label: 'Practical patterns', code: PRACTICAL_PATTERNS },
          ]}
        />
      </Sec>

      <Sec title="Intrinsic string manipulation types">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Utility</th>
              <th>Input</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Uppercase<S>', '"hello world"', '"HELLO WORLD"'],
              ['Lowercase<S>', '"HELLO WORLD"', '"hello world"'],
              ['Capitalize<S>', '"hello world"', '"Hello world"'],
              ['Uncapitalize<S>', '"HelloWorld"', '"helloWorld"'],
            ].map(([util, input, output]) => (
              <tr key={util}>
                <td>
                  <code>{util}</code>
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
          <strong>Union expansion tạo cartesian product:</strong>{' '}
          <code className="ic">{'`${A | B}${C | D}`'}</code> tạo ra 4 strings: AC, AD, BC, BD. Với
          union lớn có thể tạo hàng trăm combinations — TypeScript có giới hạn về số union members.
        </Callout>
        <Callout type="warn">
          <strong>Template literal recursion có giới hạn:</strong> Parsing complex strings như{' '}
          <code className="ic">CamelToSnake</code> với recursion có thể gây{' '}
          <code className="ic">"excessively deep"</code> error. Giới hạn ở strings ngắn hoặc dùng
          depth counter.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Implement type EventHandlerProps<Events extends string> = { [K in Events as `on${Capitalize<K>}`]?: (e: Event) => void }. Test với type "click" | "focus" | "blur".',
            },
            {
              level: 'medium',
              text: 'Implement ExtractRouteParams<T extends string> — extract :param từ route string như "/users/:userId/posts/:postId" → { userId: string; postId: string }. Dùng infer + recursive conditional.',
            },
            {
              level: 'hard',
              text: 'Implement type-safe router: TypedRoute<Routes> với routes là Record<string, object>. Method navigate(route: keyof Routes, params: Routes[route]) phải type-check params tương ứng với route.',
            },
          ]}
          hint="EventHandlerProps: mapped type với as template literal. ExtractRouteParams: S extends `${string}:${infer P}/${infer Rest}` ? {[K in P | keyof ExtractRouteParams<Rest>]: string} : ..."
        />
      </Sec>
    </LessonCard>
  );
}
