import React, { useState, useEffect } from 'react';
import { api } from "../api/client";

function MemesPage() {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (search = '') => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/api/memes?search=${search}`);
      setImages(response.data);
    } catch (err) {
      setError('이미지를 불러오는데 실패했습니다.');
      console.error('Error fetching images:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchImages(searchTerm);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tags', tags);

    try {
      setIsLoading(true);
      setError(null);
      await api.post('/api/memes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await fetchImages();
      setFile(null);
      setTags('');
    } catch (err) {
      setError('업로드에 실패했습니다.');
      console.error('Error uploading:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 이미지 URL 생성 헬퍼 함수
  const getImageUrl = (filename) => {
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    return `${baseUrl}/api/memes/images/${filename}`;
  };

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="태그로 검색하기..."
            className="flex-1 p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? '검색중...' : '검색'}
          </button>
        </form>
      </div>

      <div className="mb-8">
        <form onSubmit={handleUpload} className="flex flex-col gap-2">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept="image/*"
            className="p-2 border rounded"
            disabled={isLoading}
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="태그들 (쉼표로 구분)"
            className="p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-green-300"
            disabled={isLoading}
          >
            {isLoading ? '업로드중...' : '업로드'}
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center">로딩중...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="border rounded p-2">
              <img
                src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/images/${image.filename}`}
                alt={image.tags.join(', ')}
                className="w-full h-48 object-cover"
              />
              <div className="mt-2 text-sm text-gray-600">
                {image.tags.map(tag => `#${tag}`).join(' ')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MemesPage;