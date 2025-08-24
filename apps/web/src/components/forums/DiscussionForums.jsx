import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Pin, Lock, Eye, Clock, User, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function DiscussionForums() {
  const [forums, setForums] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);
  const [showNewReplyForm, setShowNewReplyForm] = useState(false);
  const [newTopicData, setNewTopicData] = useState({ title: '', content: '' });
  const [newReplyData, setNewReplyData] = useState({ content: '' });

  useEffect(() => {
    checkUser();
    loadForums();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
    }
  };

  const loadForums = async () => {
    try {
      const { data, error } = await supabase
        .from('discussion_forums')
        .select('*')
        .eq('is_active', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setForums(data || []);
    } catch (error) {
      console.error('Error loading forums:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (forumId) => {
    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          author:user_profiles(full_name, email),
          replies:forum_replies(count)
        `)
        .eq('forum_id', forumId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error loading topics:', error);
    }
  };

  const loadTopicReplies = async (topicId) => {
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .select(`
          *,
          author:user_profiles(full_name, email)
        `)
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading replies:', error);
      return [];
    }
  };

  const handleForumSelect = async (forum) => {
    setSelectedForum(forum);
    setSelectedTopic(null);
    await loadTopics(forum.id);
  };

  const handleTopicSelect = async (topic) => {
    setSelectedTopic(topic);
    const replies = await loadTopicReplies(topic.id);
    setSelectedTopic({ ...topic, replies });
  };

  const handleNewTopic = async (e) => {
    e.preventDefault();
    if (!user || !selectedForum) return;

    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .insert({
          forum_id: selectedForum.id,
          title: newTopicData.title,
          content: newTopicData.content,
          author_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setNewTopicData({ title: '', content: '' });
      setShowNewTopicForm(false);
      await loadTopics(selectedForum.id);
    } catch (error) {
      console.error('Error creating topic:', error);
    }
  };

  const handleNewReply = async (e) => {
    e.preventDefault();
    if (!user || !selectedTopic) return;

    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .insert({
          topic_id: selectedTopic.id,
          content: newReplyData.content,
          author_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setNewReplyData({ content: '' });
      setShowNewReplyForm(false);
      const replies = await loadTopicReplies(selectedTopic.id);
      setSelectedTopic({ ...selectedTopic, replies });
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06b6d4]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discussion Forums</h1>
        <p className="text-gray-600">Connect with fellow learners and teachers in our vibrant community</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Forums Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Forums</h2>
            <div className="space-y-2">
              {forums.map((forum) => (
                <button
                  key={forum.id}
                  onClick={() => handleForumSelect(forum)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedForum?.id === forum.id
                      ? 'bg-[#06b6d4] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {forum.is_pinned && <Pin className="w-4 h-4" />}
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">{forum.title}</span>
                  </div>
                  {forum.description && (
                    <p className="text-sm mt-1 opacity-80">{forum.description}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topics and Content */}
        <div className="lg:col-span-3">
          {selectedForum && !selectedTopic ? (
            <div className="bg-white rounded-lg shadow-md">
              {/* Forum Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedForum.title}</h2>
                    {selectedForum.description && (
                      <p className="text-gray-600 mt-1">{selectedForum.description}</p>
                    )}
                  </div>
                  {user && (
                    <button
                      onClick={() => setShowNewTopicForm(true)}
                      className="bg-[#06b6d4] hover:bg-[#0891b2] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      New Topic
                    </button>
                  )}
                </div>
              </div>

              {/* Search */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Topics List */}
              <div className="divide-y divide-gray-200">
                {filteredTopics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => handleTopicSelect(topic)}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {topic.is_pinned && <Pin className="w-4 h-4 text-yellow-500" />}
                          {topic.is_locked && <Lock className="w-4 h-4 text-red-500" />}
                          <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
                        </div>
                        <p className="text-gray-600 line-clamp-2">{topic.content}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {topic.author?.full_name || 'Anonymous'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(topic.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {topic.replies?.[0]?.count || 0} replies
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {topic.view_count} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedTopic ? (
            <div className="bg-white rounded-lg shadow-md">
              {/* Topic Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="text-[#06b6d4] hover:text-[#0891b2] font-medium"
                  >
                    ← Back to Topics
                  </button>
                  {user && (
                    <button
                      onClick={() => setShowNewReplyForm(true)}
                      className="bg-[#06b6d4] hover:bg-[#0891b2] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Reply
                    </button>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTopic.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>By {selectedTopic.author?.full_name || 'Anonymous'}</span>
                  <span>{new Date(selectedTopic.created_at).toLocaleDateString()}</span>
                  <span>{selectedTopic.view_count} views</span>
                </div>
              </div>

              {/* Topic Content */}
              <div className="p-6 border-b border-gray-200">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTopic.content}</p>
                </div>
              </div>

              {/* Replies */}
              <div className="divide-y divide-gray-200">
                {selectedTopic.replies?.map((reply) => (
                  <div key={reply.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#06b6d4] rounded-full flex items-center justify-center text-white font-semibold">
                        {reply.author?.full_name?.charAt(0) || 'A'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {reply.author?.full_name || 'Anonymous'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(reply.created_at).toLocaleDateString()}
                          </span>
                          {reply.is_solution && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Solution
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Forum</h3>
              <p className="text-gray-600">Choose a forum from the sidebar to start exploring topics</p>
            </div>
          )}
        </div>
      </div>

      {/* New Topic Modal */}
      {showNewTopicForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-xl font-semibold mb-4">Create New Topic</h3>
            <form onSubmit={handleNewTopic}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newTopicData.title}
                  onChange={(e) => setNewTopicData({ ...newTopicData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={newTopicData.content}
                  onChange={(e) => setNewTopicData({ ...newTopicData, content: e.target.value })}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewTopicForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#06b6d4] text-white rounded-lg hover:bg-[#0891b2]"
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Reply Modal */}
      {showNewReplyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-xl font-semibold mb-4">Add Reply</h3>
            <form onSubmit={handleNewReply}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reply</label>
                <textarea
                  value={newReplyData.content}
                  onChange={(e) => setNewReplyData({ content: e.target.value })}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewReplyForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#06b6d4] text-white rounded-lg hover:bg-[#0891b2]"
                >
                  Post Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
