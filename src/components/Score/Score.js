import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';


function Score(props) {

 // console.log(props.score) 
 let text 
    
      if (props.score==='3.0') {

        text = <div className='SurveyIntroText'>
                <p><span class = "bold">Impressive!</span> You won a bonus of <span class = "bold">3.0 &#163;</span> in addition to your regular payment!</p>
                <p><span class = "bold">Note</span>, that you will only get your bonus if you complete the final survey!</p>
                </div>
      
      return (
        <div>
        <center> 
        <div className="instructionsButtonContainer">
          <div>
            {text}           
          </div> 
            <center>
            <Button className="buttonStart" onClick={()=>props.onClicked()}>
            START
            </Button>
            </center>
          </div>
          </center>
          </div>);
      }
      else if (props.score==='1.5') {

        text = <div className='SurveyIntroText'>
                <p><span class = "bold">Well done!</span> You won a bonus of <span class = "bold">1.5 &#163;</span> in addition to your regular payment!</p>
                <p> Note, that you will only get your bonus if you complete the final survey.</p>
                </div>
      
      
        return (
        <div>
        <center> 
        <div className="instructionsButtonContainer">
          <div>
            {text}           
          </div> 
            <center>
            <Button className="buttonStart" onClick={()=>props.onClicked()}>
            START
            </Button>
            </center>
          </div>
          </center>
          </div>);
    }
      else {

        text = <div className='SurveyIntroText'>
                <p><span class = "bold">Unfortunately</span>, you did not win a bonus this time. Please, proceed to the final survey.</p>
                </div>

        return (
        <div>
        <center> 
        <div className="instructionsButtonContainer">
          <div>
            {text}           
          </div> 
            <center>
            <Button className="buttonInstructionStart" onClick={()=>props.onClicked()}>
            <span class = "bold">START</span>
            </Button>
            </center>
          </div>
          </center>
          </div>);
      }
  }

Score.propTypes = {
  score: PropTypes.string.isRequired,
  onClicked: PropTypes.func.isRequired
};

export default Score;

