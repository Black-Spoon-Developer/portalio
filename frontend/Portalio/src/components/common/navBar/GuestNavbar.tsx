import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicProfile from "../../../assets/BasicProfile.png";
import Logo from "../../../assets/Logo.png";
import { MdLogin } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const GuestNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  // 메뉴 열기 핸들러
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 메뉴 닫기 핸들러
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 메인 페이지로 이동하게 하는 메서드
  const goToMainPage = () => {
    navigate("/");
  };

  // 메뉴 항목 배열
  const menuItems: MenuItem[] = [
    {
      label: "회원가입 및 로그인",
      icon: <MdLogin className="mr-2" />,
      onClick: () => {
        navigate("/users/login");
        handleMenuClose();
      },
    },
    {
      label: "메인페이지",
      icon: <AiOutlineHome className="mr-2" />,
      onClick: () => {
        navigate("/");
        handleMenuClose();
      },
    },
  ];

  return (
    <nav className="flex justify-between relative">
      <button onClick={goToMainPage}>
        {/* 로고 이미지 */}
        <img src={Logo} alt="no-image" className="p-3 w-48" />
      </button>
      {/* 프로필 및 메뉴 */}
      <div className="flex items-center p-3 relative">
        <div className="mx-3 font-bold">게스트</div>
        <Tooltip title="프로필 메뉴">
          <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
            <Avatar src={BasicProfile} alt="Profile" />
          </IconButton>
        </Tooltip>

        {/* Material UI 메뉴 */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          sx={{
            mt: 1.5,
            "& .MuiPaper-root": {
              overflow: "visible",
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {menuItems.map((item, index) => (
            <MenuItem key={index} onClick={item.onClick}>
              <div className="flex items-center">
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </div>
            </MenuItem>
          ))}
        </Menu>
      </div>
    </nav>
  );
};

export default GuestNavbar;
