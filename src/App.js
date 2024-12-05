import React from 'react';
import { OCRInput } from './components/OCRInput';
import { StoryGenerator } from './components/StoryGenerator';
import { PostList } from './components/PostList';
import { ContentViewer } from './components/ContentViewer';

function App() {
  const [selectedPost, setSelectedPost] = React.useState(null);
  const [storyText, setStoryText] = React.useState('');

  const handleTextExtracted = (text) => {
    setStoryText(prev => prev ? `${prev}\n\n${text}` : text);
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col">
      {/* 헤더 */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-[1800px] mx-auto px-4">
          <h1 className="text-3xl font-bold py-4 text-white">커뮤니티 게시판 & 스토리 생성기</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="flex-1 overflow-hidden"> {/* flex-1로 남은 공간 차지 */}
        <div className="max-w-[1800px] mx-auto px-4 h-full py-4">
          <div className="grid grid-cols-12 gap-4 h-full">
            {/* 왼쪽 사이드바 */}
            <div className="col-span-4 h-full flex flex-col overflow-auto">
              <div className="space-y-4 flex-shrink-0"> {/* flex-shrink-0로 크기 고정 */}
                <OCRInput onTextExtracted={handleTextExtracted} />
                <StoryGenerator initialText={storyText} />
              </div>
            </div>

            {/* 오른쪽 메인 영역 */}
            <div className="col-span-8 h-full">
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* 게시글 목록 */}
                <div className="h-full overflow-hidden flex flex-col">
                  <PostList onSelectPost={setSelectedPost} />
                </div>

                {/* 게시글 뷰어 */}
                <div className="h-full overflow-hidden flex flex-col">
                  <ContentViewer selectedPost={selectedPost} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;