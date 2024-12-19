import React from 'react';
import { XCircle } from 'lucide-react';

const ElementInspector = ({ elementInfo, onClose }) => {
  if (!elementInfo) {
    return (
      <div className="p-4 text-gray-400 text-center">
        요소 위로 마우스를 올려보세요
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-800 rounded-br-lg overflow-y-auto">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h4 className="text-white font-medium">요소 정보</h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <XCircle size={20} />
        </button>
      </div>

      <div className="p-4 text-sm space-y-4">
        <Section title="요소">
          <p className="text-white">{elementInfo.tagName}</p>
          {elementInfo.id && (
            <p className="text-gray-300 mt-1">ID: {elementInfo.id}</p>
          )}
          {elementInfo.classes.length > 0 && (
            <p className="text-gray-300 mt-1 break-words">
              Classes: {elementInfo.classes.join(' ')}
            </p>
          )}
        </Section>

        <Section title="크기">
          <p className="text-gray-300">너비: {elementInfo.dimensions.width}px</p>
          <p className="text-gray-300">높이: {elementInfo.dimensions.height}px</p>
        </Section>

        <Section title="위치">
          <p className="text-gray-300">상단: {elementInfo.position.top}px</p>
          <p className="text-gray-300">좌측: {elementInfo.position.left}px</p>
        </Section>

        <Section title="스타일">
          <p className="text-gray-300">색상: {elementInfo.styles.color}</p>
          <p className="text-gray-300">배경: {elementInfo.styles.backgroundColor}</p>
          <p className="text-gray-300">글자 크기: {elementInfo.styles.fontSize}</p>
          <p className="text-gray-300">패딩: {elementInfo.styles.padding}</p>
          <p className="text-gray-300">마진: {elementInfo.styles.margin}</p>
        </Section>

        {elementInfo.text && (
          <Section title="텍스트 내용">
            <p className="text-gray-300 break-words">{elementInfo.text}</p>
          </Section>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h5 className="text-blue-400 font-medium mb-2">{title}</h5>
    {children}
  </div>
);

export default ElementInspector;