// User profile management page

'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { mockUserProfile } from '@/lib/mockData';
import { UserProfile } from '@/types';

export default function ProfilePage() {
  const [formData, setFormData] = useState<UserProfile>(mockUserProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call for Phase 1
    setTimeout(() => {
      console.log('Profile updated:', formData);
      setIsLoading(false);
      setSuccessMessage('Profile updated successfully!');
      // In Phase 2, this will call: await fetch('/api/profile', ...)
    }, 1000);
  };

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

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Please enter your full name"
                required
              />

              <Input
                label="Display Name"
                type="text"
                name="displayName"
                value={formData.displayName || ''}
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
                Your email address is used for login and notifications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="(123) 456-7890"
              />

              <div className="flex items-center">
                <div className="bg-orange-50 px-4 py-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Account Type</p>
                  <p className="text-lg font-semibold text-orange-600 capitalize">{formData.role}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <Input
                label="Address"
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                placeholder="Your street, City, Province, Postal Code"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Saving Changes...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setFormData(mockUserProfile)}
              >
                Reset
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Security</h2>
          <p className="text-gray-600 mb-6">
            Manage your password and security settings to keep your account secure.
          </p>
          <Button variant="secondary">Change Password</Button>
        </div>
      </div>
    </div>
  );
}