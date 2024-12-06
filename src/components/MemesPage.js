import React from 'react';
import { Image } from 'lucide-react';

export const MemesPage = () => {
  return (
      <iframe
          src="https://jjalbang.today/"
          title="External Site"
          className="w-full h-full rounded-lg border-2 border-gray-600"
          sandbox="allow-same-origin allow-scripts allow-popups"
      ></iframe>

      // <div className="h-full bg-gray-700 rounded-lg p-6 overflow-auto">
      //   <div className="max-w-3xl mx-auto">
      //     <h2 className="text-2xl font-bold text-white mb-6">짤 검색</h2>
      //     <div className="bg-gray-800 rounded-lg p-8 text-center">
      //       <Image size={64} className="mx-auto mb-4 text-gray-500"/>
      //       <h3 className="text-xl font-semibold text-white mb-2">
      //         짤 검색 기능 준비 중
      //       </h3>
      //       <p className="text-gray-400">
      //         더 나은 서비스 제공을 위해 준비 중입니다. <br/>
      //         곧 만나뵙겠습니다!
      //       </p>
      //     </div>
      //   </div>
      // </div>
  );
};