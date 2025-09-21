import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ className, children, hover = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl overflow-hidden',
        hover && 'card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('px-8 py-6', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('px-8 py-6 border-t border-gray-100 bg-gradient-to-r from-white to-gray-50', className)}
      {...props}
    >
      {children}
    </div>
  );
}
