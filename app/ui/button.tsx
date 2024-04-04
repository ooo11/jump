import clsx from 'clsx';
import React from 'react'; // Ensure React is in scope since you're using JSX.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  const { disabled } = rest;

  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors',
        {
          'bg-blue-500 text-white hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600': !disabled,
          'bg-gray-400 text-white cursor-not-allowed opacity-50': disabled,
        },
        className,
      )}
    >
      {children}
    </button>
  );
}
