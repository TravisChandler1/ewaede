'use client';

import { useState } from 'react';
import {
  CheckSquare,
  Square,
  Trash2,
  Edit,
  Download,
  Archive,
  Mail,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';

interface BulkOperationItem {
  id: string;
  title: string;
  type: string;
  status?: string;
  selected?: boolean;
}

interface BulkOperationsProps {
  items: BulkOperationItem[];
  onItemsUpdate: (items: BulkOperationItem[]) => void;
  itemType: 'courses' | 'lessons' | 'users' | 'files';
  availableOperations?: string[];
}

export default function BulkOperations({
  items,
  onItemsUpdate,
  itemType,
  availableOperations = ['delete', 'archive', 'export', 'email']
}: BulkOperationsProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const executeBulkOperation = async (operation: string) => {
    if (selectedItems.size === 0) return;

    setIsProcessing(true);

    try {
      const selectedIds = Array.from(selectedItems);

      const response = await fetch(`/api/admin/bulk/${operation}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          type: itemType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${operation} items`);
      }

      // Update local state
      const updatedItems = items.filter(item => !selectedIds.includes(item.id));
      onItemsUpdate(updatedItems);
      setSelectedItems(new Set());

      alert(`Successfully ${operation}d ${selectedIds.length} ${itemType}`);

    } catch (error) {
      console.error(`Bulk ${operation} error:`, error);
      alert(error instanceof Error ? error.message : `Failed to ${operation} items`);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportSelected = async () => {
    if (selectedItems.size === 0) return;

    try {
      const selectedIds = Array.from(selectedItems);
      const selectedData = items.filter(item => selectedIds.includes(item.id));

      // Create CSV content
      const headers = ['ID', 'Title', 'Type', 'Status'];
      const csvContent = [
        headers.join(','),
        ...selectedData.map(item => [
          item.id,
          `"${item.title}"`,
          item.type,
          item.status || ''
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${itemType}-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
  };

  const sendBulkEmail = async () => {
    if (selectedItems.size === 0) return;

    const subject = prompt('Enter email subject:');
    if (!subject) return;

    const message = prompt('Enter email message:');
    if (!message) return;

    setIsProcessing(true);

    try {
      const selectedIds = Array.from(selectedItems);

      const response = await fetch('/api/admin/bulk/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          type: itemType,
          subject,
          message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send emails');
      }

      alert(`Email sent to ${selectedIds.length} ${itemType}`);

    } catch (error) {
      console.error('Bulk email error:', error);
      alert(error instanceof Error ? error.message : 'Failed to send emails');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedItems.size > 0 && (
        <div className="bg-[#4f46e5]/10 border-b border-[#4f46e5]/20 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white font-medium">
                {selectedItems.size} {itemType} selected
              </span>

              <div className="flex items-center space-x-2">
                {availableOperations.includes('delete') && (
                  <button
                    onClick={() => executeBulkOperation('delete')}
                    disabled={isProcessing}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                )}

                {availableOperations.includes('archive') && (
                  <button
                    onClick={() => executeBulkOperation('archive')}
                    disabled={isProcessing}
                    className="inline-flex items-center px-3 py-1.5 border border-[#374151] text-sm font-medium rounded-md text-white bg-[#2a2a2a] hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5]"
                  >
                    <Archive className="h-4 w-4 mr-1" />
                    Archive
                  </button>
                )}

                {availableOperations.includes('export') && (
                  <button
                    onClick={exportSelected}
                    className="inline-flex items-center px-3 py-1.5 border border-[#374151] text-sm font-medium rounded-md text-white bg-[#2a2a2a] hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5]"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </button>
                )}

                {availableOperations.includes('email') && itemType === 'users' && (
                  <button
                    onClick={sendBulkEmail}
                    disabled={isProcessing}
                    className="inline-flex items-center px-3 py-1.5 border border-[#374151] text-sm font-medium rounded-md text-white bg-[#2a2a2a] hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] disabled:opacity-50"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedItems(new Set())}
              className="text-[#a1a1aa] hover:text-white text-sm"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Header with Select All */}
      <div className="px-4 py-3 border-b border-[#2a2a2a] bg-[#0f0f0f]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSelectAll}
              className="text-[#a1a1aa] hover:text-white"
            >
              {selectedItems.size === items.length && items.length > 0 ? (
                <CheckSquare className="h-5 w-5" />
              ) : (
                <Square className="h-5 w-5" />
              )}
            </button>
            <span className="text-sm text-[#a1a1aa]">
              {selectedItems.size === items.length && items.length > 0
                ? 'Deselect all'
                : 'Select all'
              }
            </span>
          </div>

          <div className="text-sm text-[#a1a1aa]">
            {items.length} {itemType}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-[#2a2a2a]">
        {items.map((item) => (
          <div
            key={item.id}
            className="px-4 py-3 hover:bg-[#2a2a2a]/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleSelectItem(item.id)}
                  className="text-[#a1a1aa] hover:text-white"
                >
                  {selectedItems.has(item.id) ? (
                    <CheckSquare className="h-5 w-5" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </button>

                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">{item.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#4f46e5]/20 text-[#4f46e5]">
                      {item.type}
                    </span>
                    {item.status && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        item.status === 'active' ? 'bg-green-900/30 text-green-400' :
                        item.status === 'inactive' ? 'bg-gray-900/30 text-gray-400' :
                        item.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-red-900/30 text-red-400'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="text-[#a1a1aa] hover:text-white p-1">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-[#a1a1aa] hover:text-white p-1">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="px-4 py-8 text-center">
          <AlertTriangle className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No {itemType} found</h3>
          <p className="text-[#a1a1aa]">There are no {itemType} to display.</p>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#2a2a2a]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4f46e5] mx-auto mb-4"></div>
            <p className="text-white text-center">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}