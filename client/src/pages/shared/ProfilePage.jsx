import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Save, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import GlassCard from '../../components/common/GlassCard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    profileImage: user?.profileImage || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      const res = await authAPI.updateProfile(profileForm);
      if (res.data?.data?.user) {
        updateUser(res.data.data.user);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    try {
      setPasswordLoading(true);
      await authAPI.changePassword(passwordForm);
      showToast('Password updated successfully!', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border-sky-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar src={user?.profileImage} name={user?.name} size="lg" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-slate-950 dark:text-white">{user?.name}</h1>
              {user?.isVerified && (
                <Badge variant="sky" size="sm">
                  Verified
                </Badge>
              )}
            </div>
            <span className="text-xs text-sky-700 dark:text-sky-300 font-bold uppercase tracking-wider mt-0.5">
              {user?.role} Workspace
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">{user?.email}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Details Form */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 sm:p-8">
            <h3 className="text-base font-serif font-bold text-slate-950 dark:text-white mb-6">
              Personal & Professional Profile
            </h3>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
              <Input
                label="Full Name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                icon={User}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Contact"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  icon={Phone}
                />
                <Input
                  label="Primary Studio / City Location"
                  placeholder="e.g. Manhattan, New York"
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  icon={MapPin}
                />
              </div>

              <Input
                label="Profile Picture URL"
                placeholder="https://images.unsplash.com/... or image link"
                value={profileForm.profileImage}
                onChange={(e) => setProfileForm({ ...profileForm, profileImage: e.target.value })}
              />

              <Textarea
                label="Bio & Architectural Focus"
                rows={3}
                placeholder="Tell clients and collaborators about your design expertise and portfolio focus..."
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              />

              <div className="flex justify-end pt-4 border-t border-sky-400/20">
                <Button type="submit" variant="primary" isLoading={profileLoading} icon={Save}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Security / Password Form */}
        <div>
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h3 className="text-base font-serif font-bold text-slate-950 dark:text-white">
                Account Security
              </h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                required
              />

              <Input
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Repeat new password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                required
              />

              <Button
                type="submit"
                variant="secondary"
                size="sm"
                isLoading={passwordLoading}
                className="mt-2 w-full"
              >
                Update Password
              </Button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
