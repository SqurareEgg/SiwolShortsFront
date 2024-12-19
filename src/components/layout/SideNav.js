import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { LayoutGrid, Image, Settings, MessageSquare } from 'lucide-react';
import { userState } from '../../recoil/atoms';
import { ChatHistory } from '../features/chat/ChatHistory';

const NavItem = ({ icon, text, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center px-4 py-3 text-gray-400 hover:text-white
      transition-colors duration-200
      ${isActive ? 'bg-gray-800 text-white' : ''}
    `}
  >
    <span className="flex-shrink-0">{icon}</span>
    <span className="ml-4 whitespace-nowrap overflow-hidden opacity-100 transition-opacity duration-300">
      {text}
    </span>
  </NavLink>
);

const SideNav = () => {
  const user = useRecoilValue(userState);

  const menuItems = [
    { icon: <LayoutGrid size={20} />, text: "게시판", path: "/" },
    { icon: <Image size={20} />, text: "짤 검색", path: "/memes" },
    { icon: <Settings size={20} />, text: "AI 설정", path: "/settings" },
  ];

  return (
    <nav className="w-16 hover:w-64 transition-all duration-300 bg-gray-900 h-screen flex-shrink-0 flex flex-col">
      <div className="flex flex-col flex-grow">
        <ul className="py-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavItem
                icon={item.icon}
                text={item.text}
                to={item.path}
              />
            </li>
          ))}
        </ul>

        {/*{user && <ChatHistory />}*/}
      </div>
    </nav>
  );
};

export default SideNav;