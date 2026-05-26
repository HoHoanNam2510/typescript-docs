import CodeBlock from '../../components/CodeBlock';

const PROJECT_CODE = `// form-validator.ts — Project cuối Module 01
// Áp dụng: object types, union, discriminated union, tuple, enum, unknown

// 1. Type definitions — object types + union
type FieldType = 'text' | 'email' | 'number' | 'boolean';

type FieldRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
};

type FieldSchema = {
  type: FieldType;
  label: string;
  rules?: FieldRule;
};

type FormSchema = Record<string, FieldSchema>;

// 2. Discriminated union cho kết quả validation
type ValidationSuccess = {
  status: 'success';
  value: unknown;
};

type ValidationError = {
  status: 'error';
  field: string;
  message: string;
};

type ValidationResult = ValidationSuccess | ValidationError;

// 3. Tuple cho [isValid, errors]
type FormResult = [isValid: boolean, errors: ValidationError[]];

// 4. Core validator function
function validateField(
  fieldName: string,
  schema: FieldSchema,
  value: unknown
): ValidationResult {
  if (schema.rules?.required && !value) {
    return { status: 'error', field: fieldName, message: \`\${schema.label} là bắt buộc\` };
  }
  if (typeof value === 'string' && schema.rules) {
    const { minLength, maxLength, pattern } = schema.rules;
    if (minLength && value.length < minLength) {
      return { status: 'error', field: fieldName, message: \`\${schema.label} tối thiểu \${minLength} ký tự\` };
    }
    if (maxLength && value.length > maxLength) {
      return { status: 'error', field: fieldName, message: \`\${schema.label} tối đa \${maxLength} ký tự\` };
    }
    if (pattern && !pattern.test(value)) {
      return { status: 'error', field: fieldName, message: \`\${schema.label} không đúng định dạng\` };
    }
  }
  if (typeof value === 'number' && schema.rules) {
    const { min, max } = schema.rules;
    if (min !== undefined && value < min) {
      return { status: 'error', field: fieldName, message: \`\${schema.label} tối thiểu \${min}\` };
    }
    if (max !== undefined && value > max) {
      return { status: 'error', field: fieldName, message: \`\${schema.label} tối đa \${max}\` };
    }
  }
  return { status: 'success', value };
}

// 5. Validate toàn bộ form — trả về tuple
function validateForm(schema: FormSchema, data: Record<string, unknown>): FormResult {
  const errors: ValidationError[] = [];
  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    const result = validateField(fieldName, fieldSchema, data[fieldName]);
    if (result.status === 'error') {
      errors.push(result); // TypeScript tự narrow sang ValidationError
    }
  }
  return [errors.length === 0, errors];
}

// 6. Demo — đăng ký user
const registerSchema: FormSchema = {
  username: { type: 'text', label: 'Tên đăng nhập', rules: { required: true, minLength: 3, maxLength: 20 } },
  email:    { type: 'email', label: 'Email', rules: { required: true, pattern: /^[^@]+@[^@]+\\.[^@]+$/ } },
  age:      { type: 'number', label: 'Tuổi', rules: { required: true, min: 13, max: 120 } },
};

const [valid, errors] = validateForm(registerSchema, {
  username: 'Al',              // quá ngắn
  email: 'not-an-email',      // sai format
  age: 10,                    // dưới 13
});

console.log('Valid:', valid);   // false
errors.forEach(e => console.log(\`[\${e.field}] \${e.message}\`));
// [username] Tên đăng nhập tối thiểu 3 ký tự
// [email] Email không đúng định dạng
// [age] Tuổi tối thiểu 13`;

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
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>Cuối Module 01</span>
      </div>

      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
        form-validator.ts — Type-safe Form Validator
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Xây dựng module <code className="ic">form-validator.ts</code> kết hợp toàn bộ kiến thức
        Module 01: <strong>object types</strong> cho schema, <strong>discriminated union</strong>{' '}
        cho kết quả validation (<code className="ic">success | error</code>), <strong>tuple</strong>{' '}
        cho return value, <strong>union literals</strong> cho field types, và{' '}
        <strong>unknown</strong> cho data đầu vào.
      </p>

      <CodeBlock code={PROJECT_CODE} />

      <div style={{ marginTop: '1rem', fontSize: 12, color: 'var(--text3)' }}>
        Checklist tự review: <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> Không có <code className="ic">any</code> —
        dùng <code className="ic">unknown</code> cho external data <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> Discriminated union với{' '}
        <code className="ic">status</code> field <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> Tuple return type với named elements{' '}
        <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> <code className="ic">tsc --noEmit</code>{' '}
        không lỗi
      </div>
    </div>
  );
}
