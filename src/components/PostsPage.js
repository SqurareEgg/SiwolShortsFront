import React from 'react';
import { useRecoilState } from 'recoil';
import { selectedPostState } from '../recoil/atoms';
import { PostList } from './PostList';
import { ContentViewer } from './ContentViewer';
import { OCRInput } from './OCRInput';
import { StoryGenerator } from './StoryGenerator';

export const PostsPage = () => {
  const [selectedPost, setSelectedPost] = useRecoilState(selectedPostState);

  return (
    <div className="h-full grid grid-cols-3 gap-4">
      {/* 왼쪽: OCR 및 스토리 생성기 */}
      <div className="space-y-4">
        <OCRInput />
        <StoryGenerator />
      </div>

      {/* 중앙: 게시글 목록 */}
      <div>
        <PostList onSelectPost={setSelectedPost} />
      </div>

      {/* 오른쪽: 게시글 내용 */}
      <div>
        <ContentViewer selectedPost={selectedPost} />
      </div>
    </div>
  );
};