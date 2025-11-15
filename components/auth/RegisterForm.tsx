// Registration form with API integration and role selection

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { AuthFormData } from '@/types';

interface RegisterFormData extends AuthFormData {
  name: string;
  confirmPassword: string;
  role: 'customer' | 'partner';
}

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      await register(formData.email, formData.password, formData.name, formData.role);
      router.push('/restaurants');
    } catch (error: any) {
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{apiError}</p>
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Yipeng Wang"
        required
        error={errors.name}
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="your@email.com"
        required
        error={errors.email}
      />

      <div className="mb-4">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
          Account Type <span className="text-red-500">*</span>
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="customer">Customer - Browse and order food</option>
          <option value="partner">Partner - Manage restaurants</option>
        </select>
      </div>

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="At least 6 characters"
        required
        error={errors.password}
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        required
        error={errors.confirmPassword}
      />

      <Button type="submit" variant="primary" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}