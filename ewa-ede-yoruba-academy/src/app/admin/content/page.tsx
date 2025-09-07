'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ContentUpload from '@/components/admin/ContentUpload';
import BulkOperations from '@/components/admin/BulkOperations';
import { getCurrentUser } from '@/lib/auth-utils';
import { Upload, FileText, Image, Video, Archive, Search } from 'lucide-react';
import type { AuthUser } from '@/auth.config';

interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  category: string;
  uploadedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function ContentManagementPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<UploadedFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== 'ADMIN') {
          router.push('/auth/signin');
          return;
        }
        setUser(currentUser);
        await loadFiles();
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/auth/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const filterFiles = useCallback(() => {
    let filtered = files;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(file => file.category === selectedCategory);
    }

    setFilteredFiles(filtered);
  }, [files, searchTerm, selectedCategory]);

  useEffect(() => {
    filterFiles();
  }, [filterFiles]);

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/upload?limit=100');
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files || []);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const handleUploadComplete = () => {
    // Refresh the files list
    loadFiles();
    setShowUploadModal(false);
  };

  const handleBulkUpdate = (updatedFiles: unknown[]) => {
    setFiles(updatedFiles as UploadedFile[]);
  };

  const categories = [
    { value: 'all', label: 'All Files' },
    { value: 'content', label: 'Course Content' },
    { value: 'resources', label: 'Resources' },
    { value: 'avatars', label: 'User Avatars' },
    { value: 'certificates', label: 'Certificates' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4f46e5]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Content Management</h1>
            <p className="text-[#a1a1aa] mt-1">Upload and manage course materials and resources</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5]"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#a1a1aa]">Total Files</p>
                <p className="text-2xl font-bold text-white">{files.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Image className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#a1a1aa]">Images</p>
                <p className="text-2xl font-bold text-white">
                  {files.filter(f => f.mimeType.startsWith('image/')).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Video className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#a1a1aa]">Videos</p>
                <p className="text-2xl font-bold text-white">
                  {files.filter(f => f.mimeType.startsWith('video/')).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Archive className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-[#a1a1aa]">Documents</p>
                <p className="text-2xl font-bold text-white">
                  {files.filter(f => f.mimeType.includes('pdf') || f.mimeType.includes('document')).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#6b7280]" />
                </div>
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-[#374151] rounded-md bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                />
              </div>
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-[#374151] rounded-md bg-[#0f0f0f] text-white focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Operations */}
        <BulkOperations
          items={filteredFiles.map(file => ({
            id: file.id,
            title: file.originalName,
            type: file.category,
            status: 'active',
          }))}
          onItemsUpdate={handleBulkUpdate}
          itemType="files"
          availableOperations={['delete', 'archive', 'export']}
        />
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={() => setShowUploadModal(false)}></div>

            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Upload Content Files</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-[#a1a1aa] hover:text-white"
                >
                  <span className="sr-only">Close</span>
                  ×
                </button>
              </div>

              <ContentUpload
                onUploadComplete={handleUploadComplete}
                uploadPath="content"
              />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-[#374151] rounded-md shadow-sm text-sm font-medium text-[#a1a1aa] bg-[#0f0f0f] hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}