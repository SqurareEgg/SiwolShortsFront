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
  const [activeSearch, setActiveSearch] = useState('');

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
    const fetchPosts = async () => {
      if (!currentCategory) return;

      setLoading(true);
      try {
        const params = {
          category: currentCategory,
          page,
          search: activeSearch // 실제 검색 쿼리 사용
        };

        const response = await api.get('/posts', { params });
        setPosts(response.data.items);
        setTotalPages(response.data.total_pages);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentCategory, page, activeSearch]); // activeSearch를 의존성으로 사용

  // 카테고리 변경 핸들러
  const handleCategoryChange = (e) => {
    setCurrentCategory(e.target.value);
    setPage(0);
    setSearchQuery(''); // 카테고리 변경 시 검색어 초기화
    setActiveSearch(''); // 활성 검색어도 초기화
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearch(searchQuery); // 검색 버튼 클릭 시에만 검색어 적용
    setPage(0);
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg h-full flex flex-col">
      <div className="p-4 flex flex-col h-full">
        {/* 헤더 영역 */}
        <div className="space-y-4">
          {/* 상단 헤더 */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">게시글 목록</h3>
            <select
              value={currentCategory}
              onChange={handleCategoryChange}
              className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm min-w-[120px]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* 검색창 */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="게시글 검색..."
                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* 게시글 목록 */}
        <div className="flex-1 overflow-y-auto mt-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <div className="space-y-2">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => onSelectPost(post)}
                    className="w-full p-3 bg-gray-600 rounded-lg hover:bg-gray-500
                             transition-colors duration-200 text-left"
                  >
                    <div className="text-sm font-medium text-white break-words">
                      {post.title}
                    </div>
                    <div className="flex items-center mt-2 space-x-2 text-xs text-gray-300">
                      <span className="bg-gray-700 px-2 py-0.5 rounded-full">
                        {post.community}
                      </span>
                      <span>조회 {post.views}</span>
                      <span>{post.date}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  {activeSearch ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {!loading && posts.length > 0 && (
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};