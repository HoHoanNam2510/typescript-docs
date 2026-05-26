import { ReactNode } from 'react';

export function Sec({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '1rem',
          color: 'var(--text1)',
          paddingBottom: 8,
          borderBottom: '1px solid var(--border)',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Concept({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '1rem 1.25rem',
        marginBottom: '1rem',
        fontSize: 13,
        lineHeight: 1.7,
        color: 'var(--text2)',
      }}
    >
      {children}
    </div>
  );
}
