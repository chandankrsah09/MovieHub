'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Film, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      setError('');
      await registerUser(data.name, data.email, data.password);
      toast.success('Registration successful! Welcome to MovieHub!');
      router.push('/');
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err) || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl">
            <Film className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Join MovieHub
        </h2>
        <p className="text-center text-lg text-gray-600 mb-8">
          Start your movie rating journey today
        </p>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="animate-slide-up">
          <CardHeader>
            <h3 className="text-2xl font-bold text-center text-gray-900">Create Account</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-bounce-in">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              <Input
                label="Full name"
                type="text"
                autoComplete="name"
                error={errors.name?.message}
                placeholder="Enter your full name"
                {...register('name')}
              />

              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                placeholder="Enter your email"
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                error={errors.password?.message}
                placeholder="Create a password"
                {...register('password')}
              />

              <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                placeholder="Confirm your password"
                {...register('confirmPassword')}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
                disabled={loading}
                icon={<User className="h-5 w-5" />}
              >
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
