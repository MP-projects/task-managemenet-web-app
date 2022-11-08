import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useCollection } from "../../../hooks/useCollection";
import { useUpdate } from "../../../hooks/useUpdate";
import { useDeleteUser } from "../../../hooks/useDeleteUser";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import { useTheme } from "../../../hooks/useTheme";

//styles
import "./MyProfile.css";

//assets
import EditPen from "../../../assets/fontAwesome/pen-to-square-solid.svg";
import OK from "../../../assets/fontAwesome/check-solid.svg";
import X from "../../../assets/fontAwesome/xmark-solid.svg";

//components
import ChangeInfo from "../Menu/ChangeInfo";
import Delete from "../../../components/Delete";

export default function MyProfile() {
  const { user } = useAuthContext();
  const { documents: userData } = useCollection("userData", [
    "uid",
    "==",
    user.uid,
  ]);
  const { update } = useUpdate();
  const { deleteUser } = useDeleteUser();

  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const ref = useRef();
  useOnClickOutside(ref, () => {
    navigate(-1);
  });
  const refLabel = useRef();
  useOnClickOutside(refLabel, () => {
    setIsChangeDisplayNameClicked(false);
    if (user) {
      setDisplayName(user.displayName);
    }
  });
  const [isChangeEmailClicked, setIsChangeEmailClicked] = useState(false);
  const [isChangePasswordClicked, setIsChangePasswordClicked] = useState(false);
  const [isDeleteAccountClicked, setIsDeleteAccountClicked] = useState(false);
  const [isChangeAvatarClicked, setIsChangeAvatarClicked] = useState(false);
  const [isChangeDisplayNameClicked, setIsChangeDisplayNameClicked] =
    useState(false);
  const [isSettingsActive, setIsSettingsActive] = useState(false);

  const [avatars, setAvatars] = useState(null);
  const [randomAvatars, setRandomAvatars] = useState([]);
  const [randomAvatar, setRandomAvatar] = useState(
    `https://robohash.org/random`
  );
  const [isRandomAvatarChanged, setIsRandomAvatarChanged] = useState(false);

  const [displayName, setDisplayName] = useState("");

  const handleChangeAvatarButton = () => {
    setIsChangeEmailClicked(false);
    setIsChangePasswordClicked(false);
    setIsSettingsActive(!isChangeAvatarClicked);
    setIsChangeAvatarClicked(!isChangeAvatarClicked);
  };
  const handleChangeEmailButton = (value) => {
    setIsChangePasswordClicked(false);
    setIsChangeAvatarClicked(false);
    setIsSettingsActive(value);
    setIsChangeEmailClicked(!isChangeEmailClicked);
  };
  const handleChangePasswordButton = (value) => {
    setIsChangeEmailClicked(false);
    setIsChangeAvatarClicked(false);
    setIsSettingsActive(value);
    setIsChangePasswordClicked(!isChangePasswordClicked);
  };
  const handleDeleteAccountButton = (value) => {
    setIsDeleteAccountClicked(value);
    setIsChangeEmailClicked(false);
    setIsChangePasswordClicked(false);
    setIsSettingsActive(false);
    setIsChangeAvatarClicked(false);
  };

  const handleDeleteUser = () => {
    deleteUser();
  };

  const titleDescription = `Delete user ${
    user && user.displayName.toUpperCase()
  }?`;
  const text = `Are you sure you want to delete this user?
  This action will remove this user and all related data and cannot be reversed.`;
  const handleUpdateAvatar = (avatar) => {
    update(null, null, null, avatar);
  };

  const handleChangeRandomAvatar = async () => {
    setIsRandomAvatarChanged(true);
    const _randomAvatar = await fetch(
      randomAvatars[Math.floor(Math.random() * randomAvatars.length)]
    );
    setRandomAvatar(_randomAvatar.url);
    setIsRandomAvatarChanged(false);
  };
  const handleChangeDisplayNameClick = () => {
    setIsChangeDisplayNameClicked(!isChangeDisplayNameClicked);
  };

  const handleUpdateDisplayName = () => {
    update(null, null, displayName);
    handleChangeDisplayNameClick();
  };
  const handleCancelUpdateDisplayName = () => {
    if (user) {
      setDisplayName(user.displayName);
      handleChangeDisplayNameClick();
    }
  };

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);

      let _avatars = [`https://robohash.org/${user.displayName}`];
      for (let i = 0; i < 9; i++) {
        _avatars.push(`https://robohash.org/${i}`);
      }
      setAvatars(_avatars);
      let _randomAvatars = [];
      for (let i = 10; i < 1009; i++) {
        _randomAvatars.push(`https://robohash.org/${i}`);
      }
      setRandomAvatars(_randomAvatars);
    }
  }, [user]);

  return (
    <>
      {isDeleteAccountClicked ? (
        <Delete
          handleDeleteButton={handleDeleteAccountButton}
          handleDeleteElement={handleDeleteUser}
          titleDescription={titleDescription}
          text={text}
        />
      ) : (
        <>
          <div className="background-color"></div>
          <section
            ref={ref}
            className={`profile ${darkMode ? "darkMode--light" : ""}`}>
            <aside
              className={`profile__avatar ${
                darkMode ? "darkMode--avatar-background" : ""
              } `}>
              <div className={`profile__avatar-wrapper `}>
                <button
                  onClick={handleChangeAvatarButton}
                  className={`profile__avatar-img-wrapper ${
                    isChangeAvatarClicked
                      ? "profile__avatar-img-wrapper--active"
                      : ""
                  } ${darkMode ? "darkMode--dark" : ""}`}>
                  <img
                    src={user && user.photoURL}
                    alt="avatar"
                    className={`profile__avatar-img ${
                      darkMode ? "darkMode--dark" : ""
                    }`}
                  />
                </button>
              </div>
              <div className="profile__avatar-wrapper profile__avatar-wrapper--name">
                <p className="profile__avatar-name">Welcome </p>
                <label
                  ref={refLabel}
                  htmlFor=""
                  className="profile__avatar-name-label">
                  {isChangeDisplayNameClicked ? (
                    <>
                      <input
                        value={displayName.toUpperCase()}
                        autoFocus
                        onChange={(e) => setDisplayName(e.target.value)}
                        type="text"
                        className="profile__avatar-name-input"
                      />
                      <div className="profile__avatar-edit-wrapper">
                        <button
                          onClick={handleUpdateDisplayName}
                          className="profile__avatar-edit">
                          <img
                            src={OK}
                            alt="edit"
                            className="profile__avatar-edit-img"
                          />
                        </button>
                        <button
                          onClick={handleCancelUpdateDisplayName}
                          className="profile__avatar-edit">
                          <img
                            src={X}
                            alt="edit"
                            className="profile__avatar-edit-img"
                          />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="profile__avatar-name">
                        {displayName && displayName.toUpperCase()}
                      </p>

                      <button
                        onClick={handleChangeDisplayNameClick}
                        className="profile__avatar-edit">
                        <img
                          src={EditPen}
                          alt="edit"
                          className="profile__avatar-edit-img"
                        />
                      </button>
                    </>
                  )}
                </label>
              </div>
            </aside>

            <aside className="profile__info">
              <div
                className={`profile__info-wrapper ${
                  isSettingsActive
                    ? "profile__info-wrapper--settings-active"
                    : ""
                }`}>
                {!isSettingsActive && (
                  <>
                    <div className="profile__info-title-wrapper">
                      <h2 className="profile__info-h2">Information</h2>
                    </div>
                    <div className="profile__info-content-wrapper">
                      <div className="profile__info-content">
                        <span
                          className={`profile__info-content-span ${
                            darkMode ? "darkMode--light" : ""
                          }`}>
                          Email
                        </span>
                        <p className="profile__info-content-p">
                          {user && user.email}
                        </p>
                      </div>
                      <div className="profile__info-content">
                        <span
                          className={`profile__info-content-span ${
                            darkMode ? "darkMode--light" : ""
                          }`}>
                          Example data
                        </span>
                        <p className="profile__info-content-p">
                          {userData &&
                          userData.length > 0 &&
                          userData[0].example
                            ? "Turned on"
                            : "Turned off"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {isChangeEmailClicked && (
                  <ChangeInfo
                    type="email"
                    handleBackButton={handleChangeEmailButton}
                  />
                )}
                {isChangePasswordClicked && (
                  <ChangeInfo
                    type="password"
                    handleBackButton={handleChangePasswordButton}
                  />
                )}
                {isChangeAvatarClicked && avatars && (
                  <div className="profile__settings-wrapper">
                    <div className="profile__info-title-wrapper">
                      <h2 className="profile__info-h2">Choose your avatar</h2>
                    </div>
                    <div className="profile__avatar-images-wrapper">
                      {avatars.map((avatar) => {
                        return (
                          <div
                            onClick={() => handleUpdateAvatar(avatar)}
                            key={avatar}
                            className="profile__avatar-img-pick-wrapper">
                            <img
                              src={avatar}
                              alt="avatar"
                              className={`profile__avatar-img-pick ${
                                darkMode ? "darkMode--dark" : ""
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="profile__avatar-random-wrapper">
                      <p className="profile__avatar-random-p">OR</p>
                      <div className="profile__avatar-random-img-wrapper">
                        <img
                          src={randomAvatar && randomAvatar}
                          onClick={() => handleUpdateAvatar(randomAvatar)}
                          alt="random avatar"
                          className={`profile__avatar-random-img ${
                            darkMode ? "darkMode--dark" : ""
                          }`}
                        />
                        <button
                          disabled={isRandomAvatarChanged}
                          onClick={handleChangeRandomAvatar}
                          className={`profile__avatar-random-button ${
                            isRandomAvatarChanged
                              ? "profile__avatar-random-button--disabled"
                              : ""
                          }`}>
                          <p className="profile__avatar-random-button-p">
                            Generate random avatar
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="profile__settings-wrapper">
                <div className="profile__info-title-wrapper">
                  <h2 className="profile__info-h2">Settings</h2>
                </div>

                <div className="profile__info-edit-wrapper">
                  <button
                    onClick={() => handleChangeEmailButton(true)}
                    disabled={isChangeEmailClicked}
                    className={`profile__info-edit-button ${
                      isChangeEmailClicked &&
                      "profile__info-edit-button--active"
                    }`}>
                    <p className="profile__info-edit-button-p">Change email</p>
                  </button>
                  <button
                    onClick={() => handleChangePasswordButton(true)}
                    disabled={isChangePasswordClicked}
                    className={`profile__info-edit-button ${
                      isChangePasswordClicked &&
                      "profile__info-edit-button--active"
                    }`}>
                    <p className="profile__info-edit-button-p">
                      Change password
                    </p>
                  </button>
                  <button
                    onClick={() => handleDeleteAccountButton(true)}
                    className="profile__info-edit-button profile__info-edit-button--delete">
                    <p className="profile__info-edit-button-p">
                      Delete account
                    </p>
                  </button>
                </div>
              </div>
            </aside>
          </section>
        </>
      )}
    </>
  );
}
