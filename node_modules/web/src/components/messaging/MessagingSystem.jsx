import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Users, Phone, Video, MoreVertical, Search, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function MessagingSystem() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatType, setChatType] = useState('direct'); // direct, group, support
  const messagesEndRef = useRef(null);

  useEffect(() => {
    checkUser();
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
    }
  };

  const loadConversations = async () => {
    if (!user) return;

    try {
      // Load direct message conversations
      const { data: directMessages, error: dmError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:user_profiles!messages_sender_id_fkey(full_name, email),
          receiver:user_profiles!messages_receiver_id_fkey(full_name, email)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (dmError) throw dmError;

      // Load group chat conversations
      const { data: groupMemberships, error: gmError } = await supabase
        .from('group_memberships')
        .select(`
          *,
          group:study_groups(name, description)
        `)
        .eq('user_id', user.id);

      if (gmError) throw gmError;

      // Load live chat sessions
      const { data: liveChats, error: lcError } = await supabase
        .from('live_chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (lcError) throw lcError;

      // Combine all conversations
      const allConversations = [
        ...directMessages.map(msg => ({
          id: `dm_${msg.id}`,
          type: 'direct',
          title: msg.sender_id === user.id ? msg.receiver.full_name : msg.sender.full_name,
          lastMessage: msg.content,
          timestamp: msg.created_at,
          unread: msg.receiver_id === user.id && !msg.is_read,
          data: msg
        })),
        ...groupMemberships.map(membership => ({
          id: `group_${membership.group_id}`,
          type: 'group',
          title: membership.group.name,
          lastMessage: 'Group chat',
          timestamp: membership.joined_at,
          unread: false,
          data: membership
        })),
        ...liveChats.map(chat => ({
          id: `support_${chat.id}`,
          type: 'support',
          title: 'Live Support',
          lastMessage: `Status: ${chat.status}`,
          timestamp: chat.started_at,
          unread: false,
          data: chat
        }))
      ];

      setConversations(allConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversation) => {
    if (!conversation) return;

    try {
      let messagesData = [];

      if (conversation.type === 'direct') {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:user_profiles!messages_sender_id_fkey(full_name, email),
            receiver:user_profiles!messages_receiver_id_fkey(full_name, email)
          `)
          .or(`and(sender_id.eq.${conversation.data.sender_id},receiver_id.eq.${conversation.data.receiver_id}),and(sender_id.eq.${conversation.data.receiver_id},receiver_id.eq.${conversation.data.sender_id})`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        messagesData = data || [];
      } else if (conversation.type === 'group') {
        const { data, error } = await supabase
          .from('group_chat_messages')
          .select(`
            *,
            sender:user_profiles!group_chat_messages_sender_id_fkey(full_name, email)
          `)
          .eq('group_id', conversation.data.group_id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        messagesData = data || [];
      } else if (conversation.type === 'support') {
        const { data, error } = await supabase
          .from('live_chat_messages')
          .select(`
            *,
            sender:user_profiles!live_chat_messages_sender_id_fkey(full_name, email)
          `)
          .eq('session_id', conversation.data.id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        messagesData = data || [];
      }

      setMessages(messagesData);
      setSelectedConversation(conversation);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      let messageData = {};

      if (selectedConversation.type === 'direct') {
        const receiverId = selectedConversation.data.sender_id === user.id 
          ? selectedConversation.data.receiver_id 
          : selectedConversation.data.sender_id;

        const { data, error } = await supabase
          .from('messages')
          .insert({
            sender_id: user.id,
            receiver_id: receiverId,
            content: newMessage,
            message_type: 'text'
          })
          .select()
          .single();

        if (error) throw error;
        messageData = data;
      } else if (selectedConversation.type === 'group') {
        const { data, error } = await supabase
          .from('group_chat_messages')
          .insert({
            group_id: selectedConversation.data.group_id,
            sender_id: user.id,
            content: newMessage,
            message_type: 'text'
          })
          .select()
          .single();

        if (error) throw error;
        messageData = data;
      } else if (selectedConversation.type === 'support') {
        const { data, error } = await supabase
          .from('live_chat_messages')
          .insert({
            session_id: selectedConversation.data.id,
            sender_id: user.id,
            content: newMessage,
            message_type: 'text'
          })
          .select()
          .single();

        if (error) throw error;
        messageData = data;
      }

      // Add message to local state
      const newMessageObj = {
        ...messageData,
        sender: { full_name: user.user_metadata?.full_name || 'You', email: user.email }
      };

      setMessages(prev => [...prev, newMessageObj]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startNewConversation = async () => {
    if (!selectedUser || !user) return;

    try {
      // Check if conversation already exists
      const { data: existing, error: checkError } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.user_id}),and(sender_id.eq.${selectedUser.user_id},receiver_id.eq.${user.id})`)
        .limit(1);

      if (checkError) throw checkError;

      if (existing && existing.length > 0) {
        // Load existing conversation
        const conversation = {
          id: `dm_${existing[0].id}`,
          type: 'direct',
          title: selectedUser.full_name,
          lastMessage: 'Direct message',
          timestamp: existing[0].created_at,
          unread: false,
          data: existing[0]
        };
        await loadMessages(conversation);
      } else {
        // Create new conversation
        const { data, error } = await supabase
          .from('messages')
          .insert({
            sender_id: user.id,
            receiver_id: selectedUser.user_id,
            content: 'Hello! I\'d like to start a conversation.',
            message_type: 'text'
          })
          .select()
          .single();

        if (error) throw error;

        const conversation = {
          id: `dm_${data.id}`,
          type: 'direct',
          title: selectedUser.full_name,
          lastMessage: 'Hello! I\'d like to start a conversation.',
          timestamp: data.created_at,
          unread: false,
          data: data
        };

        setConversations(prev => [conversation, ...prev]);
        await loadMessages(conversation);
      }

      setShowNewConversation(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id, full_name, email, role')
        .neq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      setAvailableUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messaging Center</h1>
        <p className="text-gray-600">Stay connected with teachers, students, and study groups</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Conversations Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Conversations</h2>
                <button
                  onClick={() => {
                    setShowNewConversation(true);
                    loadAvailableUsers();
                  }}
                  className="p-2 text-[#06b6d4] hover:bg-gray-100 rounded-lg transition-colors"
                  title="New Conversation"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => loadMessages(conversation)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-[#06b6d4] text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      conversation.type === 'direct' ? 'bg-blue-100 text-blue-600' :
                      conversation.type === 'group' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {conversation.type === 'direct' ? <MessageCircle className="w-5 h-5" /> :
                       conversation.type === 'group' ? <Users className="w-5 h-5" /> :
                       <Phone className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">{conversation.title}</h3>
                        {conversation.unread && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm truncate ${
                        selectedConversation?.id === conversation.id ? 'opacity-80' : 'text-gray-500'
                      }`}>
                        {conversation.lastMessage}
                      </p>
                      <p className={`text-xs ${
                        selectedConversation?.id === conversation.id ? 'opacity-60' : 'text-gray-400'
                      }`}>
                        {new Date(conversation.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <div className="bg-white rounded-lg shadow-md h-96 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedConversation.type === 'direct' ? 'bg-blue-100 text-blue-600' :
                      selectedConversation.type === 'group' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {selectedConversation.type === 'direct' ? <MessageCircle className="w-5 h-5" /> :
                       selectedConversation.type === 'group' ? <Users className="w-5 h-5" /> :
                       <Phone className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConversation.title}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedConversation.type === 'direct' ? 'Direct Message' :
                         selectedConversation.type === 'group' ? 'Group Chat' : 'Live Support'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Video className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === user?.id
                        ? 'bg-[#06b6d4] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs opacity-75">
                          {message.sender?.full_name || 'Unknown'}
                        </span>
                        <span className="text-xs opacity-75">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-[#06b6d4] text-white rounded-lg hover:bg-[#0891b2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Conversation</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNewConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Start New Conversation</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
              <select
                value={selectedUser?.user_id || ''}
                onChange={(e) => {
                  const user = availableUsers.find(u => u.user_id === e.target.value);
                  setSelectedUser(user);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
              >
                <option value="">Choose a user...</option>
                {availableUsers.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.full_name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowNewConversation(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={startNewConversation}
                disabled={!selectedUser}
                className="px-4 py-2 bg-[#06b6d4] text-white rounded-lg hover:bg-[#0891b2] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
