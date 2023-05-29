import axios from 'axios';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Row, Form, Input, Button, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';

const TeamListForm = () => {
  const [form] = useForm();

  const { eventName } = useParams();
  const { email } = useParams();

  const [playerCount, setPlayerCount] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (eventName === 'Football') {
      setPlayerCount(26);
    } else if (eventName === 'Cricket') {
      setPlayerCount(15);

    } else if (eventName === 'Basketball') {
      setPlayerCount(12);

    } else {
      setPlayerCount(14);

    }
  }, []);

  const onFinish = async (values) => {
    console.log('Form values:', values);
    console.log('details:')
    const details = values;

    for (const key of Object.keys(values)) {
      console.log(`${key}: ${values[key]}`);
    }
    try {
      setShowForm(true);
      const response = await axios.post(`http://localhost:5050/teamlistInfo/${eventName}/${email}`, {
        playerlist: values,
      });
      console.log("updated Data", response);
      message.success("Player list submitted successfully");
    } catch (error) {
      message.error("Error while submitting player list!");
    }

  };

  const onFinishFailed = () => {
    message.error("Please check if all fields are valid");
  }

  return (
    <div className='d-block justify-content-center align-items-center mt-4'>
      <div style={{ marginLeft: '400px' }}>
        <Form form={form} name="myForm" onFinish={onFinish} onFinishFailed={onFinishFailed}  >

          {Array.from({ length: playerCount }).map((_, index) => (
            <Row key={index} gutter={16}>
              <Form.Item label={` ${index + 1}`} name={`playerName${index + 1}`} >
              </Form.Item>
              <Form.Item label={`Name`} name={`playerName${index + 1}`} rules={[{ required: true, message: 'Please enter player name' }]}>
                <Input />
              </Form.Item>

              <Form.Item label={`Reg. no`} name={`registrationNumber${index + 1}`} rules={[{ required: true, message: 'Please enter registration number' }]}>
                <Input />
              </Form.Item>
            </Row>
          ))}

          <Form.Item>
            <Button className='ml-10' type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
      {showForm &&
        <div class="row justify-content-center">
          <br /><br />
          <div className='alert alert-success d-block justify-center text-center col-lg-6 mt-4' role="alert" alignment="center">
            Player list submitted successfully
          </div>
        </div>
      }
    </div>
  );
};

export default TeamListForm;
