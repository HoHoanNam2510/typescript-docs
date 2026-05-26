import CodeBlock from '../../components/CodeBlock';

const PROJECT_CODE = `// nangcao-project.ts — Project cuối Module 05
// Áp dụng: type guards, conditional types, mapped types, template literals,
//          branded types, satisfies, Result<T,E>, assertion functions

// ═══════════════════════════════════════════════════
// PART 1: Branded Types — Type-safe primitive values
// ═══════════════════════════════════════════════════

type Brand<T, B extends string> = T & { readonly __brand: B };

type Email     = Brand<string, 'Email'>;
type Username  = Brand<string, 'Username'>;
type PositiveInt = Brand<number, 'PositiveInt'>;
type Percentage  = Brand<number, 'Percentage'>;

// Validated constructors
function email(value: string): Email {
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(value))
    throw new Error(\`Invalid email: \${value}\`);
  return value as Email;
}

function username(value: string): Username {
  if (!/^[a-z][a-z0-9_]{2,19}$/.test(value))
    throw new Error(\`Invalid username: must be 3-20 lowercase chars/digits/underscores\`);
  return value as Username;
}

function positiveInt(n: number): PositiveInt {
  if (!Number.isInteger(n) || n <= 0)
    throw new Error(\`Expected positive integer, got \${n}\`);
  return n as PositiveInt;
}

// ═══════════════════════════════════════════════════
// PART 2: Result<T, E> — Railway-oriented error handling
// ═══════════════════════════════════════════════════

type Result<T, E extends Error = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

function err<E extends Error>(error: E): Result<never, E> {
  return { success: false, error };
}

async function tryCatch<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return ok(await fn());
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}

function mapResult<T, U, E extends Error>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> {
  return result.success ? ok(fn(result.data)) : result;
}

// ═══════════════════════════════════════════════════
// PART 3: Schema Validation — conditional + mapped types
// ═══════════════════════════════════════════════════

// Schema types — define validation rules
type SchemaType = 'string' | 'number' | 'boolean' | 'email' | 'positiveInt';

type FieldSchema = {
  type: SchemaType;
  required?: boolean;
  min?: number;
  max?: number;
  label?: string;
};

type Schema = Record<string, FieldSchema>;

// Infer TypeScript type from schema type
type InferPrimitive<S extends SchemaType> =
  S extends 'string'      ? string :
  S extends 'number'      ? number :
  S extends 'boolean'     ? boolean :
  S extends 'email'       ? Email :
  S extends 'positiveInt' ? PositiveInt :
  never;

// Infer full object type from schema
type InferSchema<S extends Schema> = {
  [K in keyof S]: S[K]['required'] extends true
    ? InferPrimitive<S[K]['type']>
    : InferPrimitive<S[K]['type']> | undefined;
};

// Validation error with field context
class ValidationError extends Error {
  constructor(
    public readonly field: string,
    message: string,
    public readonly code: string = 'VALIDATION_ERROR'
  ) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ═══════════════════════════════════════════════════
// PART 4: Template literal error messages
// ═══════════════════════════════════════════════════

type FieldError<F extends string> = \`\${F}: \${string}\`;
type SchemaErrors<S extends Schema> = {
  [K in keyof S as string]?: FieldError<K & string>;
};

function validateField(
  field: string,
  value: unknown,
  schema: FieldSchema
): string | null {
  if (value === undefined || value === null) {
    if (schema.required) return \`\${field}: is required\`;
    return null;
  }

  switch (schema.type) {
    case 'string':
      if (typeof value !== 'string') return \`\${field}: must be a string\`;
      if (schema.min !== undefined && value.length < schema.min)
        return \`\${field}: must be at least \${schema.min} characters\`;
      if (schema.max !== undefined && value.length > schema.max)
        return \`\${field}: must be at most \${schema.max} characters\`;
      return null;

    case 'number':
      if (typeof value !== 'number' || isNaN(value)) return \`\${field}: must be a number\`;
      if (schema.min !== undefined && value < schema.min)
        return \`\${field}: must be >= \${schema.min}\`;
      if (schema.max !== undefined && value > schema.max)
        return \`\${field}: must be <= \${schema.max}\`;
      return null;

    case 'boolean':
      if (typeof value !== 'boolean') return \`\${field}: must be a boolean\`;
      return null;

    case 'email':
      if (typeof value !== 'string' || !/^[^@]+@[^@]+\.[^@]+$/.test(value))
        return \`\${field}: must be a valid email address\`;
      return null;

    case 'positiveInt':
      if (!Number.isInteger(value) || (value as number) <= 0)
        return \`\${field}: must be a positive integer\`;
      return null;

    default:
      return null;
  }
}

// ═══════════════════════════════════════════════════
// PART 5: Validate function — returns Result<InferSchema<S>>
// ═══════════════════════════════════════════════════

function validate<S extends Schema>(
  schema: S,
  data: Record<string, unknown>
): Result<InferSchema<S>, ValidationError> {
  const errors: string[] = [];

  for (const [field, fieldSchema] of Object.entries(schema)) {
    const value = data[field];
    const error = validateField(field, value, fieldSchema);
    if (error) errors.push(error);
  }

  if (errors.length > 0) {
    return err(new ValidationError('form', errors.join('; ')));
  }

  return ok(data as unknown as InferSchema<S>);
}

// ═══════════════════════════════════════════════════
// PART 6: Type guards for validated results
// ═══════════════════════════════════════════════════

function isValidationError(e: unknown): e is ValidationError {
  return e instanceof ValidationError;
}

function assertValid<T>(result: Result<T>): asserts result is { success: true; data: T } {
  if (!result.success) {
    throw result.error;
  }
}

// ═══════════════════════════════════════════════════
// Putting it all together — User registration
// ═══════════════════════════════════════════════════

const UserSchema = {
  username: { type: 'string', required: true, min: 3, max: 20 },
  email:    { type: 'email',  required: true },
  age:      { type: 'positiveInt', required: true },
  bio:      { type: 'string', required: false, max: 200 },
} as const satisfies Schema;

type UserInput = InferSchema<typeof UserSchema>;
// {
//   username: string;
//   email: Email;
//   age: PositiveInt;
//   bio: string | undefined;
// }

// Validate + use result
const input: Record<string, unknown> = {
  username: 'alice_dev',
  email: 'alice@example.com',
  age: 25,
};

const result = validate(UserSchema, input);

if (result.success) {
  const user = result.data; // TypeScript biết đây là UserInput
  console.log(\`Welcome, \${user.username}!\`);
  console.log(\`Email: \${user.email}\`);
  // user.age là PositiveInt — branded, an toàn
} else {
  if (isValidationError(result.error)) {
    console.error('Validation failed:', result.error.message);
  }
}

// mapResult — transform validated data
const nameResult = mapResult(result, u => u.username.toUpperCase());
console.log(nameResult); // { success: true, data: "ALICE_DEV" }`;

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
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>Cuối Module 05</span>
      </div>

      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
        nangcao-project.ts — Type-Safe Schema Validation Library
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Kết hợp toàn bộ kiến thức Module 05: <strong>Branded types</strong> (Email, Username,
        PositiveInt) cho nominal typing, <strong>Result&lt;T,E&gt;</strong> cho railway-oriented
        error handling, <strong>conditional + mapped types</strong> để infer TypeScript type từ
        schema definition, <strong>template literal types</strong> cho typed error messages, và{' '}
        <strong>type guards + assertion functions</strong> để narrow và assert kết quả.
      </p>

      <CodeBlock code={PROJECT_CODE} />

      <div style={{ marginTop: '1rem', fontSize: 12, color: 'var(--text3)' }}>
        Checklist tự review: <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span>{' '}
        <code className="ic">Brand&lt;T,B&gt;</code> — Email, Username, PositiveInt với factory
        functions có validation <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span>{' '}
        <code className="ic">Result&lt;T,E&gt;</code> — ok/err helpers, tryCatch, mapResult <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span>{' '}
        <code className="ic">InferSchema&lt;S&gt;</code> — conditional + mapped types derive type từ
        schema <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span>{' '}
        <code className="ic">as const satisfies Schema</code> — literal types + type check <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> <code className="ic">tsc --noEmit</code>{' '}
        không lỗi
      </div>
    </div>
  );
}
