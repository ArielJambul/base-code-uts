'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useQuery, useMutation, gql } from '@apollo/client';
import { userApi } from '@/lib/api';

// ... (Definisi GraphQL GET_POSTS, CREATE_POST, DELETE_POST tetap sama)
const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      author
      createdAt
      status
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $author: String!, $status: PostStatus!) {
    createPost(title: $title, content: $content, author: $author, status: $status) {
      id
      title
      content
      author
      createdAt
      status
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', email: '', age: '' });
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '', status: '' });

  // State untuk proteksi halaman
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // GraphQL queries
  const { data: postsData, loading: postsLoading, refetch: refetchPosts } = useQuery(GET_POSTS);
  const [createPost] = useMutation(CREATE_POST);
  const [deletePost] = useMutation(DELETE_POST);

  // ===== PROTEKSI HALAMAN DITAMBAHKAN =====
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      fetchUsers();
    }
  }, [router]);
  // ==========================================

  const fetchUsers = async () => {
    try {
      // Kita perlu menambahkan token ke header untuk request ini
      // (Idealnya, apiClient di-setup untuk menambahkannya otomatis)
      const token = localStorage.getItem('token');
      const response = await userApi.getUsers(/* { headers: { Authorization: `Bearer ${token}` } } */);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... (sisa handler: handleCreateUser, handleCreatePost, handleDeleteUser, handleDeletePost, getStatusBadge tetap sama)
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.createUser({
        name: newUser.name,
        email: newUser.email,
        age: parseInt(newUser.age)
      });
      setNewUser({ name: '', email: '', age: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({
        variables: newPost,
      });
      setNewPost({ title: '', content: '', author: '', status: '' });
      refetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await userApi.deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deletePost({
        variables: { id: id },
      });
      refetchPosts(); 
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DONE':
        return <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Done</span>;
      case 'PROGRESS':
        return <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">In Progress</span>;
      case 'TODO':
      default:
        return <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">To-Do</span>;
    }
  };

  // ===== FUNGSI LOGOUT DITAMBAHKAN =====
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };
  // ===================================

  // Tampilkan loading jika belum terautentikasi
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  // ===== JSX KONTEN HALAMAN (TETAP SAMA) =====
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ===== BLOK JUDUL DAN LOGOUT YANG DIUBAH ===== */}
        <div className="relative mb-12">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            My Task Management
          </h1>
          <button
            onClick={handleLogout}
            className="absolute top-0 right-0 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        {/* ======================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Blok Users */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 text-center">Users</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateUser} className="mb-6">
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="border rounded-md px-3 py-2"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="border rounded-md px-3 py-2"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={newUser.age}
                    onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                    className="border rounded-md px-3 py-2"
                    min="1"
                    max="150"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Add User
                  </button>
                </div>
              </form>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="space-y-4">
                  {users.map((user: any) => (
                    <div key={user.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-xs">Age: {user.age} • {user.role}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Blok Posts */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 text-center">Posts</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreatePost} className="mb-6">
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="border rounded-md px-3 py-2"
                    required
                  />
                  <textarea
                    placeholder="Content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="border rounded-md px-3 py-2 h-24"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Author"
                    value={newPost.author}
                    onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                    className="border rounded-md px-3 py-2"
                    required
                  />
                  <select
                    value={newPost.status}
                    onChange={(e) => setNewPost({ ...newPost, status: e.target.value })}
                    className={`border rounded-md px-3 py-2 ${
                      !newPost.status ? 'text-gray-400' : 'text-gray-900'
                    }`}
                    required
                  >
                    <option value="" disabled>Status</option>
                    <option value="TODO">To-Do</option>
                    <option value="PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Add Post
                  </button>
                </div>
              </form>
              {postsLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="space-y-4">
                  {postsData?.posts.map((post: any) => (
                    <div key={post.id} className="flex justify-between items-start p-4 border rounded">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          {getStatusBadge(post.status)}
                        </div>
                        <p className="text-gray-600 mt-2">{post.content}</p>
                        <div className="mt-3 text-sm text-gray-500">
                          <span>By: {post.author}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                        <span className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}