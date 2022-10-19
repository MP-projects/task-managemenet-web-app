import React from "react";
import { useEffect, useState, useRef } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { useAuthContext } from "../hooks/useAuthContext";

//components
import Delete from "./Delete";

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

  const { user } = useAuthContext();

  const ref = useRef();
  useOnClickOutside(ref, () => {
    if (deleteClicked === false && logoutClicked === false) {
      setMenuClicked(!menuIsClicked);
      setTimeout(() => {
        handleMenuButton(!menuIsClicked);
      }, 100);
    }
  });

  const clearDataTitleDescription = "Delete all boards?";
  const clearDataDecription = `Are you sure you want to delete all boards?
   This action will remove all boards and tasks and cannot be reversed.`;
  const logoutTitleDescription = "Logout?";
  const logoutDecription = "Are you sure you want to logout?";
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
  console.log(menuClicked);
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
        className={`userMenu ${menuClicked && "userMenu--active"}`}>
        <ul
          className={`userMenu__list ${
            !menuClicked && "userMenu__list--display-none"
          }`}>
          <li className="userMenu__user-name">
            <p className="userMenu__user-name-p">
              Logged as:
              <br />
              <strong>{(user && user.displayName) ? user.displayName.toUpperCase() : "GUEST"}</strong>
            </p>
          </li>
          <li className="userMenu__list-element">
            <button className="userMenu__list-button">
              <p className="userMenu__list-button-p">My account </p>
            </button>
          </li>
          <li className="userMenu__list-element">
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
            {/* {!currentUserData && (
              <button
                className="userMenu__list-button"
                onClick={() => handleExampleData(true)}>
                <p className="userMenu__list-button-p">
                  {" "}
                  Turn on example data{" "}
                </p>
              </button>
            )} */}
          </li>
          <li
            className={`userMenu__list-element userMenu__list-element--remove ${
              !(boards && boards.length > 0) &&
              "userMenu__list-element--disabled"
            }`}>
            <button
              onClick={() => handleDeleteButton(true)}
              disabled={boards && boards.length > 0 ? false : true}
              className={`userMenu__list-button`}>
              <p className="userMenu__list-button-p">Remove all boards</p>
            </button>
          </li>
          <li className="userMenu__list-element">
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
