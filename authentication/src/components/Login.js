// import React, {useState} from 'react'
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import Axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Header from './Header';


// const Login = () => {

//     const [showForm, setShowForm] = useState(false);

//     const history = useNavigate();

//     const [fvalue, setFiledValue] = useState({
//         email: "",
//         password: "",
//         OTP: ""
//     })


//     const getData = (data) => {
//         const fieldName = data.target.name;
//         const fieldValue = data.target.value;

//         setFiledValue(() => {
//             return {
//                 ...fvalue,
//                 [fieldName]: fieldValue
//             }
//         })
//     }

//     const addData = (data) => {
//         data.preventDefault();

//         const { email, password } = fvalue;

//         if (email === "") {
//             alert("Email field is required.")
//         }
//         else if(!email.includes("@")){
//             alert("Enter a valid email address.")
//         }
//         else if (password === "") {
//             alert("Password field is required.")
//         }
//         else if(password.length<6){
//             alert('Password length must be at least 6')
//         }
//         else {
//             Axios.post("http://localhost:5050/get", {
//                 email: email,
//                 password: password
//             })
//             .then((response) => {
//                 if (response) {
//                  //   const pass = response.data[0].Password;
//                     console.log(response);

//                     if(response.data.sign){
//                         if (fvalue.OTP === "") {
//                             Axios.post("http://localhost:5050/authentication", {
//                                 email: email
//                             }).then((response) => {
//                                 fvalue.OTP = response.data
//                                 setShowForm(true)

//                             }).catch((err) => {
//                                 if (err) {
//                                     console.log(err);
//                                 }
//                             });
//                         }
//                         else {

//                             const otp = fvalue.enteredOTP
//                             const OTP = fvalue.OTP

//                             console.log(otp===OTP)

//                             if (otp === OTP) {
//                                 console.log('hi')
//                                 history('/Home' )
//                             }
//                         }

//                     }
//                     else{
//                         alert('Password wrong.')
//                         console.log('Password wrong.')
//                     }
//                  }
//             }).catch((err) => {
//                 if (err) {
//                     console.log(err);
//                 }
//             });
//         }

//     }

//     return (
//         <>
//         <Header/>

//             <div className='container mt-3'>
//                 <section>
//                     <div className='left_side mt-3'>
//                         <h3 className='text-center col-lg-12'>Sign in</h3>
//                         <Form>
//                             <Form.Group className="mb-3 col-lg-12" controlId="formBasicEmail">
//                                 <Form.Label>Email address</Form.Label>
//                                 <Form.Control type="email" name='email' onChange={getData} placeholder="Enter your email" />
//                             </Form.Group>

//                             <Form.Group className="mb-3 col-lg-12" controlId="formBasicPassword">
//                                 <Form.Label>Password</Form.Label>
//                                 <Form.Control type="password" name='password' onChange={getData} placeholder="Password" />
//                             </Form.Group>

//                             {showForm &&
//                                 <Form.Group className="mb-3 col-lg-12" controlId="formBasicOTP">
//                                     <Form.Label>OTP</Form.Label>
//                                     <Form.Control type="enteredOTP" name='enteredOTP' onChange={getData} placeholder="Enter OTP" />
//                                 </Form.Group>
//                             }


//                             <Button variant="primary" className='col-lg-6' onClick={addData} type="submit">
//                                 Submit
//                             </Button>
//                         </Form>

//                     </div>
//                     <div className='right_side'>

//                         <div className='vulnerability'>
//                             <img src='/authentication/images/vulnerability.jpg' alt='' />
//                         </div>
//                     </div>
//                 </section>
//             </div>
//         </>
//     )
// }

// export default Login




import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import AuthService from './AuthService';
import './login.css';
import { Modal } from 'antd';
import Link from 'antd/es/typography/Link';
import ForgetPassword from './ForgetPassword';

const Login = () => {

    const history = useNavigate();
    const [forgottenPasswordModal, setForgottenPasswordModal] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState('');
    const [errorDivShow, setErrorDivShow] = useState(false);



    const handleChange = (data) => {
        const fieldName = data.target.name;
        const fieldValue = data.target.value;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: fieldValue,
        }));
    }


    const handleSubmit = (data) => {
        data.preventDefault();

        const { email, password } = formData;

        let errors = {};
        if (!email) {
            errors.email = 'Email field is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Enter a valid email address.';
        }
        if (!password) {
            errors.password = 'Password field is required.';
        }

        setFormErrors(errors)

        if (Object.keys(errors).length <= 1) {
            console.log(email, password)
            Axios.post("http://localhost:5050/get", {
                email: email,
                password: password
            })
                .then((response) => {
                    console.log(response.data.sign);
                    if (response.data.sign && response.data.length !== 0) {
                        const UserID = response.data.result[0].UserType
                        const token = response.data.token
                        const email = response.data.result[0].Email
                        console.log(token)

                        if (token) {
                            if (UserID == 'executive') {
                                console.log("in here", UserID);
                                AuthService.setToken(token)
                                history(`/Home/${email}`);
                            }
                            else if (UserID == 'head') {
                                console.log("in here", UserID);
                                AuthService.setToken(token)
                                history(`/DeptHeadHome/${email}`);
                            }
                            else if (UserID == 'student advisor') {
                                console.log("in here", UserID);
                                AuthService.setToken(token)
                                history(`/AdvisorHome/${email}`);
                            }
                            else if (UserID == 'pec head') {
                                console.log("in here", UserID);
                                AuthService.setToken(token)
                                history(`/PECHome/${email}`);
                            }
                        }
                        else {
                            setError('Login Error! Please try again.')
                            setErrorDivShow(true)
                        }
                    }
                    else if (!response.data) {
                        setError('Wrong input! Please try again.')
                        setErrorDivShow(true)
                    }
                }).catch((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
        }

    }

    function handleForgetPasswordModalCancel() {
        setForgottenPasswordModal(false);
    }

    function handleForgetPassword() {
        setForgottenPasswordModal(true);
    }

    return (
        <>
            <Header />
            <div className='container d-flex justify-content-start' style={{ marginTop: '100px', width: '100%' }}>
                {/* <section> */}
                <div className='rounded' style={{ backgroundColor: '#0A4770', width: '30%', height: '400px', color: 'white' }}>
                    <h3 className='text-center col-lg-12 mt-3'>Sign In</h3>
                    <Form onSubmit={handleSubmit} style={{ width: '80%', marginLeft: '20px' }}>

                        <Form.Group className='mb-3 col-lg-12' controlId='formBasicEmail'>
                            <Form.Label className='mt-3'><strong>Email address </strong></Form.Label>
                            <Form.Control
                                type='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                placeholder='Enter your email'
                                isInvalid={!!formErrors.email}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                            className='mb-3 col-lg-12'
                            controlId='formBasicPassword'
                        >
                            <Form.Label className='mt-3'> <strong>Password </strong></Form.Label>
                            <Form.Control
                                type='password'
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                                isInvalid={!!formErrors.password}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {errorDivShow &&
                            <Alert variant="danger" className='mb-3 col-lg-12' onClose={() => setErrorDivShow(false)} dismissible>
                                {error}
                            </Alert>
                        }

                        <Button variant="primary form-group-hover" style={{ marginTop: "30px", marginLeft: '90px' }} className='col-lg-5' onClick={handleSubmit} type="submit">
                            Sign In
                        </Button>

                        <div className="register-link" style={{ marginTop: '24px', fontSize: '18px' }}>
                            <Link onClick={handleForgetPassword}>Forgotten Password?</Link>
                        </div>
                    </Form>
                </div>
                {/* </section> */}
            </div>

            <Modal
                visible={forgottenPasswordModal}
                title="Change Password"
                onCancel={handleForgetPasswordModalCancel}
                footer={null}
            >
                <ForgetPassword />
            </Modal>
        </>
    )
}

export default Login