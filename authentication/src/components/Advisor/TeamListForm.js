// import { Form, Input, Button, Select, message, Row, Col } from 'antd';
// import { useForm } from 'antd/lib/form/Form';
// import axios from 'axios';


// const { Option } = Select;

// const TeamListForm = () => {
//     const {eventName} = useParams();
//     console.log('e: ',eventName);

//   const [form] = useForm();
//   const [matches,setMatches] = useState([]);
//   const [playerCount,setplayerCount] = useState(null);

//   useEffect(() => {
//     if(eventName === 'Football'){
//         setplayerCount(26);
//     }else if(eventName === 'Cricket'){
//         setplayerCount(15);

//     }else if(eventName === 'Basketball'){
//         setplayerCount(12);

//     } else{
//         setplayerCount(14);

//     }
//  }, []);

 
  
//   // Function to handle input changes
//   const handleInputChange = (event) => {
//     const { value } = event.target;
//     setplayerCount(value);
//   };

//   const handleSubmit = async(values) => {
//     console.log('Form values:', values);
    
//     matches.map((match,index) => {
//     //  match.fixtureID = matches[index].fixtureID;
//       match.score1 = values[index].score1;
//       match.score2 = values[index].score2;
//       match.winner = values[index].winner;
//     })
//     console.log("matches",matches);

//     try {
//       const response = await axios.post("http://localhost:5050/updateResults",{
//           matches:matches,
//       });
//       console.log("updated Data",response);
//       message.success("Data updated successfully");
//     } catch (error) {
//       message.error("Error while updating matches data");
//     }
//   };

//   const onFinishFailed = () => {
//     message.error("Please check if all fields are valid");
//   }

//   return (
//     // <div style={{ display: 'flex', justifyContent: 'center' }}>
//     //   <Form form={form} onFinish={handleSubmit} onFinishFailed={onFinishFailed} style={{ maxWidth: '600px' }}>
//     //     {matches.map((team, index) => (
//     //       <Row key={index} gutter={16}>
//     //         <Form.Item key={index}>
            
//     //           <Form.Item
//     //             name={[index, 'score1']}
//     //             label={`${team.team1}`}
//     //             rules={[{ required: true, message: 'Please enter the Team 1 score' }]}
//     //             style={{ maxWidth: '200px' }}
//     //           >
//     //             <Input placeholder="Team 1 Score" />
//     //           </Form.Item>
           
           
//     //           <Form.Item
//     //             name={[index, 'score2']}
//     //             label={`${team.team2}`}
//     //             rules={[{ required: true, message: 'Please enter the Team 2 score' }]}
//     //             style={{ maxWidth: '200px' }}
//     //           >
//     //             <Input placeholder="Team 2 Score" />
//     //           </Form.Item>
         
            
//     //           <Form.Item
//     //             name={[index, 'winner']}
//     //             label="Winner"
//     //             rules={[{ required: true, message: 'Please select the winner' }]}
//     //             style={{ maxWidth: '200px' }}
//     //           >
//     //             <Select placeholder="Select Winner">
//     //               <Option value={team.team1}>{team.team1}</Option>
//     //               <Option value={team.team2}>{team.team2}</Option>
//     //               <Option value="draw">Draw</Option>
//     //             </Select>
//     //           </Form.Item>
        
//     //         </Form.Item>
//     //       </Row>
//     //     ))}

//     //     <Form.Item>
//     //       <Button type="primary" htmlType="submit">
//     //         Submit
//     //       </Button>
//     //     </Form.Item>
//     //   </Form>
//     // </div>

//     <form onSubmit={handleSubmit}>
//     <label>
//       Player Count:
//       <input type="number" value={playerCount} onChange={handleInputChange} />
//     </label>

//     <button type="submit">Submit</button>

//     {/* Render multiple form rows based on playerCount */}
//     {playerCount > 0 && (
//       <div>
//         <h3>Player Details</h3>
//         {Array.from({ length: playerCount }).map((_, index) => (
//           <div key={index}>
//             <label>
//               Player {index + 1} Name:
//               <input type="text" name={`player${index + 1}`} />
//             </label>
//             <br />
//           </div>
//         ))}
//       </div>
//     )}
//   </form>

//   );
// };

// export default TeamListForm;


import axios from 'axios';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Row,Form, Input, Button } from 'antd';

const TeamListForm = () => {
    const {eventName} = useParams();
    const {email} = useParams();

  const [playerCount, setPlayerCount] = useState(0);

    useEffect(() => {
    if(eventName === 'Football'){
        setPlayerCount(26);
    }else if(eventName === 'Cricket'){
        setPlayerCount(15);

    }else if(eventName === 'Basketball'){
        setPlayerCount(12);

    } else{
        setPlayerCount(14);

    }
 }, []);

  const onFinish =async (values) => {
    console.log('Form values:', values);
    console.log('details:')
    const details = values;

    for (const key of Object.keys(values)) {
        console.log(`${key}: ${values[key]}`);
      }
    try {
        const response = await axios.post(`http://localhost:5050/teamlistInfo/${eventName}/${email}`,{
            playerlist:values,
        });
        console.log("updated Data",response);
        // message.success("Data updated successfully");
      } catch (error) {
        // message.error("Error while updating matches data");
      }
    
};

  return (
    <div className='d-flex justify-content-center'>
    <Form name="myForm" onFinish={onFinish}>

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
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default TeamListForm;
