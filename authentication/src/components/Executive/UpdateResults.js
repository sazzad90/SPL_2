import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';

const UpdateResults =() =>  {
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5050/updateResults')
      .then((response) => {
        setFormData(response.data);
        setIsLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) =>
      prevFormData.map((field) =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission or data processing here
    console.log(formData);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      {formData.map((field) => (
        <Row key={field.name}>
          <Col>
            <Form.Group controlId={field.name}>
              <Form.Label>{field.label}</Form.Label>
              <Form.Control
                type={field.type}
                name={field.name}
                value={field.value || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
      ))}

      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default UpdateResults;
