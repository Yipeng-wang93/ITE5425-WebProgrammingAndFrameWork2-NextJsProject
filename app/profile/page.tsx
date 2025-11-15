// User profile management page with API integration

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    displayName: '',
    phone: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }

    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        displayName: user.displayName || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          displayName: formData.displayName,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccessMessage('Profile updated successfully!');
      await refreshUser();
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Yipeng Wang"
                required
              />

              <Input
                label="Display Name"
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Username or nickname"
              />
            </div>

            <div className="mb-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Email address cannot be changed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(416) 123-4567"
              />

              <div className="flex items-center">
                <div className="bg-orange-50 px-4 py-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Account Type</p>
                  <p className="text-lg font-semibold text-orange-600 capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <Input
                label="Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123567 Yipeng Test Street, Toronto, ON"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Saving Changes...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (user) {
                    setFormData({
                      name: user.name || '',
                      email: user.email || '',
                      displayName: user.displayName || '',
                      phone: user.phone || '',
                      address: user.address || '',
                    });
                  }
                  setSuccessMessage('');
                  setErrorMessage('');
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}