import React from 'react';
import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import './Intro_Survey.css';

// Fetch participant data onClick after veryfing that all the boxes are ticked 
const Checkbox = props => (
  <input type="checkbox" {...props} />
)

class Intro_Survey extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      checked: false,
      participant_id: this.props.location.state.participant_info.participant_id, 
      prolific_id: this.props.location.state.participant_info.prolific_id
      date: this.props.location.state.participant_info.date,
      TotalBlock: 4, 
      block_number: 0, 
      newblock_frame: true 
  }

    this.redirectToTarget.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object
  }
    
  
  redirectToTarget(){

    this.props.history.push({
      pathname: `/Survey`,
      state: {participant_info:this.state, newblock_frame : this.state.newblock_frame}
    })
  }

  handleCheckboxChange = event =>
    this.setState({ checked: event.target.checked})
    
render() {
  return (
      <div>
        <div className="IntroText">
          <center>
          <p>INFORMATION and CONSENT</p></center>
          <p></p>
          <p>We are going to ask you to complete a questionnaire that will take about 10-15 minutes.</p>

          <p>This study is conducted by Drs. Valentin Wyart and Pierre Jacquet - researchers at the Department of Cognitive Studies of the Ecole normale supérieure (Paris, France). 
          It aims to better understand the links between living conditions, the reproductive development and the health of individuals.</p> 
          
          <ul>
          Two types of questions will be asked, relating to:
          <p></p>
          <li>{}Your childhood and your adult life (e.g., your current economic situation, your parents' situation as a child, etc.)</li> 
          <p></p>
          <li>{}Certain biological data that characterize your development (e.g., weight and size at birth, age at puberty, etc.).</li> </ul>

          <p>All your answers will be treated in a strictly confidential and anonymous manner. 
          A numerical code will be automatically assigned to you at the end of the questionnaire in order to maintain your anonymity with the research team (?). 
          It will be impossible to use this data to identify you.</p>

          <p>Finally, the individual data collected from each participant will be aggregated to allow the researchers to better understand the variations observed in groups of participants.</p>  
          
          <p>Your participation in the questionnaire must be entirely voluntary, and you may withdraw at any time.</p>
          
          <p>CONTACT AND ADDITIONAL INFORMATION</p>
          <p>Email: valentin.wyart@ens.fr</p>
          <p>This research was approved by the Inserm Ethical Review Committee: IRB00003888 on November 13th, 2018.</p>
          
          <p>By checking this box, I confirm that I am at least 18 years old, and have read and fully understood the above information.</p>
        </div>
        <div>
          <label>
            <Checkbox
              checked={this.state.checked}
              onChange={this.handleCheckboxChange}
            />
            <span></span>
          </label>
        </div>
      <div className="buttonContainer">
          <Button type="button" disabled={!this.state.checked} onClick={()=>this.redirectToTarget()}>Next</Button>
      </div>
      </div>
    );
  }
}
 
export default withRouter(Intro_Survey);
