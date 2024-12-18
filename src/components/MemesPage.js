import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from "../api/client";
import { X } from "lucide-react";

function TagInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded bg-white min-h-[42px]">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="hover:bg-blue-200 rounded-full p-0.5"
          >
            <X size={14} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? "태그 입력 (쉼표 또는 엔터로 구분)" : ""}
        className="flex-1 min-w-[120px] outline-none"
      />
    </div>
  );
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-[90%] max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

function ImageModal({ image, isOpen, onClose }) {
  if (!image) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold break-all pr-8">{image.title || "이미지 상세"}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <img
          src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/images/${image.filename}`}
          alt={image.tags.join(', ')}
          className="w-full h-auto object-contain max-h-[70vh]"
        />

        <div className="flex flex-wrap gap-2 mt-4">
          {image.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function MemesPage() {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const observer = useRef();
  const lastImageRef = useCallback(node => {
    if (isLoading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [isLoading, hasMore]);

  const fetchImages = async (search = '', pageNum = 1, append = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const limit = 30;
      const response = await api.get(`/memes?search=${search}&page=${pageNum}&limit=${limit}`);

      const newImages = response.data;

      if (append) {
        setImages(prev => [...prev, ...newImages]);
      } else {
        setImages(newImages);
        setPage(1);
      }

      setHasMore(newImages.length === limit);
      setInitialLoad(false);
    } catch (err) {
      setError('이미지를 불러오는데 실패했습니다.');
      console.error('Error fetching images:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages('', 1, false);
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchImages(searchTerm, page, true);
    }
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchImages(searchTerm, 1, false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tags', tags.join(', '));

    try {
      setIsLoading(true);
      setError(null);
      await api.post('/memes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await fetchImages(searchTerm, 1, false);
      setFile(null);
      setTags([]);
    } catch (err) {
      setError('업로드에 실패했습니다.');
      console.error('Error uploading:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-8">
        <form onSubmit={handleUpload} className="flex flex-col gap-2">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept="image/*"
            className="p-2 border rounded"
            disabled={isLoading}
          />
          <TagInput tags={tags} setTags={setTags} />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-green-300"
            disabled={isLoading}
          >
            {isLoading ? '업로드중...' : '업로드'}
          </button>
        </form>
      </div>

      {initialLoad ? (
        <div className="text-center">로딩중...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                ref={index === images.length - 1 ? lastImageRef : null}
                className="border rounded p-2 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/images/${image.filename}`}
                  alt={image.tags.join(', ')}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  {image.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                  {image.tags.length > 3 && (
                    <span className="px-2 py-0.5 text-gray-500 text-sm">
                      +{image.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isLoading && page > 1 && (
            <div className="text-center py-4">
              추가 이미지 로딩중...
            </div>
          )}

          {!hasMore && !isLoading && images.length > 0 && (
            <div className="text-center py-4 text-gray-500">
              모든 이미지를 불러왔습니다.
            </div>
          )}
        </>
      )}

      <ImageModal
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}

export default MemesPage;