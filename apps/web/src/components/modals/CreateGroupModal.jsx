import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Users, Globe, Lock } from 'lucide-react';

export default function CreateGroupModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    learning_level: 'beginner',
    is_public: true,
    max_members: 25
  });
  const [errors, setErrors] = useState({});
  
  const queryClient = useQueryClient();

  const createGroupMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create group');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboardData']);
      queryClient.invalidateQueries(['groups']);
      onClose();
      setFormData({
        name: '',
        description: '',
        learning_level: 'beginner',
        is_public: true,
        max_members: 25
      });
      setErrors({});
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Group name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.max_members < 5) newErrors.max_members = 'Minimum 5 members required';
    if (formData.max_members > 100) newErrors.max_members = 'Maximum 100 members allowed';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createGroupMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Create Study Group</h2>
            <button
              onClick={onClose}
              className="text-[#cbd5e1] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                Group Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#334155] border border-[#475569] rounded-lg px-3 py-2 text-white placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#06b6d4]"
                placeholder="Enter group name"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-[#334155] border border-[#475569] rounded-lg px-3 py-2 text-white placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#06b6d4]"
                placeholder="Describe your study group"
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                Learning Level
              </label>
              <select
                name="learning_level"
                value={formData.learning_level}
                onChange={handleChange}
                className="w-full bg-[#334155] border border-[#475569] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#06b6d4]"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                Maximum Members
              </label>
              <input
                type="number"
                name="max_members"
                value={formData.max_members}
                onChange={handleChange}
                min="5"
                max="100"
                className="w-full bg-[#334155] border border-[#475569] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#06b6d4]"
              />
              {errors.max_members && <p className="text-red-400 text-sm mt-1">{errors.max_members}</p>}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_public"
                id="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="w-4 h-4 text-[#06b6d4] bg-[#334155] border-[#475569] rounded focus:ring-[#06b6d4]"
              />
              <label htmlFor="is_public" className="flex items-center gap-2 text-sm text-[#cbd5e1]">
                {formData.is_public ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {formData.is_public ? 'Public Group' : 'Private Group'}
              </label>
            </div>

            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[#334155] text-white py-2 rounded-lg hover:bg-[#475569] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createGroupMutation.isPending}
                className="flex-1 bg-[#10b981] text-white py-2 rounded-lg hover:bg-[#059669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {createGroupMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    Create Group
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}