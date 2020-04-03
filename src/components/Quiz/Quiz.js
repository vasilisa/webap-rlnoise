import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import Question from '../QuizQuestion/Question';
import QuestionCount from '../QuizQuestion/QuestionCount';
import AnswerOption from '../QuizQuestion/AnswerOption';

function Quiz(props) {

  console.log(props.image) 
  
  function renderAnswerOptions(key) {
    return (
      <AnswerOption
        key             ={key.content}
        answerContent   ={key.content}
        answerType      ={key.type}
        answer          ={props.answer}
        questionId      ={props.questionId}
        onAnswerSelected={props.onAnswerSelected}
      />
    );
  }

  if (props.image!=null){

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
      <div key={props.questionCount}>
        <QuestionCount counter={props.questionCount} total={props.questionTotal} />
        <Question content={props.question} />
        
        <div className="symbolframe">    
          <img className="quizImage" src={props.image} alt='quizImage'/> 
        </div>
      
        <ul className="answerOptions">
          {props.answerOptions.map(renderAnswerOptions)}
        </ul>
      </div>
    </CSSTransitionGroup>);
  }

  else {

    return(
      
      <CSSTransitionGroup
      className="container"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
      >
      <div key={props.questionCount}>
        <QuestionCount counter={props.questionCount} total={props.questionTotal} />
        <Question content={props.question} />
        <ul className="answerOptions">
          {props.answerOptions.map(renderAnswerOptions)}
        </ul>
      </div>
    </CSSTransitionGroup>); 
    } 
}

Quiz.propTypes = {
  answer: PropTypes.string.isRequired,
  answerOptions: PropTypes.array.isRequired,
  question: PropTypes.string.isRequired,
  questionId: PropTypes.number.isRequired,
  questionCount: PropTypes.number.isRequired,
  questionTotal: PropTypes.number.isRequired,
  onAnswerSelected: PropTypes.func.isRequired,
};

export default Quiz;
