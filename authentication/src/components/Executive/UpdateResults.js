// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Form, Row, Col, Button } from 'react-bootstrap';

// const UpdateResults = () => {
//   const [formData, setFormData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get('http://localhost:5050/updateResults')
//       .then((response) => {
//         const initialFormData = response.data.map((field) => ({
//           ...field,
//           checkboxes: [
//             { name: `${field.name}-checkbox1`, value: false },
//             { name: `${field.name}-checkbox2`, value: false },
//           ],
//         }));
//         setFormData(initialFormData);
//         setIsLoading(false);
//         console.log(response.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);
  
//   let updatedFormData = [...formData];
//   const handleChange = (e, index, checkboxIndex) => {
//     console.log("e : " + e.target);
//         const { name, value, type, checked } = e.target;

//     if (type === 'checkbox') {
//       updatedFormData[index].checkboxes[checkboxIndex] = {
//         ...updatedFormData[index].checkboxes[checkboxIndex],
//         value: checked,
//       };
//     } else {
//       updatedFormData[index] = {
//         ...updatedFormData[index],
//         value,
//       };

//     }
//     setFormData(updatedFormData);
//     console.log("updated data : " + updatedFormData[1].value);
//     console.log("form data : " + formData[1].value);
//   };
  
  

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Access field values and checkbox values
//     // console.log("form data : " + formData[0].value );
//     updatedFormData.forEach((field) => {
//       console.log('here');
//       console.log(field);

       
//       field.checkboxes.forEach((checkbox) => {
//         console.log(`${checkbox.name}: ${checkbox.value}`);
//       });
//     });
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
//               <Row>
//                 <Col>
//                   <Form.Group controlId={field.name} className='text-center ml-2'>
//                     <Form.Label className='text-center'>{field.team1}</Form.Label>
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                 <Form.Check
//   type='checkbox'
//   id={`checkbox1-${index}`}
//   name={field.checkboxes[0].name}
//   checked={field.checkboxes[0].value}
//   onChange={(e) => handleChange(e, index, 0)}
// />


//                 </Col>
//                 <Col>
//                   <Form.Group controlId={field.name} className='text-center'>
//                     <Form.Label className='text-center'>{field.team2}</Form.Label>
//                   </Form.Group>
//                 </Col>
//                 <Col>
//                 <Form.Check
//   type='checkbox'
//   id={`checkbox2-${index}`}
//   name={field.checkboxes[1].name}
//   checked={field.checkboxes[1].value}
//   onChange={(e) => handleChange(e, index, 1)}
// />


//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   <Form.Control
//                     className='text-center'
//                     type='text'
//                     name={field.name}
//                     placeholder='Enter score'
//                     onChange={(e) => handleChange(e, index)}
//                   />
//                 </Col>
//                 <Col>
//                   <Form.Control
//                     className='text-center'
//                     type='text'
//                     name={field.name}
//                     placeholder='Enter score'
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







import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';

const UpdateResults = () => {
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5050/updateResults')
      .then((response) => {
        setFormData(
          response.data.map((field) => ({
            ...field,
            score1: '',
            score2: '',
            fixtureID:'',
          }))
        );
        setIsLoading(false);
        console.log(formData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevFormData) =>
      prevFormData.map((field, i) =>
        i === index ? { ...field, [name]: type === 'checkbox' ? checked : value } : field
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // formData.forEach((field) => {
    //   console.log(`${field.name}: ${field.team1}, ${field.team2}, ${field.score1}, ${field.score2}`);
      
    // });

    const dataObject = {};

formData.forEach((field) => {
  const { name,team1,team2, score1, score2,checked } = field;
  if (!dataObject[name]) {
    dataObject[name] = [];
  }

  dataObject[name].push({team1,team2,  score1, score2,checked });
});

console.log(dataObject);

    
      axios.post('http://localhost:5050/updateResults',{
        dataObject:dataObject,
    })
      .then((response) => {

        })
        .catch((error) => {
          console.log(error);
        });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className='d-flex justify-content-center mt-3'>
        <h2>Update results</h2>
      </div>
      <div className='d-flex justify-content-center' style={{ marginLeft: '400px' }}>
        <Form onSubmit={handleSubmit} className='w-70'>
          {formData.map((field, index) => (
            <Row key={field.name} className='w-50' style={{ marginTop: '30px' }}>
              <Row>
                <Col>
                  <Form.Group controlId={field.name} className='text-center ml-2'>
                    <Form.Label className='text-center'>{field.team1}</Form.Label>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Check
                    type='checkbox'
                    id={`checkbox1-${index}`}
                    name={`checkbox1-${index}`}
                    checked={field[`checkbox1-${index}`]}
                    value={field.checked}
                    onChange={(e) => handleChange(e, index)}
                  />
                </Col>
                <Col>
                  <Form.Group controlId={field.name} className='text-center'>
                    <Form.Label className='text-center'>{field.team2}</Form.Label>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Check
                    type='checkbox'
                    id={`checkbox2-${index}`}
                    name={`checkbox2`}
                    checked={field[`checkbox2-${index}`]}
                    value={field.checked}
                    onChange={(e) => handleChange(e, index)}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Control
                    className='text-center'
                    type='text'
                    name={`score1`}
                    placeholder='Enter score'
                    value={field.score1}
                    onChange={(e) => handleChange(e, index)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    className='text-center'
                    type='text'
                    name={`score2`}
                    placeholder='Enter score'
                    value={field.score2}
                    onChange={(e) => handleChange(e, index)}
                  />
                </Col>
              </Row>
            </Row>
          ))}

          <Button type='submit' className='mt-3' style={{ float: 'right', marginRight: '365px' }}>
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
};

export default UpdateResults;
