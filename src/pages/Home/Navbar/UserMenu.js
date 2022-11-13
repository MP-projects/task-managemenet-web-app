import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useTheme } from "../../../hooks/useTheme";

//components
import Delete from "../../../components/Delete";

//styles
import "./UserMenu.css";
export default function UserMenu({
  boards,
  menuIsClicked,
  handleMenuButton,
  currentUserData,
  handleExampleData,
  handleLogout,
  handleClearData,
}) {
  const [menuClicked, setMenuClicked] = useState(null);
  const [deleteClicked, setDeleteClicked] = useState(false);
  const [logoutClicked, setLogoutClicked] = useState(false);
  // rF7CMBktroU0XI3iTXCyERXnRPl1
  const { user } = useAuthContext();
  const { darkMode } = useTheme();

  const ref = useRef();
  useOnClickOutside(ref, () => {
    if (deleteClicked === false && logoutClicked === false) {
      setMenuClicked(!menuIsClicked);
      setTimeout(() => {
        handleMenuButton(!menuIsClicked);
      }, 100);
    }
  });

  const location = useLocation();

  const clearDataTitleDescription = "Delete all boards?";
  const clearDataDecription = `Are you sure you want to delete all boards?
   This action will remove all boards and tasks and cannot be reversed.`;
  const logoutTitleDescription = "Logout?";
  const logoutDecription = "Are you sure you want to logout?";

  const handleCloseMenu = () => {
    setMenuClicked(!menuIsClicked);
    setTimeout(() => {
      handleMenuButton(!menuIsClicked);
    }, 100);
  };

  const handleLogoutButton = (value) => {
    setLogoutClicked(value);
  };

  const handleDeleteButton = (value) => {
    setDeleteClicked(value);
  };
  const handleCancelButton = (value) => {
    handleMenuButton(true);
    setDeleteClicked(value);
    setLogoutClicked(value);
  };

  useEffect(() => {
    if (menuIsClicked !== undefined) {
      setMenuClicked(menuIsClicked);
    }
  }, [menuIsClicked]);

  return (
    <>
      {deleteClicked && (
        <Delete
          handleDeleteButton={handleCancelButton}
          handleDeleteElement={handleClearData}
          titleDescription={clearDataTitleDescription}
          text={clearDataDecription}
        />
      )}
      {logoutClicked && (
        <Delete
          handleDeleteButton={handleCancelButton}
          handleDeleteElement={handleLogout}
          titleDescription={logoutTitleDescription}
          text={logoutDecription}
        />
      )}

      <section
        ref={ref}
        className={`userMenu ${menuClicked ? "userMenu--active" : ""} ${
          darkMode ? "darkMode--dark" : ""
        }`}>
        <ul
          className={`userMenu__list ${
            !menuClicked && "userMenu__list--display-none"
          }`}>
          <li className="userMenu__user-name">
            <p
              className={`userMenu__user-name-p ${
                darkMode ? "darkMode--dark" : ""
              }`}>
              Logged as:
              <br />
              <strong>
                {user && user.displayName
                  ? user.displayName.toUpperCase()
                  : "GUEST"}
              </strong>
            </p>
          </li>
          {user &&
            (user.isAnonymous ? (
              <li
                className={`userMenu__list-element ${
                  darkMode ? "darkMode--hover" : ""
                }`}>
                <Link
                  onClick={handleCloseMenu}
                  to={`${location.pathname}/register`}
                  className="userMenu__list-button">
                  <p className="userMenu__list-button-p">Sign up</p>
                </Link>
              </li>
            ) : (
              <li
                className={`userMenu__list-element ${
                  darkMode ? "darkMode--hover" : ""
                }`}>
                <Link
                  onClick={handleCloseMenu}
                  to={`${location.pathname}/profile`}
                  className="userMenu__list-button">
                  <p className="userMenu__list-button-p">My account </p>
                </Link>
              </li>
            ))}

          <li
            className={`userMenu__list-element ${
              darkMode ? "darkMode--hover" : ""
            }`}>
            {currentUserData && currentUserData.example ? (
              <button
                className="userMenu__list-button"
                onClick={() => handleExampleData(false)}>
                <p className="userMenu__list-button-p">
                  {" "}
                  Turn off example data{" "}
                </p>
              </button>
            ) : (
              <button
                className="userMenu__list-button"
                onClick={() => handleExampleData(true)}>
                <p className="userMenu__list-button-p">
                  {" "}
                  Turn on example data{" "}
                </p>
              </button>
            )}
          </li>
          <li
            className={`userMenu__list-element userMenu__list-element--remove ${
              !(boards && boards.length > 0) &&
              "userMenu__list-element--disabled"
            } ${
              darkMode && boards && boards.length > 0 ? "darkMode--hover" : ""
            }  `}>
            <button
              onClick={() => handleDeleteButton(true)}
              disabled={boards && boards.length > 0 ? false : true}
              className={`userMenu__list-button`}>
              <p className="userMenu__list-button-p">Remove all boards</p>
            </button>
          </li>
          <li
            className={`userMenu__list-element ${
              darkMode ? "darkMode--hover" : ""
            }`}>
            <Link
              to ={`${location.pathname}/About`}
              className="userMenu__list-button">
              <p className="userMenu__list-button-p"> About author </p>
            </Link>
          </li>
          <li
            className={`userMenu__list-element ${
              darkMode ? "darkMode--hover" : ""
            }`}>
            <button
              onClick={handleLogoutButton}
              className="userMenu__list-button">
              <p className="userMenu__list-button-p"> Logout </p>
            </button>
          </li>
        </ul>
      </section>
    </>
  );
}
