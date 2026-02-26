import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1">›</span>}
          {item.to ? (
            <Link to={item.to} className="hover:text-neon-cyan">{item.label}</Link>
          ) : (
            <span className="dark:text-gray-300">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
