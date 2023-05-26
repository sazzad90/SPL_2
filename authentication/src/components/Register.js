import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Header from './Header';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        employeeID: '',
        email: '',
        password: '',
        retypedPassword: '',
        enteredOTP: '',
        OTP: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [showOtpField, setShowOtpField] = useState(false)
    const [error, setError] = useState('');
    const [errorDivShow, setErrorDivShow] = useState(false);

    const history = useNavigate();

    const handleChange = (event) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: fieldValue,
        }));
    };


    const sendOTP = (email) => {
        axios.post("http://localhost:5050/authentication", {
            email: email
        }).then((response) => {
            formData.OTP = response.data
            setShowOtpField(true)

        }).catch((err) => {
            if (err) {
                console.log(err);
            }
        });
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        const { employeeID, email, password, retypedPassword, enteredOTP } = formData;

        // validate form fields
        let errors = {};
        if(!employeeID){
            errors.employeeID = 'Employee ID is required.';
        }
        else {
            axios.post('http://localhost:5050/checkEmployeeID', {
                employeeID: employeeID,
            }).then(response => {
                if (response.data === 'Invalid Employee ID'){
                    errors.employeeID = response.data;
                }else{
                    if (response.data === 'Invalid email ID'){
                        errors.email = response.data;
                    }else{
                        console.log(response.data);
                    }
                }
            })
        }

        if (!email) {
            errors.email = 'Email field is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Enter a valid email address.';
        }else{
            axios.post('http://localhost:5050/checkEmail', {
                email: email,
                employeeID: employeeID,

            }).then(response => {
                if (response.data === 'Invalid Email ID'){
                    errors.email = response.data;
                }else{
                    console.log(response.data);
                }
            })
        }


        if (!password) {
            errors.password = 'Password field is required.';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters.';
        }
        if (!retypedPassword) {
            errors.retypedPassword = 'Please retype your password.';
        } else if (password !== retypedPassword) {
            errors.retypedPassword = 'Passwords do not match.';
        }

        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {

            if (!formData.OTP) {
                sendOTP(email)
            }
            else {
                const otp = formData.enteredOTP
                const OTP = formData.OTP.toString()

                if (!enteredOTP) {
                    setError('OTP field is required.')
                    setErrorDivShow(true)
                }
                else {
                    console.log(otp, OTP)

                    if (otp === OTP) {
                        try {
                            const response = await axios.post('http://localhost:5050/createToken');
                            const { userID, token, secretKey } = response.data;

                            try {
                                const response = await axios.post('http://localhost:5050/submit', {
                                    employeeID,
                                    email,
                                    password,
                                    userID,
                                    token,
                                    secretKey
                                });
                                if (response.status === 200) {
                                    history('/Login');
                                }
                            } catch (error) {
                                console.log(error);
                            }

                        } catch (error) {
                            console.log(error)
                        }
                    }
                    else {
                        setError('Wrong OTP. Please try again.')
                        setErrorDivShow(true)
                    }
                }
            }
        }
    };

    return (
        <>
            <Header />
            <div className='container mt-3'>
                <section>
                    <div className='left_side mt-3'>
                        <h3 className='text-center col-lg-12'>Sign Up</h3>
                        <Form onSubmit={handleSubmit}>

                        <Form.Group className='mb-3 col-lg-12' controlId='formBasicEmail'>
                            <Form.Label>Employee ID</Form.Label>
                            <Form.Control
                                name='employeeID'
                                type='number'
                                value={formData.employeeID}
                                onChange={handleChange}
                                placeholder='Enter your Employee ID'
                                isInvalid={!!formErrors.employeeID}
                            >
                            </Form.Control>
                            <Form.Control.Feedback type='invalid'>
                                {formErrors.employeeID}
                            </Form.Control.Feedback>
                        </Form.Group>

                            <Form.Group className='mb-3 col-lg-12' controlId='formBasicEmail'>
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type='text'
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
                                <Form.Label>Password</Form.Label>
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


                            <Form.Group
                                className='mb-3 col-lg-12'
                                controlId='formBasicRetypedPassword'
                            >
                                <Form.Label>Re-Type Password</Form.Label>
                                <Form.Control
                                    type='password'
                                    name='retypedPassword'
                                    value={formData.retypedPassword}
                                    onChange={handleChange}
                                    placeholder='Retype your password'
                                    isInvalid={!!formErrors.retypedPassword}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {formErrors.retypedPassword}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {showOtpField &&
                                <Form.Group
                                    className='mb-3 col-lg-12'
                                    controlId='formBasicOTP'
                                >
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='enteredOTP'
                                        value={formData.enteredOTP}
                                        onChange={handleChange}
                                        placeholder='Enter OTP (One-Time-Password)'
                                        isInvalid={!!formErrors.enteredOTP}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {formErrors.enteredOTP}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            }

                            {errorDivShow &&
                                <Alert variant="danger" className='mb-3 col-lg-4' onClose={() => setErrorDivShow(false)} dismissible>
                                    {error}
                                </Alert>
                            }

                            <Button variant="primary" className='col-lg-4' onClick={handleSubmit} type="submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Register