import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
    const host = process.env.REACT_APP_API_URL;

    const [credentials, setCredentials] = useState({name: "", email: "", password: "", cpassword: ""})
    const navigate = useNavigate();
    const onChange = (e) => {
        const {name, value} = e.target;
        setCredentials({...credentials, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name, email, password, cpassword} = credentials
        if(password === cpassword) {
            const response = await fetch(`${host}/api/auth/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name, email, password})
            })
            const json = await response.json();
            if(json.success) {
                // Save the authtoken and redirect
                localStorage.setItem('token', json.authtoken);
                props.showAlert("Account Created Successfully", "success");
                navigate("/");
              }
              else {
                props.showAlert("Invalid Credentials", "danger");
              }
        }
        else {
            props.showAlert("Confirms Password does not match", "danger");
        }
    }

    return (
        <div className="container mt-2">
            <h2 className="my-3">Create an account to use iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="my-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name='name' aria-describedby="emailHelp" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} autoComplete='username' />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' onChange={onChange} autoComplete='new-password' minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} autoComplete='new-password'/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup