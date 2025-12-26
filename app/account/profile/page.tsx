'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiCamera, FiTrash2, FiX, FiEdit2, FiSave, FiXCircle } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateProfilePictureMutation,
  useDeleteProfilePictureMutation,
  useChangePasswordMutation,
  useGetProfileStatisticsQuery,
  useDeleteAccountMutation,
} from '@/app/store/api/authApi';

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'statistics' | 'delete'>('profile');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  // RTK Query hooks
  const { data: profileData, isLoading: profileLoading, refetch: refetchProfile } = useGetProfileQuery(undefined, {
    skip: !user, // Skip if no user
  });
  const { data: statisticsData, isLoading: statsLoading } = useGetProfileStatisticsQuery(undefined, {
    skip: activeTab !== 'statistics' || !user,
  });
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [updateProfilePicture, { isLoading: isUpdatingPicture }] = useUpdateProfilePictureMutation();
  const [deleteProfilePicture, { isLoading: isDeletingPicture }] = useDeleteProfilePictureMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();

  // Profile form
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    email: '',
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Delete account form
  const [deleteAccountData, setDeleteAccountData] = useState({
    password: '',
    confirmation: '',
  });

  // Update form data when profile data changes
  useEffect(() => {
    if (profileData?.data) {
      setProfileFormData({
        name: profileData.data.name || '',
        email: profileData.data.email || '',
      });
    } else if (user) {
      setProfileFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [profileData, user]);

  // Reset edit mode when switching tabs
  useEffect(() => {
    setIsEditMode(false);
  }, [activeTab]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setError(null);
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setErrors({});

    try {
      const result = await updateProfile(profileFormData).unwrap();
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setIsEditMode(false);
        await refetchProfile();
        await refreshUser();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      if (err.data?.errors) {
        setErrors(err.data.errors);
      } else if (err.data?.message) {
        setError(err.data.message);
      } else {
        setError(err.message || 'An error occurred');
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form data to original values
    if (profileData?.data) {
      setProfileFormData({
        name: profileData.data.name || '',
        email: profileData.data.email || '',
      });
    } else if (user) {
      setProfileFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
    setError(null);
    setErrors({});
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setErrors({});

    try {
      const result = await changePassword(passwordData).unwrap();
      
      if (result.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({
          current_password: '',
          password: '',
          password_confirmation: '',
        });
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      if (err.data?.errors) {
        setErrors(err.data.errors);
      } else if (err.data?.message) {
        setError(err.data.message);
      } else {
        setError(err.message || 'An error occurred');
      }
    }
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);

    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      
      const result = await updateProfilePicture(formData).unwrap();
      
      if (result.success) {
        setSuccess('Profile picture updated successfully!');
        await refetchProfile();
        await refreshUser();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      if (err.data?.message) {
        setError(err.data.message);
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      e.target.value = ''; // Reset input
    }
  };

  const handleDeletePicture = async () => {
    // Double check that profile picture exists before attempting deletion
    if (!currentUser.profile_picture || currentUser.profile_picture.trim() === '') {
      setError('No profile picture to delete');
      return;
    }

    if (!confirm('Are you sure you want to remove your profile picture?')) return;

    setError(null);
    setSuccess(null);

    try {
      const result = await deleteProfilePicture().unwrap();
      
      if (result.success) {
        setSuccess(result.message || 'Profile picture removed successfully!');
        await refetchProfile();
        await refreshUser();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      // Handle API error messages
      const errorMessage = err.data?.message || err.message || 'Failed to delete profile picture';
      setError(errorMessage);
      
      // If the error says no picture exists, refresh profile to sync state
      if (errorMessage.toLowerCase().includes('no profile picture')) {
        await refetchProfile();
        await refreshUser();
      }
    }
  };

  const handleDeleteAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setErrors({});

    if (deleteAccountData.confirmation !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    try {
      const result = await deleteAccount(deleteAccountData).unwrap();
      
      if (result.success) {
        // Logout and redirect
        await refreshUser();
        router.push('/');
        // Clear auth
        const { removeAuthToken } = await import('@/app/lib/authApi');
        removeAuthToken();
      }
    } catch (err: any) {
      if (err.data?.errors) {
        setErrors(err.data.errors);
      } else if (err.data?.message) {
        setError(err.data.message);
      } else {
        setError(err.message || 'An error occurred');
      }
    }
  };

  const isLoading = isUpdatingProfile || isUpdatingPicture || isDeletingPicture || isChangingPassword || isDeletingAccount;

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const currentUser = profileData?.data || user;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft size={20} />
            <span>Back to Account</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'profile', label: 'Profile Information' },
                { id: 'password', label: 'Change Password' },
                { id: 'statistics', label: 'Statistics' },
                { id: 'delete', label: 'Delete Account' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Header with Edit Button */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  {!isEditMode && (
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiEdit2 size={18} />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {currentUser.profile_picture && 
                       currentUser.profile_picture.trim() !== '' && 
                       currentUser.profile_picture !== null ? (
                        <img
                          src={currentUser.profile_picture}
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // If image fails to load, hide it and show initials
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-3xl text-gray-400">
                          {currentUser.name?.charAt(0).toUpperCase() || currentUser.email.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {currentUser.profile_picture && 
                     currentUser.profile_picture.trim() !== '' && 
                     currentUser.profile_picture !== null && (
                      <button
                        onClick={handleDeletePicture}
                        disabled={isDeletingPicture || isLoading}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 disabled:opacity-50 transition-colors"
                        title="Delete profile picture"
                      >
                        <FiX size={16} />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-50 transition-colors">
                      <FiCamera size={18} />
                      <span>Change Picture</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureChange}
                        className="hidden"
                        disabled={isUpdatingPicture || isLoading}
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF (max 5MB)</p>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" size={20} />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={profileFormData.name}
                        onChange={handleProfileChange}
                        required
                        disabled={!isEditMode}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" size={20} />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={profileFormData.email}
                        onChange={handleProfileChange}
                        required
                        disabled={!isEditMode}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Phone Number</p>
                    <p className="text-gray-900 font-medium">{currentUser.phone_number}</p>
                    <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
                  </div>

                  {isEditMode && (
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isUpdatingProfile || isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
                      >
                        {isUpdatingProfile ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <FiSave size={18} />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isUpdatingProfile || isLoading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-semibold rounded-lg transition-colors"
                      >
                        <FiXCircle size={18} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <div>
                  <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" size={20} />
                    </div>
                    <input
                      id="current_password"
                      name="current_password"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      required
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                        errors.current_password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.current_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.current_password[0]}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" size={20} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.password}
                      onChange={handlePasswordChange}
                      required
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" size={20} />
                    </div>
                    <input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.password_confirmation}
                      onChange={handlePasswordChange}
                      required
                      className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                        errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600">{errors.password_confirmation[0]}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword || isLoading}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {isChangingPassword ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Changing Password...
                    </div>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </form>
            )}

            {/* Statistics Tab */}
            {activeTab === 'statistics' && (
              <div className="space-y-6">
                {statsLoading ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading statistics...</p>
                  </div>
                ) : statisticsData?.data ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <p className="text-sm text-blue-600 font-medium mb-1">Total Orders</p>
                      <p className="text-3xl font-bold text-blue-900">{statisticsData.data.total_orders || 0}</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <p className="text-sm text-green-600 font-medium mb-1">Completed Orders</p>
                      <p className="text-3xl font-bold text-green-900">{statisticsData.data.completed_orders || 0}</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <p className="text-sm text-yellow-600 font-medium mb-1">Pending Orders</p>
                      <p className="text-3xl font-bold text-yellow-900">{statisticsData.data.pending_orders || 0}</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <p className="text-sm text-red-600 font-medium mb-1">Cancelled Orders</p>
                      <p className="text-3xl font-bold text-red-900">{statisticsData.data.cancelled_orders || 0}</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 md:col-span-2">
                      <p className="text-sm text-purple-600 font-medium mb-1">Total Spent</p>
                      <p className="text-3xl font-bold text-purple-900">৳ {(statisticsData.data.total_spent || 0).toLocaleString('en-BD')}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <p className="text-sm text-gray-600 font-medium mb-1">Member Since</p>
                      <p className="text-xl font-bold text-gray-900">
                        {statisticsData.data.member_since 
                          ? new Date(statisticsData.data.member_since).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                    {statisticsData.data.last_order_date && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <p className="text-sm text-gray-600 font-medium mb-1">Last Order</p>
                        <p className="text-xl font-bold text-gray-900">{new Date(statisticsData.data.last_order_date).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No statistics available</p>
                  </div>
                )}
              </div>
            )}

            {/* Delete Account Tab */}
            {activeTab === 'delete' && (
              <div className="space-y-6 max-w-2xl">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Delete Account</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be certain. This action will permanently delete your account and all associated data.
                  </p>
                </div>

                <form onSubmit={handleDeleteAccountSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="delete_password" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Your Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" size={20} />
                      </div>
                      <input
                        id="delete_password"
                        name="password"
                        type="password"
                        value={deleteAccountData.password}
                        onChange={(e) => setDeleteAccountData(prev => ({ ...prev, password: e.target.value }))}
                        required
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="delete_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="font-mono bg-gray-100 px-2 py-1 rounded">DELETE</span> to confirm
                    </label>
                    <input
                      id="delete_confirmation"
                      name="confirmation"
                      type="text"
                      value={deleteAccountData.confirmation}
                      onChange={(e) => setDeleteAccountData(prev => ({ ...prev, confirmation: e.target.value }))}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 ${
                        errors.confirmation ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="DELETE"
                    />
                    {errors.confirmation && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmation[0]}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isDeletingAccount || isLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition-colors"
                  >
                    {isDeletingAccount ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Deleting Account...
                      </div>
                    ) : (
                      'Delete My Account'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



