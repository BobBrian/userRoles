import React,{useRef, useState, useEffect} from 'react';
import { faCheck, faTimes, faInfoCircle, faWindowMaximize } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Register = () => {
    const userRef = useRef()
    const errRef = useRef()

    // user and password code
    // This is here to validate th input and capture it 
    // basically this is the suff showing up on servers
    // with express routes but more complex

    //These are the Validation Check Formats

    const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    const EML_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    

    //State Code For the User Data and Focusing On It

    const [user, SetUser] = useState('')
    const [validname, SetValidname] = useState(false)
    const [userfocus, SetUserFocus] = useState(false)

    //StateCode for the Email
    const [email, SetEmail] = useState('')
    const [validemail, SetValidEmail] = useState(false)
    const [emailfocus, SetEmailFocus] = useState(false)

    // State Code  for Password
    const [password, SetPassword] = useState('')
    const [validpassword, SetValidPassword] = useState(false)
    const [passwordfocus, SetPasswordFocus] = useState(false)

    // code to Validate Password
    const [matchingpassword, SetMatchingPassword] = useState('')
    const [validmatch, SetValidMatch] = useState(false)
    const [matchfocus, SetMatchFocus] = useState(false)

    // code for error messages
    const [errormessage, SetErrorMessage] = useState('')
    const [success, SetSuccess] = useState(false)

    //Test Credentials
    // Jaxie
    // Jaxie@gmail.com
    // Jaxie@123
    
    //useEffect to focus on the username -- change this for the typicall fetch routes
    useEffect(() =>{
        userRef.current.focus()
    },[])

    //check user
    useEffect(() => {

        const result = USER_REGEX.test(user)
        console.log(result)
        console.log(user)
        SetValidname(result)

    }, [user])


    //check pasword
    useEffect(() => {

        const result = PWD_REGEX.test(password)
        console.log(result)
        console.log(password)
        SetValidPassword(result)
        const match = password === matchingpassword
        SetValidMatch(match)

    }, [password ,matchingpassword])

    // check email
    useEffect(() => {

        const result = EML_REGEX.test(email)
        console.log(result)
        console.log(email)
        SetValidEmail(result)

    }, [email])

    //check name, password , email
    useEffect(() => {
        SetErrorMessage('')
    }, [user, email, password ,matchingpassword])

    // This is the Code that uses the axios and express format
    const handleSubmit = async (e) => {
        e.preventDefault();

        //The local validation check for the server
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(password);
        const v3 = EML_REGEX.test(email)
        if (!v1 || !v2 || !v3) {
            SetErrorMessage("Invalid Entry");
            return;
        }

        try {

            const body = { email, password, user};
            const response = await fetch("http://localhost:5000/data/register",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });

            // const response = await axios.post(REGISTER_URL,
            //     JSON.stringify({ user, email, password}),
            //     {
            //         headers: { 'Content-Type': 'application/json' },
            //         withCredentials: true
            //     }
            // );

            // console.log(response?.data);
            // //console.log(response?.accessToken);
            // console.log(JSON.stringify(response))
            SetSuccess(true);
            
        } catch (err) {

            if (!err?.response) {
                SetErrorMessage('No Server Response');
            } else if (err.response?.status === 409) {
                SetErrorMessage('Username Taken');
            } else {
                SetErrorMessage('Registration Failed')
            }
            
            errRef.current.focus();
            
        }
    }


  return (
 <> 
      {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
    <section>
        <p ref={errRef} className={errormessage ? "errormessage" : "offscreen"}>
            {errormessage}
        </p>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>

             {/* User or Username Section */}
            <label htmlFor='username'>
                Username:
                <FontAwesomeIcon icon={faCheck} className={validname ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validname || !user ? "hide" : "invalid"} />
            </label>

            <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => SetUser(e.target.value)}
                required
                aria-describedby='uidnote'
                aria-invalid={validname ? "false" : "true"}
                onFocus={() => SetUserFocus(true)}
                onBlur={() => SetUserFocus(false)}
            />

            {/* The Code Below is an Error Message that Is Shown if the Field Below is Empty */}

            <p id='uidnote' className={userfocus && user && !validname ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Email must be in the correct.<br/>
                Must begin with a Letter.<br/>
                letters,number, underscore hypen allowed.

            </p>
            
            {/* Email Section */}

            <label htmlFor="email">
               Email:
                <FontAwesomeIcon icon={faCheck} className={validemail? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validemail || !email? "hide" : "invalid"} />
            </label>
            
            <input
                type="email"
                id="email"
                onChange={(e) => SetEmail(e.target.value)}
                value={email}
                required
                aria-invalid={validpassword ? "false" : "true"}
                aria-describedby="emlnote"
                onFocus={() => SetEmailFocus(true)}
                onBlur={() => SetEmailFocus(false)}
            />
            <p id="emlnote" className={emailfocus && !validemail ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Email must be in the Correct Format.<br />
                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>
            
            {/* Password Section */}

            <label htmlFor="password">
                Password:
                <FontAwesomeIcon icon={faCheck} className={validpassword? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validpassword || !password ? "hide" : "invalid"} />
            </label>
            <input
                type="password"
                id="password"
                onChange={(e) => SetPassword(e.target.value)}
                value={password}
                required
                aria-invalid={validpassword ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => SetPasswordFocus(true)}
                onBlur={() => SetPasswordFocus(false)}
            />
            <p id="pwdnote" className={passwordfocus && !validpassword ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.<br />
                Must include uppercase and lowercase letters, a number and a special character.<br />
                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>

            {/*Confirm Password Section */}
            <label htmlFor="confirmpassword">
                Confirm Password:
                <FontAwesomeIcon icon={faCheck} className={validmatch && matchingpassword ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validmatch || !matchingpassword? "hide" : "invalid"} />
            </label>

            <input
                type="password"
                id="confirmpassword"
                onChange={(e) => SetMatchingPassword(e.target.value)}
                value={matchingpassword}
                required
                aria-invalid={validmatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => SetMatchFocus(true)}
                onBlur={() => SetMatchFocus(false)}
            />
            <p id="confirmnote" className={matchfocus && !validmatch ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
            </p>

            {/* Button Section */}
            <button disabled={!validname || !validpassword || !validmatch ? true : false}>Sign Up</button>
        </form>
    </section>
    )}
</>
  )
};

export default Register;
