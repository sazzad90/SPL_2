import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, message, Row, Col } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import axios from 'axios';

const { Option } = Select;

const UpdateResults = () => {
  const [form] = useForm();
  const [matches,setMatches] = useState([]);

  useEffect(() => {
    const getFields = async() =>{
      try {
        const {data:tempMatches} = await axios.get('http://localhost:5050/updateResults');
        setMatches(tempMatches);
      } catch (error) {
        message.error("Something went wrong on server side...")
      }
    }
    getFields();
  }, []);


  const handleSubmit = async(values) => {
    console.log('Form values:', values);
    
    matches.map((match,index) => {
    //  match.fixtureID = matches[index].fixtureID;
      match.score1 = values[index].score1;
      match.score2 = values[index].score2;
      match.winner = values[index].winner;
    })
    console.log("matches",matches);

    try {
      const response = await axios.post("http://localhost:5050/updateResults",{
          matches:matches,
      });
      console.log("updated Data",response);
      message.success("Data updated successfully");
    } catch (error) {
      message.error("Error while updating matches data");
    }
  };

  const onFinishFailed = () => {
    message.error("Please check if all fields are valid");
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop : '50px',}}>
      <Form form={form} onFinish={handleSubmit} onFinishFailed={onFinishFailed} style={{ maxWidth: '600px' }}>
        {matches.map((team, index) => (
          <Row key={index} gutter={16} style = {{marginTop : '20px'}}>
            
            {/* <Form.Item key={index}> */}
              <Col span={8}>
              <Form.Item
                name={[index, 'score1']}
                label={`${team.team1}`}
                rules={[{ required: true, message: 'Please enter the Team 1 score' }]}
                style={{ maxWidth: '200px' }}
              >
                <Input placeholder="Team 1 Score" />
              </Form.Item>
              </Col>

              <Col span={8}>
              <Form.Item
                name={[index, 'score2']}
                label={`${team.team2}`}
                rules={[{ required: true, message: 'Please enter the Team 2 score' }]}
                style={{ maxWidth: '200px' }}
              >
                <Input placeholder="Team 2 Score" />
              </Form.Item>
              </Col>
         
              <Col span={8}>
              <Form.Item
                name={[index, 'winner']}
                label="Winner"
                rules={[{ required: true, message: 'Please select the winner' }]}
                style={{ maxWidth: '200px' }}
              >
                <Select placeholder="Select Winner">
                  <Option value={team.team1}>{team.team1}</Option>
                  <Option value={team.team2}>{team.team2}</Option>
                  <Option value="draw">Draw</Option>
                </Select>
              </Form.Item>
              </Col>
              
        
            {/* </Form.Item> */}
          </Row>
        ))}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateResults;






// import {Form, Input, Row, message,Col, Button} from 'antd';
// import axios from 'axios';
// import { useEffect, useState } from 'react';

// export default function UpdateResults(){
//   const [form] = Form.useForm();
//   const [matches,setMatches] = useState([]);

//   useEffect(() => {
//     const getFields = async() =>{
//       try {
//         const {data:tempMatches} = await axios.get('http://localhost:5050/updateResults');
//         console.log(tempMatches);
//         setMatches(tempMatches);
//       } catch (error) {
//         message.error("Something went wrong on server side...")
//       }
//     }
//     getFields();
//   }, []);


//   const onFinish = (values) =>{
//     console.log(values);
    
//   }
//   const onFinishFailed = () => {
//     message.error("Please check if all fields are valid...")
//   }


//   return (
//   <Row justify='center' align='middle'>
//     <Col xs={20} sm={12}>
//       <Form onFinish={onFinish}>
//         <Input.Group compact>
//           <Form.Item name={['user', 'firstName']} noStyle>
//             <Input placeholder="First Name" />
//           </Form.Item>
//           <Form.Item name={['user', 'lastName']} noStyle>
//             <Input placeholder="Last Name" />
//           </Form.Item>
//         </Input.Group>

//         <Input.Group>
//           <Form.Item name="age" rules={[{ required: true, message: 'Please enter your age' }]}>
//             <Input placeholder="Age" />
//           </Form.Item>
//           <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
//             <Input placeholder="Email" />
//           </Form.Item>
//         </Input.Group>

//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             Submit
//           </Button>
//         </Form.Item>
//     </Form>
//     </Col>
//   </Row>)
// }



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Form, Row, Col, Button } from 'react-bootstrap';

// const UpdateResults = () => {
//   const [formData, setFormData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [checked,setChecked] = useState([false]);
 
  // useEffect(() => {
  //   axios
  //     .get('http://localhost:5050/updateResults')
  //     .then((response) => {
  //       setFormData(
  //         response.data.map((field) => ({
  //           ...field,
  //           score1: '',
  //           score2: '',
  //           fixtureID:'',
  //           winner : '',
  //           checked1: false,
  //           checked2 : false,
  //         }))
  //       );
  //       setIsLoading(false);
  //       console.log("response data",response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

//   const handleChange = (e, index) => {
//     const { name, value } = e.target;
//     console.log(formData)
//     setFormData((prevFormData) =>
//       prevFormData.map((field, i) =>
//         i === index ? { ...field,  [name]: value } : field
//       )
//     );
//   };

//   const handleSubmit = (e) => {
//     console.log("onsubmit",e.target);
//     e.preventDefault();
//     // formData.forEach((field) => {
//     //   console.log(`${field.name}: ${field.team1}, ${field.team2}, ${field.score1}, ${field.score2}`);
      
//     // });

//     const dataObject = {};

// formData.forEach((field) => {
//   const { name,team1,team2, score1, score2,checked, winner } = field;
//   if (!dataObject[name]) {
//     dataObject[name] = [];
//   }

//   dataObject[name].push({team1,team2,  score1, score2,checked, winner });
// });

// console.log(dataObject); 
//       axios.post('http://localhost:5050/updateResults',{
//         dataObject:dataObject,
//     })
//       .then((response) => {

//         })
//         .catch((error) => {
//           console.log(error);
//         });
//   };

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <>
//       <div className='d-flex justify-content-center mt-3'>
//         <h2>Update results</h2>
//       </div>
//       <div className='d-flex justify-content-center' style={{ marginLeft: '400px' }}>
//         <Form onSubmit={handleSubmit} className='w-70'>
//           {formData.map((field, index) => (
//             <Row key={index} className='w-50' style={{ marginTop: '30px' }}>
//               <Row key={field.fixtureID}>
//                 <Col>
//                   <Form.Group controlId={field.name} className='text-center ml-2'>
//                     <Form.Label className='text-center'>{field.team1}</Form.Label>
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                   <input
//                     key = {field.team1}
//                     type='radio'
//                     name={'winner'}
//                     checked={checked[index]}
//                     value={field.team1}
//                     onChange={ (e) => handleChange(e, index)}
//                   />
//                 </Col>
//                 <Col>
//                   <Form.Group controlId={field.name} className='text-center'>
//                     <Form.Label className='text-center'>{field.team2}</Form.Label>
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                   <input
//                     key = {field.team2}
//                     type='radio'
//                     name={'winner'}
//                     checked = {field.winner === field.team2}
//                     value={field.team2}
//                     onChange={(e) => handleChange(e, index)}
//                   />
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <Form.Control
//                     className='text-center'
//                     type='text'
//                     name={`score1`}
//                     placeholder='Enter score'
//                     value={field.score1}
//                     onChange={(e) => handleChange(e, index)}
//                   />
//                 </Col>
//                 <Col>
//                   <Form.Control
//                     className='text-center'
//                     type='text'
//                     name={`score2`}
//                     placeholder='Enter score'
//                     value={field.score2}
//                     onChange={(e) => handleChange(e, index)}
//                   />
//                 </Col>
//               </Row>
//             </Row>
//           ))}

//           <Button type='submit' className='mt-3' style={{ float: 'right', marginRight: '365px' }}>
//             Submit
//           </Button>
//         </Form>
//       </div>
//     </>
//   );
// };

// export default UpdateResults;
