import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import Question from '../QuizQuestion/Question';
import QuestionCount from '../QuizQuestion/QuestionCount';

// import './Report.css'; // add later 


class Report extends React.Component {

  constructor(props){
    super(props);

  this.state = {
    report: '',
    answer: '',
    answercheck: false  

  }
  console.log(this.state) // initial states 

  this.handleSubmit       = this.handleSubmit.bind(this);  
  this.handleChangeReport = this.handleChangeReport.bind(this);
}


  handleChangeReport(event) {

  var test = Number(event.target.value)
    
  this.setState({
    report: event.target.value,
    answercheck: false 
    }
    );
  
  console.log(Number(test))

  if ((test!=="") && (test!==null) && (test>parseInt(this.props.constraint[0].min)) && (test<parseInt(this.props.constraint[1].max))) {
    this.setState({
    answercheck: true}
    );
    console.log(this.state.answercheck) 
  }

}

  handleSubmit(event) {
        document.getElementById("create-course-form").reset();
        event.preventDefault();
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
          <button type="submit" className="btn btn-save btn-primary pad-20" disabled={!this.state.answercheck} onClick={this.handleSubmit}>Submit
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
  constraint: PropTypes.array.isRequired
};



export default Report;