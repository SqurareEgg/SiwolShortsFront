import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, MessageSquare, Image, Settings } from 'lucide-react';
import {ChatHistory} from "./ChatHistory";

export const SideMenu = () => {
  const menuItems = [
    { icon: <LayoutGrid size={20} />, text: "게시글", path: "/" },
    { icon: <MessageSquare size={20} />, text: "채팅", path: "/chat/new" },
    { icon: <Image size={20} />, text: "짤 검색", path: "/memes" },
    { icon: <Settings size={20} />, text: "AI 설정", path: "/settings" },
  ];

  return (
    <nav className="w-16 hover:w-48 transition-all duration-300 bg-gray-900 h-screen flex-shrink-0">
      <ul className="py-4 space-y-2">
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-gray-400 hover:text-white
                ${isActive ? 'bg-gray-800 text-white' : ''}
              `}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="ml-4 whitespace-nowrap overflow-hidden opacity-100 transition-opacity duration-300">
                {item.text}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};