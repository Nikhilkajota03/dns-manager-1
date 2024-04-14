import "../index.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const URL = "http://localhost:8080";


const Signin = () => {
  const navigate = useNavigate();

  const [email, setemail] = useState();
  const [password, setpassword] = useState();

  const addAdmin = async (e) => {
    e.preventDefault();

    if ( !email || !password) {
      message.error("Please enter a  email  and password.");
      return;
    }

    try {
      const add = await axios.post(`${URL}/api/v1/users/login`, {
        email,
        password,
      });

      const { data } = add;

      // Destructure data from the response

      console.log(data);

      if (data.token) {
        message.success("User logged in");

        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.userId));

        setemail("");
        setpassword("");

        console.log("login Success");

        navigate("/");
      } else {
        message.error("Please check credentials");
      }
    } catch (error) {
      console.log(error.Response);
      message.error("wrong credentials");
    }
  };

  return (
    <>
      {/* <!-- component --> */}

      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg dark:border dark:border-gray-700 p-8">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            {/* <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" /> */}
          </a>
          <div className="space-y-4">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  value={email}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  onChange={(e) => setemail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  value={password}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setpassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full  text-black bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={addAdmin}
              >
                Sign in
              </button>

              <p className="text-lg font-light text-gray-900 dark:text-gray-600">
                Don’t have an account yet?{" "}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signin;
