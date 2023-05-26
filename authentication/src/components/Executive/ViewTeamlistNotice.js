import React from 'react'

const ViewTeamlistNotice =(props)=> {
  return (
    <>
  
    <div className='alert alert-success '  role="alert" alignment="center">
    Teamlist notice is created successfully. To forward this notice click 'Forward notice' button.
  </div>
  <div>

    Greetings,<br/><br/>
    
    There will be an <strong>Inter department {props.name} competition</strong>  from <strong>{props.firstDate}</strong>. We are delighted to invite you to participate in this competition. You are requested to fill up the team list form before the deadline date <strong>{props.lastDate}</strong><br/><br/>
    
    Thanks,<br/>
    Director<br/>
    Physical Education Center<br/>
    University of Dhaka
    </div>
    </>

  )
}

export default ViewTeamlistNotice;