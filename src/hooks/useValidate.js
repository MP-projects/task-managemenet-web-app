

export const useValidate = () => {
  const validate = (name, value) => {
    let error = "";
    if (value) {
      switch (name) {
        case "name":
          if (value.length < 3) {
            error = "Name should be atleast 3 characters";
          }
          if (value.length > 15) {
            error = "Name should be maximum 15 characters";
          }
          break;
        case "column":
          if (value.length > 15) {
            error = "Column name should be maximum 15 characters";
          }
          break;
        case "email":
          if (
            !new RegExp(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ).test(value)
          ) {
            error = "Enter a valid email address";
          }
          if (value.length > 40) {
            error = "Email should be maximum 40 characters";
          }
          break;
        case "password":
          if (value.length < 6) {
            error = "Password should be atleast have 6 characters";
          }
          if (value.length > 12) {
            error = "Password should be maximum 12 characters";
          }
          break;
        case "title":
          if (value.length > 100) {
            error = "Max 100 characters";
          }
          break;
        case "description":
          if (value.length > 250) {
            error = "Max 250 characters";
          }
          break;
        case "text":
          if (value.length > 100) {
            error = "Max 100 characters";
          }
          break;
        case "message":
          if (value.length > 5000) {
            error = "Max 5000 characters";
          }
          break;
        default:
          error = "";
          break;
      }
    } else if (name === "description") {
      error = "";
      return;
    } else {
      error = "Can't be empty";
      return error;
    }

    return error;
  };

  return { validate };
};
