import React from 'react';

export const SettingsPage = () => {
  return (
    <div className="h-full bg-gray-700 rounded-lg p-6 overflow-auto">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">AI 설정</h2>
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              AI 모델 설정 (준비 중)
            </h3>
            <div className="space-y-4 text-gray-400">
              <p>• AI 모델 선택</p>
              <p>• 응답 길이 조정</p>
              <p>• 창의성 수준 설정</p>
              <p>• 특정 주제 필터링</p>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              개인화 설정 (준비 중)
            </h3>
            <div className="space-y-4 text-gray-400">
              <p>• 선호하는 글쓰기 스타일</p>
              <p>• 자주 사용하는 프롬프트 저장</p>
              <p>• 응답 형식 커스터마이징</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};