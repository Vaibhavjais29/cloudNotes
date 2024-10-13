import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
  const host = process.env.REACT_APP_API_URL;
  
    const [credentials, setCredentials] = useState({email: "", password: ""});
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password}),
          });
          const json = await response.json();
          if(json.success) {
            // Save the authtoken and redirect
            localStorage.setItem('token', json.authtoken);
            navigate("/");
            props.showAlert("Logged in Successfully", "success");
          }
          else {
            props.showAlert("Invalid Details", "danger");
          }
          
    }

    const onChange = (event) => {
        const {name, value} = event.target;
        setCredentials({...credentials, [name] : value});
      }
    return (
        <div className='container mt-3'>
          <h2 className="my-3">Login to continue to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="my-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" value={credentials.email} onChange={onChange} autoComplete='username' />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChange} autoComplete='current-password'/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login