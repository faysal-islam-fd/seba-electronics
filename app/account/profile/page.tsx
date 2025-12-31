'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiCamera, FiEdit2, FiSave, FiX, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';
import { useConfirm } from '@/app/context/ConfirmContext';
import {
  useUpdateProfileMutation,
  useUpdateProfilePictureMutation,
  useDeleteProfilePictureMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from '@/app/store/api/authApi';

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { confirm } = useConfirm();

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'delete'>('profile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // API Mutations
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updatePicture, { isLoading: isUploadingPicture }] = useUpdateProfilePictureMutation();
  const [deletePicture, { isLoading: isDeletingPicture }] = useDeleteProfilePictureMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();



  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [deleteData, setDeleteData] = useState({
    password: '',
    confirmation: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone_number || '',
      });
    }
  }, [user]);

  const showMessage = (msg: string, isError = false) => {
    if (isError) {
      setError(msg);
      setSuccess(null);
    } else {
      setSuccess(msg);
      setError(null);
    }
    setTimeout(() => { setSuccess(null); setError(null); }, 4000);
  };

  // Update Profile
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateProfile({
        name: formData.name,
        email: formData.email,
      }).unwrap();

      if (result.success) {
        showMessage(result.message || 'Profile updated successfully!');
        setIsEditMode(false);
        await refreshUser();
      }
    } catch (err: any) {
      showMessage(err.data?.message || 'Failed to update profile', true);
    }
  };

  // Upload Profile Picture
  const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMessage('Please select an image file', true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage('Image size should be less than 5MB', true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profile_picture', file);

      const result = await updatePicture(formData).unwrap();
      if (result.success) {
        showMessage(result.message || 'Profile picture updated!');
        await refreshUser();
      }
    } catch (err: any) {
      showMessage(err.data?.message || 'Failed to upload picture', true);
    }
    e.target.value = '';
  };

  // Delete Profile Picture
  const handleDeletePicture = async () => {
    confirm(
      'Are you sure you want to remove your profile picture?',
      async () => {
        try {
          const result = await deletePicture().unwrap();
          if (result.success) {
            showMessage(result.message || 'Profile picture removed!');
            await refreshUser();
          }
        } catch (err: any) {
          showMessage(err.data?.message || 'Failed to delete picture', true);
        }
      },
      {
        type: 'warning',
        title: 'Remove Profile Picture',
        confirmText: 'Remove',
        cancelText: 'Cancel',
      }
    );
  };

  // Change Password
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.password !== passwordData.password_confirmation) {
      showMessage('Passwords do not match', true);
      return;
    }

    try {
      const result = await changePassword(passwordData).unwrap();
      if (result.success) {
        showMessage(result.message || 'Password changed successfully!');
        setPasswordData({ current_password: '', password: '', password_confirmation: '' });
      }
    } catch (err: any) {
      showMessage(err.data?.message || 'Failed to change password', true);
    }
  };

  // Delete Account
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (deleteData.confirmation !== 'DELETE') {
      showMessage('Please type DELETE to confirm', true);
      return;
    }

    try {
      const result = await deleteAccount(deleteData).unwrap();
      if (result.success) {
        router.push('/');
      }
    } catch (err: any) {
      showMessage(err.data?.message || 'Failed to delete account', true);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone_number || '',
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Please log in to view your profile</p>
      </div>
    );
  }

  const isLoading = isUpdating || isUploadingPicture || isDeletingPicture || isChangingPassword || isDeletingAccount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/account" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <FiArrowLeft size={20} />
          <span>Back to Account</span>
        </Link>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Profile Settings</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'profile', label: 'Profile Information' },
              { id: 'password', label: 'Change Password' },
              { id: 'delete', label: 'Delete Account' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setIsEditMode(false); }}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Messages */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </button>
                )}
              </div>

              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                    {user.profile_picture ? (
                      <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  {user.profile_picture && (
                    <button
                      onClick={handleDeletePicture}
                      disabled={isDeletingPicture}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
                    >
                      <FiX size={14} />
                    </button>
                  )}
                </div>
                <div>
                  <label className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 ${isUploadingPicture ? 'opacity-50' : ''}`}>
                    <FiCamera size={16} />
                    {isUploadingPicture ? 'Uploading...' : 'Change Picture'}
                    <input type="file" accept="image/*" onChange={handlePictureUpload} className="hidden" disabled={isUploadingPicture} />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF (max 5MB)</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditMode}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditMode}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.phone}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
                </div>

                {isEditMode && (
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <FiSave size={16} />
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      <FiX size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4">Change Password</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={passwordData.password_confirmation}
                    onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}

          {/* Statistics Tab */}


          {/* Delete Account Tab */}
          {activeTab === 'delete' && (
            <div className="max-w-xl">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <FiTrash2 size={20} />
                  Delete Account
                </h3>
                <p className="text-sm text-red-700">
                  This action is permanent and cannot be undone. All your data will be permanently deleted.
                </p>
              </div>

              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter Your Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={deleteData.password}
                      onChange={(e) => setDeleteData({ ...deleteData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="font-mono bg-gray-100 px-2 py-1 rounded">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteData.confirmation}
                    onChange={(e) => setDeleteData({ ...deleteData, confirmation: e.target.value })}
                    placeholder="DELETE"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isDeletingAccount}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeletingAccount ? 'Deleting...' : 'Delete My Account'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
