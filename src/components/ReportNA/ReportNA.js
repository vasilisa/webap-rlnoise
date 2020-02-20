import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

import { CSSTransitionGroup } from 'react-transition-group';
import Question from '../QuizQuestion/Question';
import QuestionCount from '../QuizQuestion/QuestionCount';
import AnswerOption from '../QuizQuestion/AnswerOption';


class ReportNA extends React.Component {

  constructor(props){
    super(props);

  this.state = {
    report: '',
    answer: '',
    answercheck: false  

  }
  // console.log(this.state) // initial states 

  this.handleSubmit        = this.handleSubmit.bind(this);  
  this.handleChangeReport  = this.handleChangeReport.bind(this);
  this.renderAnswerOptions = this.renderAnswerOptions.bind(this); 
}


componentDidMount() {
  this._isMounted = true;
  // document.getElementById("create-course-form").reset();
  document.body.style.background= '#fff';   
  this.setState({
    report: '',
    answer: '',
    answercheck: false,
    shouldBlockNavigation: false}
    )
  window.history.pushState(window.state, null, window.location.href);
  window.addEventListener('keypress' , e => this._handleRefresh(e));
}

_handleRefresh(evt){
  if (evt.key==='Enter') {

  if (window.confirm("You are about to leave the survey. All your answers would be lost and you will have to start the survey from the beginning. Are you sure you want to proceed?")){
  this.props.history.push({
       pathname: `/Intro_Survey`, 
       state: {participant_info: this.props.participant_info} // contains participant ID, prolific ID and date-time of the experiment start 
     })
  }
}
}

  handleChangeReport(event) {

  var test = Number(event.target.value)

  this.setState({
    report: event.target.value,
    answercheck: false 
    }
    );
  
  // console.log(Number(test))

  if ((test!=="") && (test!==null) && (test>parseInt(this.props.constraint[0].min)) && (test<parseInt(this.props.constraint[1].max))) {
    this.setState({
    answercheck: true }
    );
    // console.log(this.state.answer) 
  }

}

  handleSubmit(event) {
        event.preventDefault();
        this.props.onAnswerSelected(this.state.report,this.props.questionId,event)
        
  }

  renderAnswerOptions(key) {
    return (
      <AnswerOption
        key={key.content}
        answerContent={key.content}
        answerType={key.type}
        answer={this.props.answer}
        questionId={this.props.questionId}
        onAnswerSelected={this.props.onAnswerSelected}
      />
    );
}

render() {
  return (
    <CSSTransitionGroup
      className="container"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
      <div key={this.props.questionId}>
        <QuestionCount counter={this.props.questionCount} total={this.props.questionTotal} />
        <Question content={this.props.question} />
        <div className="col-md-6 no-padding">
        <input value={this.state.report} onChange={this.handleChangeReport} name="report" id="report" className="form-control" placeholder="" type="number" pattern="[0-9]*" inputMode="numeric" required />
        </div>
        <p></p>
        </div>
      <p></p>
      <div className="col-md-12 pad-20">
        <div>
          <button type="submit" className="btn btn-save btn-primary pad-20" disabled={!this.state.answercheck} onClick={this.handleSubmit}>Submit
            </button>
          </div>
      </div>
      <p></p>
      <div className="row">
        <ul className="answerOptions">
          {this.props.answerOptions.map(this.renderAnswerOptions)}
        </ul>
      </div>
      
    </CSSTransitionGroup>
  );
}
}

ReportNA.propTypes = {
  answer: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  questionTotal: PropTypes.number.isRequired,
  onAnswerSelected: PropTypes.func.isRequired,
  constraint: PropTypes.array.isRequired,
  participant_info:PropTypes.object.isRequired
};


export default withRouter(ReportNA);