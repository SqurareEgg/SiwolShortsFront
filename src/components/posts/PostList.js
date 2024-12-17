import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { api } from '../../api/client';
import {
  postsState,
  selectedPostState,
  currentCategoryState,
  searchQueryState,
  postsPageState
} from '../../recoil/atoms';
import PostItem from './PostItem';
import SearchBar from './SearchBar';
import CategorySelect from './CategorySelect';
import { Pagination } from '../common/Pagination';

const PostList = () => {
  const [posts, setPosts] = useRecoilState(postsState);
  const [currentCategory, setCurrentCategory] = useRecoilState(currentCategoryState);
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const [page, setPage] = useRecoilState(postsPageState);
  const [, setSelectedPost] = useRecoilState(selectedPostState);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [activeSearch, setActiveSearch] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (currentCategory) {
      fetchPosts();
    }
  }, [currentCategory, page, activeSearch]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
      if (response.data.length > 0 && !currentCategory) {
        setCurrentCategory(response.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {
        category: currentCategory,
        page,
        search: activeSearch
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

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    setPage(0);
    setSearchQuery('');
    setActiveSearch('');
  };

  const handleSearch = () => {
    setActiveSearch(searchQuery);
    setPage(0);
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg h-full flex flex-col">
      <div className="p-4 flex flex-col h-full">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">게시글 목록</h3>
            <CategorySelect
              value={currentCategory}
              options={categories}
              onChange={handleCategoryChange}
            />
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>

        <div className="flex-1 overflow-y-auto mt-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <div className="space-y-2">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostItem
                    key={post.id}
                    post={post}
                    onClick={setSelectedPost}
                  />
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  {activeSearch ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
                </div>
              )}
            </div>
          )}
        </div>

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

export default PostList;