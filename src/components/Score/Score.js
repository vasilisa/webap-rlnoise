import React from 'react';
import PropTypes from 'prop-types';
import { API_URL } from '../../config';
import { handleResponse } from '../helpers';
import { Button } from 'react-bootstrap';


function Score(props) {

 console.log(props.score) 
 let text 
    
      if (props.score==='3.75') {

        text = <div className='SurveyIntroText'>
                <p>Impressive! You won a bonus of 3.75 &#163; in addition to your regular payment.</p>
                <p> Note, that you will only get your bonus if you complete the survey.</p>
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
      else if (props.score==='1.75') {

        text = <div className='SurveyIntroText'>
                <p>Well done! You won a bonus of 1.75 XX in addition to your regular payment.</p>
                <p> Note, that you will only get your bonus if you complete the survey.</p>
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
                <p>Unfortunately, you did not win a bonus this time. Please, proceed to the final survey.</p>
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
  }

Score.propTypes = {
  score: PropTypes.string.isRequired,
  onClicked: PropTypes.func.isRequired
};

export default Score;

