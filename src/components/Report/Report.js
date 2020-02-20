import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';
import Question from '../QuizQuestion/Question';
import QuestionCount from '../QuizQuestion/QuestionCount';


class Report extends React.Component {

  constructor(props){
    super(props);

  this.state = {
    report: '',
    answer: '',
    answercheck: false,
    shouldBlockNavigation: false
  }
  // console.log(this.state) // initial states 

  this.handleSubmit       = this.handleSubmit.bind(this);  
  this.handleChangeReport = this.handleChangeReport.bind(this);
  this._handleRefresh     = this._handleRefresh.bind(this); 
}


componentDidMount() {
  this._isMounted = true;
  document.getElementById("create-course-form").reset();
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

_handleGoBack(event){
    window.history.go(1);
  }

  handleChangeReport(event) {

  var test = Number(event.target.value)
    
  this.setState({
    report: event.target.value,
    answercheck: false 
    }
    );
  
  // console.log(event.key)

  if ((test!=="") && (test!==null) && (test>parseInt(this.props.constraint[0].min)) && (test<parseInt(this.props.constraint[1].max))) 
  {
    this.setState({
    answercheck: true}
    );
    // console.log(this.state.answercheck)
  }
  else {
    event.preventDefault()
  }

}
  handleSubmit(event) {
        document.getElementById("create-course-form").reset();

        // console.log(event)
        
        event.preventDefault();
        let prev_report = this.state.report 
        this.setState({
          report: ''}
        )

        this.props.onAnswerSelected(this.state.report,this.props.questionId,event) // this.state.report

        
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
        <form id="create-course-form">
        <input value={this.state.report} onChange={this.handleChangeReport} name="report" id="report" className="form-control" placeholder="" type="number" inputMode="numeric" required />
        </form>
        </div>
      </div>
      <p></p>
      <div className="col-md-12 pad-20">
        <div>
          <button type="button" className="btn btn-save btn-primary pad-20" disabled={!this.state.answercheck} onClick={this.handleSubmit}>Submit
            </button>
          </div>
      </div>
        </CSSTransitionGroup>
  );
}
}


Report.propTypes = {
  answer: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  questionTotal: PropTypes.number.isRequired,
  onAnswerSelected: PropTypes.func.isRequired,
  constraint: PropTypes.array.isRequired,
  participant_info:PropTypes.object.isRequired
};

// <button type="submit" className="btn btn-save btn-primary pad-20" disabled={!this.state.answercheck} onClick={this.handleSubmit}>Submit
          

export default withRouter(Report);