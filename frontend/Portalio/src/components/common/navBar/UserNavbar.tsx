import React, { useState } from "react";
import Logo from "../../../assets/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../../store/auth/AuthSlice";
import { logoutApi } from "../../../api/AuthAPI";
import { RootState } from "../../../store";
import BasicProfile from "../../../assets/BasicProfile.png";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { AiOutlineSetting } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import ticketIcon from "../../../assets/ticket_icon.png";
import { sideNavActions } from "../../../store/nav/SideNavSlice";

const UserNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const userProfile = useSelector(
    (state: RootState) => state.auth.memberPicture
  );
  const memberUsername = useSelector((state: RootState) => state.auth.memberUsername);
  const userNickname = useSelector(
    (state: RootState) => state.auth.memberNickname
  );
  const userTicket = useSelector((state: RootState) => state.auth.memberTicket);

  const goToMainPage = () => {
    dispatch(sideNavActions.selectFeed());
    navigate("/");
  };

  // 메뉴 열기 핸들러
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 메뉴 닫기 핸들러
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 로그아웃 메서드
  const handleLogout = async () => {
    dispatch(authActions.logout());
    logoutApi();
    navigate("/users/login");
    handleMenuClose();
  };

  return (
    <nav className="flex justify-between relative">
      <button onClick={goToMainPage}>
        {/* 로고 이미지 */}
        <img src={Logo} alt="no-image" className="p-3 w-48" />
      </button>

      {/* 프로필 및 메뉴 */}
      <div className="flex items-center p-3 relative">
        <div className="flex items-center mx-5">
          <img src={ticketIcon} alt="no-image" className="size-8 mr-3" />
          <div className="font-bold">{userTicket || 0}</div>
        </div>
        <div className="mx-5 font-bold">{userNickname || memberUsername}</div>
        <Tooltip title="프로필 메뉴">
          <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
            <Avatar
              src={
                userProfile === "default_picture_url"
                  ? BasicProfile
                  : userProfile || undefined
              }
              alt="Profile"
            />
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
          <MenuItem
            onClick={() => {
              navigate(`/users/profile/${memberUsername}`);
              handleMenuClose();
            }}
          >
            <FaUserCircle className="mr-2" />
            마이 페이지
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate(`/users/profile/${memberUsername}/settings`);
              handleMenuClose();
            }}
          >
            <AiOutlineSetting className="mr-2" />
            설정
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <MdLogout className="mr-2" />
            로그아웃
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default UserNavbar;
