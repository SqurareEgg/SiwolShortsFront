import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Pagination } from './Pagination';
import { Search } from 'lucide-react';

export const PostList = ({ onSelectPost }) => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');

  // 카테고리 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
        if (response.data.length > 0) {
          setCurrentCategory(response.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // 게시글 목록 가져오기
  useEffect(() => {
    if (!currentCategory) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/posts', {
          params: { category: currentCategory, page }
        });
        setPosts(response.data.items);
        setTotalPages(response.data.total_pages);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentCategory, page]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (e) => {
    setCurrentCategory(e.target.value);
    setPage(0); // 카테고리 변경 시 페이지 초기화
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (post) => {
    onSelectPost(post);
  };





  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 로직 구현
    console.log('Searching for:', searchQuery);
  };


  return (
    <div className="bg-gray-700 rounded-lg shadow-lg h-full flex flex-col">
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between py-2 items-center">
          {/* 게시글 목록 */}
          <h3 className="text-lg font-semibold text-white">게시글 목록</h3>

          {/* 카테고리 선택 */}
          <div>
            <select
                value={currentCategory}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm text-center"
            >
              {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 flex-1 flex flex-col">

          {/* 게시글 목록 */}
          <div
              className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
            {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"/>
                </div>
            ) : (
                <div className="space-y-2">
                  {posts.map((post) => (
                      <div
                          key={post.id}
                          onClick={() => handlePostClick(post)}
                          className="p-3 border border-gray-600 rounded cursor-pointer hover:bg-gray-600 bg-gray-600 transition-colors duration-200"
                      >
                        <div className="text-sm font-medium text-white">{post.title}</div>
                        <div className="text-xs text-gray-300 mt-1">
                          {post.date} | 조회 {post.views} | {post.community}
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {!loading && posts.length > 0 && (
              <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
              />
          )}
        </div>
        <div className="col-span-5 h-full flex flex-col">
          {/* 검색창 */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="게시글 검색..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white pr-10"
              />
              <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search size={20}/>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};