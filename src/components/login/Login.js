import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [username, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isUserPasswordValid, setIsUserPasswordValid] = useState(true);
  const [passwordValidationError, setPasswordValidationError] = useState("");
  const [isUserNameValid, setIsUserNameValid] = useState(true);
  const [userNameValidationError, setUserNameValidationError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const ProceedLogin = (e) => {
    e.preventDefault();

    if (validatePassword()) {
      fetch("http://localhost:8000/user/" + username)
        .then((res) => {
          return res.json();
        })
        .then((resp) => {
          if (Object.keys(resp).length === 0) {
            setIsUserNameValid(false);
            setUserNameValidationError("Enter valid name");
          } else {
            if (resp.password === userPassword) {
              sessionStorage.setItem("username", username);
              sessionStorage.setItem("userrole", resp.role);
              navigate("/table");
            } else {
              setIsUserPasswordValid(false);
              setPasswordValidationError("Invalid Credential");
              console.error("Please Enter valid credentials");
            }
          }
        })
        .catch((err) => {
          console.error("Login Failed due to :" + err.message);
        });
    }
  };

  // this code can be use to login the user by calling the actual api,
  //   and it will store the jwt token in session storage.
  const loginByCallingApi = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      const inputobj = { username, userPassword };
      fetch("https://localhost:44308/User/Authenticate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(inputobj),
      })
        .then((res) => {
          return res.json();
        })
        .then((resp) => {
          console.log(resp);
          if (Object.keys(resp).length === 0) {
            console.error("Login failed, invalid credentials");
          } else {
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("jwttoken", resp.jwtToken);
            navigate("/");
          }
        })
        .catch((err) => {
          console.error("Login Failed due to :" + err.message);
        });
    }
  };
  const validatePassword = () => {
    let result = true;
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(userPassword);
    const hasLowercase = /[a-z]/.test(userPassword);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(
      userPassword
    );

    if (username === "" || username === null) {
      result = false;
      setIsUserNameValid(false);
      setUserNameValidationError("Enter valid name"); // Here we can use some meaningful message to the user
    }

    const isPasswordValid =
      userPassword.length >= minLength &&
      hasUppercase &&
      hasLowercase &&
      hasSpecialChar;

    if (!isPasswordValid) {
      setIsUserPasswordValid(false);
      setPasswordValidationError("Invalid password"); // Here we can use some meaningful message to the user
      return result;
    } else {
      setIsUserPasswordValid(true);
      setPasswordValidationError("");
      result = isPasswordValid;
    }

    return result;
  };
  return (
    <div className="login-wrapper">
      <form className="login_form_container">
        <div className="login_form">
          <h2>Login</h2>
          <div className="input_group">
            <input
              type="text"
              placeholder="Username"
              className="input_text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <p className="password_error">
            {!isUserNameValid && userNameValidationError}
          </p>
          <div className="input_group">
            <input
              type="password"
              placeholder="Password"
              className="input_text"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>
          <p className="password_error">
            {!isUserPasswordValid && passwordValidationError}
          </p>
          <div className="button_group" id="login_button">
            <a onClick={ProceedLogin}>Submit</a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
