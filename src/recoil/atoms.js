import { atom } from 'recoil';

// 사용자 관련 상태
export const userState = atom({
  key: 'userState',
  default: null
});

export const loginModalState = atom({
  key: 'loginModalState',
  default: false
});

// 게시글 관련 상태
export const postsState = atom({
  key: 'postsState',
  default: []
});

export const selectedPostState = atom({
  key: 'selectedPostState',
  default: null
});

export const currentCategoryState = atom({
  key: 'currentCategoryState',
  default: ''
});

export const searchQueryState = atom({
  key: 'searchQueryState',
  default: ''
});

export const postsPageState = atom({
  key: 'postsPageState',
  default: 0
});

// 스토리 생성 관련 상태
export const storyGeneratorState = atom({
  key: 'storyGeneratorState',
  default: {
    text: '',
    result: '',
    tone: '기본',
    modificationInput: ''
  }
});

export const chatHistoryState = atom({
  key: 'chatHistoryState',
  default: []
});

// OCR 관련 상태
export const ocrImageUrlState = atom({
  key: 'ocrImageUrlState',
  default: ''
});

export const chatListState = atom({
  key: 'chatListState',
  default: [] // { id: string, title: string, messages: Array<{role: string, content: string}> }
});

export const currentChatState = atom({
  key: 'currentChatState',
  default: null // 현재 선택된 채팅의 ID
});