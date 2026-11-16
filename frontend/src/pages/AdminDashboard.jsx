import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Plus,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  X,
  AlertTriangle,
  FileText,
  DollarSign,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context';
import {
  getAllUsers,
  deleteUser,
  getAllEbooks,
  publishEbook,
  getEbookDetails,
  deleteEbook,
} from '@/api/adminApi';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userPagination, setUserPagination] = useState({ totalPages: 1, totalUsers: 0 });

  // Ebooks state
  const [ebooks, setEbooks] = useState([]);
  const [ebooksLoading, setEbooksLoading] = useState(false);
  const [ebookSearch, setEbookSearch] = useState('');
  const [ebookPage, setEbookPage] = useState(1);
  const [ebookPagination, setEbookPagination] = useState({ totalPages: 1, totalEbooks: 0 });

  // Modals state
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: '', name: '' });
  const [detailsModal, setDetailsModal] = useState({ open: false, loading: false, data: null });
  const [publishModal, setPublishModal] = useState({ open: false, loading: false, error: '' });

  // Publish Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    category: 'eBook',
    fileType: 'pdf',
    isPublished: true,
  });

  // Direct File Upload state for MongoDB GridFS
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [digitalAssetFile, setDigitalAssetFile] = useState(null);

  // Action status message
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const showFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await getAllUsers({ page: userPage, limit: 10, search: userSearch });
      if (res.success) {
        setUsers(res.users);
        setUserPagination({
          totalPages: res.pagination?.totalPages || 1,
          totalUsers: res.pagination?.totalUsers || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      showFeedback(err.response?.data?.message || 'Failed to fetch users', 'error');
    } finally {
      setUsersLoading(false);
    }
  }, [userPage, userSearch]);

  // Fetch Ebooks
  const fetchEbooks = useCallback(async () => {
    setEbooksLoading(true);
    try {
      const res = await getAllEbooks({ page: ebookPage, limit: 10, search: ebookSearch });
      if (res.success) {
        setEbooks(res.ebooks);
        setEbookPagination({
          totalPages: res.pagination?.totalPages || 1,
          totalEbooks: res.pagination?.totalEbooks || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching ebooks:', err);
      showFeedback(err.response?.data?.message || 'Failed to fetch eBooks', 'error');
    } finally {
      setEbooksLoading(false);
    }
  }, [ebookPage, ebookSearch]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchEbooks();
    }
  }, [activeTab, fetchUsers, fetchEbooks]);

  // Handle Search submit
  const handleUserSearchSubmit = (e) => {
    e.preventDefault();
    setUserPage(1);
    fetchUsers();
  };

  const handleEbookSearchSubmit = (e) => {
    e.preventDefault();
    setEbookPage(1);
    fetchEbooks();
  };

  // Delete Action
  const confirmDelete = async () => {
    try {
      if (deleteModal.type === 'user') {
        const res = await deleteUser(deleteModal.id);
        if (res.success) {
          showFeedback('User deleted successfully');
          fetchUsers();
        }
      } else if (deleteModal.type === 'ebook') {
        const res = await deleteEbook(deleteModal.id);
        if (res.success) {
          showFeedback('eBook deleted successfully');
          fetchEbooks();
        }
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to delete item', 'error');
    } finally {
      setDeleteModal({ open: false, type: '', id: '', name: '' });
    }
  };

  // Details Action
  const handleViewDetails = async (idOrSlug) => {
    setDetailsModal({ open: true, loading: true, data: null });
    try {
      const res = await getEbookDetails(idOrSlug);
      if (res.success) {
        setDetailsModal({ open: true, loading: false, data: res.ebook });
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to fetch details', 'error');
      setDetailsModal({ open: false, loading: false, data: null });
    }
  };

  // Publish eBook Action
  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    setPublishModal((prev) => ({ ...prev, loading: true, error: '' }));

    if (!coverImageFile) {
      setPublishModal((prev) => ({ ...prev, loading: false, error: 'Please choose a cover image file.' }));
      return;
    }
    if (!digitalAssetFile) {
      setPublishModal((prev) => ({ ...prev, loading: false, error: 'Please choose a digital asset file (PDF, EPUB, or ZIP).' }));
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      if (formData.slug) data.append('slug', formData.slug);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('fileType', formData.fileType);
      data.append('isPublished', formData.isPublished);
      data.append('coverImage', coverImageFile);
      data.append('digitalFile', digitalAssetFile);

      const res = await publishEbook(data);
      if (res.success) {
        showFeedback('eBook published successfully into GridFS!');
        setPublishModal({ open: false, loading: false, error: '' });
        setFormData({
          title: '',
          slug: '',
          description: '',
          price: '',
          category: 'eBook',
          fileType: 'pdf',
          isPublished: true,
        });
        setCoverImageFile(null);
        setDigitalAssetFile(null);
        fetchEbooks();
      }
    } catch (err) {
      setPublishModal((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to publish eBook',
      }));
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-secondary/20">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary">
              <Shield className="w-6 h-6" />
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-white tracking-wider">
              Admin <span className="text-secondary">Dashboard</span>
            </h1>
          </div>
          <p className="font-body text-gray-400 text-sm">
            Signed in as <span className="text-white font-medium">{user?.email}</span> (Admin)
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm font-semibold transition-all ${activeTab === 'users'
                ? 'bg-secondary text-primary shadow-[0_0_15px_rgba(1,255,219,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Users</span>
          </button>
          <button
            onClick={() => setActiveTab('ebooks')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm font-semibold transition-all ${activeTab === 'ebooks'
                ? 'bg-secondary text-primary shadow-[0_0_15px_rgba(1,255,219,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Manage eBooks</span>
          </button>
        </div>
      </div>

      {/* Global alert feedback */}
      {feedback.message && (
        <div
          className={`mt-6 p-4 rounded-xl flex items-center justify-between border ${feedback.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-secondary/10 border-secondary/30 text-secondary'
            }`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback({ message: '', type: '' })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <form onSubmit={handleUserSearchSubmit} className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-secondary transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </form>
            <p className="font-body text-xs text-gray-400 self-end sm:self-center">
              Total Users: <span className="text-secondary font-semibold">{userPagination.totalUsers}</span>
            </p>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d0d0d]">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10 font-body">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-body">
                {usersLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((item) => (
                    <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold text-xs">
                          {item.name ? item.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span>{item.name}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{item.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.role === 'admin'
                              ? 'bg-secondary/15 text-secondary border border-secondary/30'
                              : 'bg-white/10 text-gray-300'
                            }`}
                        >
                          {item.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item._id !== user?.id && item._id !== user?._id && (
                          <button
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                type: 'user',
                                id: item._id,
                                name: item.name || item.email,
                              })
                            }
                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* User Pagination */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-400 font-body">
              Page {userPage} of {userPagination.totalPages || 1}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={userPage <= 1 || usersLoading}
                onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-secondary disabled:opacity-40 disabled:hover:text-gray-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={userPage >= userPagination.totalPages || usersLoading}
                onClick={() => setUserPage((p) => p + 1)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-secondary disabled:opacity-40 disabled:hover:text-gray-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EBOOKS MANAGEMENT */}
      {activeTab === 'ebooks' && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <form onSubmit={handleEbookSearchSubmit} className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search eBook title, slug, or category..."
                value={ebookSearch}
                onChange={(e) => setEbookSearch(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-secondary transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </form>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <p className="font-body text-xs text-gray-400">
                Total: <span className="text-secondary font-semibold">{ebookPagination.totalEbooks}</span>
              </p>
              <Link
                to="/admin/ebooks/publish"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm font-semibold bg-secondary text-primary hover:bg-[#00e6c5] transition-all shadow-[0_0_15px_rgba(1,255,219,0.25)]"
              >
                <Plus className="w-4 h-4" />
                <span>Publish eBook</span>
              </Link>
            </div>
          </div>

          {/* eBooks Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d0d0d]">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10 font-body">
                <tr>
                  <th className="px-6 py-4">eBook</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-body">
                {ebooksLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      Loading eBooks...
                    </td>
                  </tr>
                ) : ebooks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      No eBooks published yet. Click "Publish eBook" to add one.
                    </td>
                  </tr>
                ) : (
                  ebooks.map((item) => (
                    <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                        {item.coverImage?.url ? (
                          <img
                            src={item.coverImage.url}
                            alt={item.title}
                            className="w-10 h-14 object-cover rounded-lg border border-white/10 bg-black/40"
                          />
                        ) : (
                          <div className="w-10 h-14 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-display text-base text-white truncate max-w-xs">{item.title}</p>
                          <p className="font-body text-xs text-gray-500 font-mono">/{item.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-gray-300">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-secondary">${Number(item.price).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.isPublished
                              ? 'bg-secondary/15 text-secondary border border-secondary/30'
                              : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                            }`}
                        >
                          {item.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleViewDetails(item._id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-secondary hover:bg-white/5 transition-colors"
                            title="View eBook Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                type: 'ebook',
                                id: item._id,
                                name: item.title,
                              })
                            }
                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                            title="Delete eBook"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* eBook Pagination */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-400 font-body">
              Page {ebookPage} of {ebookPagination.totalPages || 1}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={ebookPage <= 1 || ebooksLoading}
                onClick={() => setEbookPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-secondary disabled:opacity-40 disabled:hover:text-gray-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={ebookPage >= ebookPagination.totalPages || ebooksLoading}
                onClick={() => setEbookPage((p) => p + 1)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-secondary disabled:opacity-40 disabled:hover:text-gray-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: DELETE CONFIRMATION */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#111] border border-white/10 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-xl text-white">Confirm Deletion</h3>
              <p className="font-body text-sm text-gray-400 mt-1">
                Are you sure you want to permanently delete{' '}
                <span className="text-white font-medium">"{deleteModal.name}"</span>? This action cannot be
                undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteModal({ open: false, type: '', id: '', name: '' })}
                className="px-4 py-2 rounded-xl font-body text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl font-body text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EBOOK DETAILS */}
      {detailsModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl bg-[#111] border border-white/10 p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display text-2xl text-white">eBook Details</h3>
              <button
                onClick={() => setDetailsModal({ open: false, loading: false, data: null })}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailsModal.loading ? (
              <p className="text-center py-10 text-gray-400 font-body">Loading eBook details...</p>
            ) : detailsModal.data ? (
              <div className="space-y-6 font-body text-sm">
                <div className="flex flex-col sm:flex-row gap-6">
                  {detailsModal.data.coverImage?.url && (
                    <img
                      src={detailsModal.data.coverImage.url}
                      alt={detailsModal.data.title}
                      className="w-36 h-48 object-cover rounded-xl border border-white/15 bg-black"
                    />
                  )}
                  <div className="space-y-2 flex-1">
                    <h4 className="font-display text-2xl text-white">{detailsModal.data.title}</h4>
                    <p className="text-xs text-gray-500 font-mono">Slug: {detailsModal.data.slug}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary/15 text-secondary border border-secondary/30">
                        {detailsModal.data.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-gray-300">
                        ${Number(detailsModal.data.price).toFixed(2)}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-gray-300">
                        Sales: {detailsModal.data.salesCount || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-white uppercase text-xs tracking-wider mb-1">
                    Description
                  </h5>
                  <p className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    {detailsModal.data.description}
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                  <h5 className="font-semibold text-white uppercase text-xs tracking-wider mb-2">
                    Digital Asset File (MongoDB GridFS)
                  </h5>
                  <p className="text-gray-400 text-xs">
                    Format: <span className="text-white font-mono uppercase">{detailsModal.data.digitalFile?.fileType}</span>
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    Filename: <span className="text-white font-mono">{detailsModal.data.digitalFile?.filename || 'eBook asset'}</span>
                  </p>
                  {detailsModal.data.digitalFile?.fileSize > 0 && (
                    <p className="text-gray-400 text-xs">
                      Size: <span className="text-white font-mono">{(detailsModal.data.digitalFile.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                    </p>
                  )}
                  {detailsModal.data.digitalFile?.url && (
                    <a
                      href={detailsModal.data.digitalFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-secondary hover:underline pt-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Direct GridFS Asset Download Link
                    </a>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* MODAL 3: PUBLISH EBOOK */}
      {publishModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl bg-[#111] border border-white/10 p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h3 className="font-display text-2xl text-white">Publish New eBook</h3>
              </div>
              <button
                onClick={() => setPublishModal({ open: false, loading: false, error: '' })}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {publishModal.error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {publishModal.error}
              </div>
            )}

            <form onSubmit={handlePublishSubmit} className="space-y-4 font-body text-sm">
              <div>
                <label className="block text-gray-300 text-xs uppercase tracking-wider mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Mastering Digital Marketing"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-xs uppercase tracking-wider mb-1.5">
                    Custom Slug (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="mastering-digital-marketing"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-secondary font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/10 text-white text-sm focus:outline-none focus:border-secondary"
                  >
                    <option value="eBook">eBook</option>
                    <option value="Template">Template</option>
                    <option value="Guide">Guide</option>
                    <option value="Bundle">Bundle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-xs uppercase tracking-wider mb-1.5">
                  Price ($ USD) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="29.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-xs uppercase tracking-wider mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed breakdown of what this product covers..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
                  Cover Image File (MongoDB GridFS) *
                </h4>
                <div>
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-secondary/15 file:text-secondary hover:file:bg-secondary/25 cursor-pointer"
                  />
                  {coverImageFile && (
                    <p className="text-xs text-secondary mt-1">Selected: {coverImageFile.name}</p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
                  Digital Asset File (MongoDB GridFS) *
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="file"
                      required
                      accept=".pdf,.epub,.zip,application/pdf,application/epub+zip,application/zip"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setDigitalAssetFile(file);
                        if (file) {
                          const ext = file.name.split('.').pop()?.toLowerCase();
                          if (ext === 'pdf' || ext === 'epub' || ext === 'zip') {
                            setFormData((prev) => ({ ...prev, fileType: ext }));
                          }
                        }
                      }}
                      className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-secondary/15 file:text-secondary hover:file:bg-secondary/25 cursor-pointer"
                    />
                    {digitalAssetFile && (
                      <p className="text-xs text-secondary mt-1">Selected: {digitalAssetFile.name}</p>
                    )}
                  </div>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-white text-xs focus:outline-none focus:border-secondary"
                  >
                    <option value="pdf">PDF</option>
                    <option value="epub">EPUB</option>
                    <option value="zip">ZIP</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPublishModal({ open: false, loading: false, error: '' })}
                  className="px-4 py-2.5 rounded-xl font-body text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishModal.loading}
                  className="px-6 py-2.5 rounded-xl font-body text-sm font-semibold bg-secondary text-primary hover:bg-[#00e6c5] transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(1,255,219,0.3)]"
                >
                  {publishModal.loading ? 'Publishing...' : 'Publish eBook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
