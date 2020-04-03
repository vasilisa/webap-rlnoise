import React from 'react';
import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import { API_URL } from '../../config';
import { handleResponse } from '../helpers';

import { CSSTransitionGroup } from 'react-transition-group';


import Score from '../Score/Score';

import './Block.css'


class Block extends React.Component {
  constructor(props){
    super(props);
    const participant_info = this.props.location.state.participant_info
    
    const block_info = {

      position      : [],
      reward_1      : [],
      reward_2      : [],
      block_feedback: '',  
      trial_numb    : 0,
      block_number  : '',
      block_type    : '',
      TotalTrial    : ''
    }

    this.state = {
      participant_info : participant_info,
      block_info       : block_info,
      newblock_frame   : this.props.location.state.newblock_frame,
      pool_symbols     : {},
      score : -1,
      load_bonus: false
    }

    this.fetchBlock.bind(this);
    this.fetchSymbols.bind(this);
    this.redirectToScore.bind(this); 
    this.redirectToSurvey.bind(this); 
    this._isMounted = false;
    this._handleGoBack.bind(this);   
  }

  
  restartTraining () {
    this.setState({newblock_frame : true, participant_info : {...this.state.participant_info, block_number:0},})
    this.fetchBlock(this.state.participant_info.blocks_ids[0])
    this._isMounted && this.fetchSymbols(0);
  }

  redirectToTarget () {
      // console.log(this.state.pool_symbols)
      if((this.state.participant_info.block_number <= (this.state.participant_info.TotalBlock)))
          {           
          if (this.state.newblock_frame){
          this.setState({newblock_frame : false})
          this.props.history.push({
           pathname: `/Board`,
           state: {participant_info: this.state.participant_info,
                   block_info      : this.state.block_info,
                   pool_symbols    : this.state.pool_symbols
                 }
          })}
          else
          {
            if (this._isMounted)
            {
              
              // console.log(this.state.participant_info.block_number)
              const newblocknumber = this.state.participant_info.block_number + 1
              // console.log(newblocknumber)

              if (newblocknumber === this.state.participant_info.TotalBlock+1){
                // console.log('Fetching the score')
                this.fetchScore()
                }

              else {
                this.fetchBlock(this.state.participant_info.game_id,newblocknumber+1) //this.state.participant_info.block_number
              
                this.fetchSymbols(this.state.participant_info.game_id,newblocknumber+1); 
              
                this.setState({newblock_frame : true, participant_info : {...this.state.participant_info, block_number:newblocknumber},}) // what gets updated 
              }
            }
          }
        }
      }
    
  // When the task is over 
  fetchScore() {
  if (this._isMounted) {

    fetch(`${API_URL}/participants_data/score/`+ this.state.participant_info.participant_id +'/'+ this.state.participant_info.game_id +'/'+this.state.participant_info.prolific_id)
            .then(handleResponse)
            .then((data) => {
              const bonus = data['bonus']
              // console.log(bonus)

              this.setState({
                  score : bonus,
                  loading : false,
                  load_bonus: true,
                  newblock_frame : true,
                  participant_info : {...this.state.participant_info, block_number:this.state.participant_info.TotalBlock+1}
                });
            })
            .catch((error) => {
                this.setState({ error : error.errorMessage, loading: false, load_bonus: false });
                 });
}
}

redirectToScore() {
if (this.state.load_bonus === false) {
  this.fetchScore() 
}
  
else if  (this.state.load_bonus === true){
   return (
        <Score
          score      = {this.state.score}  
          onClicked  = {this.redirectToSurvey}
        />
      );}
 }

redirectToSurvey = () => {

  // Post the bonus amount together with the prolific id and participant ids in the ParticipantsDataBonus table: 
  let body = { 
              'participant_id'  : this.state.participant_info.participant_id,
              'prolific_id'     : this.state.participant_info.prolific_id,
              'date'            : this.state.participant_info.date,
              'bonus'           : this.state.score}
              
    // console.log(body) 
    fetch(`${API_URL}/participants_data_bonus/create/`+this.state.participant_info.participant_id +'/'+this.state.participant_info.prolific_id, {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(body)
     })

    this.props.history.push({
      pathname: `/Intro_Survey`,
      state: {participant_info: this.state.participant_info} // to verify what is actually imported to a new page and what you need 
    })
  } 
  componentDidMount() {  
  this._isMounted = true;
  document.body.style.background= '#fff';   
  this._isMounted && this.fetchBlock(this.state.participant_info.game_id,this.state.participant_info.block_number+1);
  this._isMounted && this.fetchSymbols(this.state.participant_info.game_id,this.state.participant_info.block_number+1);
  window.history.pushState(window.state, null, window.location.href);
  window.addEventListener('popstate', e => this._handleGoBack(e));
  window.onbeforeunload = this._handleRefresh
  }

  _handleRefresh(evt){
    return false // error message when refresh occurs
  }

  _handleGoBack(event){
    window.history.go(1);
  }

  componentWillUnmount()
  {
   this._isMounted = false;
  }  


  fetchSymbols(game_id_,block_number_) {
    fetch(`${API_URL}/games/`+game_id_+'/'+block_number_) 
      .then(handleResponse)
      .then((data) => {

        const required_pool_of_symbols = Object.keys(data['symbols']).map((key, index) => (require('../../images/' + data['symbols'][key])))

        // console.log(data['symbols'])  

          this.setState({
            pool_symbols : required_pool_of_symbols,
            loading      : false 

          });
        })

      .catch((error) => {
        this.setState({ error : error.errorMessage, loading: false });
         });
       }

// This is to get the data for a specific block from the Back 
  async fetchBlock(game_id_,block_number_) {
    // console.log(block_number_)
    this.setState({ loading: true });
    const fetchResult = fetch(`${API_URL}/game_blocks/`+game_id_+'/'+block_number_)
      .then(handleResponse)
      .then((data) => {

        const block_info = {
          block_number   : data.block_number,
          block_feedback : data.block_feedback, 
          block_type     : data.block_type,
          reward_1       : Object.keys(data['reward_1']).map((key, index) => (data['reward_1'][key])),
          reward_2       : Object.keys(data['reward_2']).map((key, index) => (data['reward_2'][key])),
          th_reward_1    : Object.keys(data['th_reward_1']).map((key, index) => (data['th_reward_1'][key])),
          th_reward_2    : Object.keys(data['th_reward_2']).map((key, index) => (data['th_reward_2'][key])),
          position       : Object.keys(data['position']).map((key, index) => (data['position'][key])),
          trial_numb     : 0,
          TotalTrial     : 1 // TEST Object.keys(data['reward_1']).length 
        }
          
        this.setState({
          block_info: block_info,
        });
        // console.log(this.state.block_info)
      })
        .catch((error) => {
          this.setState({ error : error.errorMessage, loading: false });
      });
    const response = await fetchResult;
    return response
  }


render()
  { 
    let text
    if ((this.state.participant_info.block_number === 0) && (this.state.newblock_frame) && (this.state.block_info.block_feedback==="1"))
    { 
      text = <div className='textbox'> <p>This is a <span class="bold">partial</span> feedback block: you will <span class = "bold">only</span> see the feedback of the <span class = "bold">chosen</span> slot machine.</p> 
              <div className="translate"/>
                <img className="introsymbol"  src={require('../../images/symbol_shape_0_grate_None_color_3.png')} alt='introsymbol' /> 
                <img className="introsymbol"  src={require('../../images/symbol_shape_2_grate_None_color_0.png')} alt='introsymbol' /> 
            </div>

    return (
      <CSSTransitionGroup
      className="container"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}>

      <div>
      <center> 
      <div className="instructionsButtonContainer">
        <div>
          {text}           
        </div> 
        <center>
          <Button className="buttonInstructions" onClick={()=>this.redirectToTarget()}>
            &#8594;
          </Button>
        </center>
      </div>
      </center> 
      </div>
      </CSSTransitionGroup>);
    } 

    else if ((this.state.participant_info.block_number===0)  && (this.state.newblock_frame) && (this.state.block_info.block_feedback==="2"))
    {
      text = <div className='textbox'> <p>This is a <span class = "bold">complete</span> feedback block: you will see <span class = "bold">both </span> the feedback of the <span class="bold">chosen</span> and <span class = "bold">unchosen</span> slot machines.</p> 
                <div className="translate"/>
                <img className="introsymbol"  src={require('../../images/symbol_shape_0_grate_None_color_3.png')} alt='introsymbol'/> 
                <img className="introsymbol"  src={require('../../images/symbol_shape_2_grate_None_color_0.png')} alt='introsymbol'/> 
                </div>
      
        return (
          <CSSTransitionGroup
      className="container"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}>

          <div>
          <center> 
          <div className="instructionsButtonContainer">
            <div>
              {text}           
            </div> 
            <center>
              <Button className="buttonInstructions" onClick={()=>this.redirectToTarget()}>
              &#8594;
              </Button>
            </center>
          </div>
          </center>
          </div>
          </CSSTransitionGroup>
          );
    }
    else if ((this.state.participant_info.block_number===1) && (this.state.newblock_frame) && (this.state.block_info.block_feedback==="1"))
    {
      text = <div className='textbox'> 
                <p>Did you notice that the most rewarding colored shape was not the same throughout the session?</p>
                <p>At the beginning it was <span class="bold red"> the red circle </span> but in the middle of the session it changed,</p> 
                <p>and <span class="bold blue">the blue star </span> became more rewarding?!</p>
                <p> It is important that you track these changes !</p>
                <p> It is also important to track outcomes <span className='bold italic'>in time</span> and avoid switching too much</p>
                <p> because even a good shape can occasionally give few points !</p>
                <p>Let's do another training session with <span class = "bold">partial feedback</span>now: you will <span class="bold">only</span> see the feedback of the <span class="bold">chosen</span> slot machine.</p> 
                <div className="translate"/>
                <img className="introsymbol" src={require('../../images/symbol_shape_1_grate_None_color_2.png')} alt='introsymbol'/> 
                <img className="introsymbol" src={require('../../images/symbol_shape_3_grate_None_color_1.png')} alt='introsymbol'/> 
                </div>
      
        return (
          <CSSTransitionGroup
            className="container"
            component="div"
            transitionName="fade"
            transitionEnterTimeout={800}
            transitionLeaveTimeout={500}
            transitionAppear
            transitionAppearTimeout={500}>

          <div>
          <center> 
          <div className="instructionsButtonContainer">
            <div>
              {text}           
            </div>
            <center>
              <Button className="buttonInstructions" onClick={()=>this.redirectToTarget()}>
              &#8594;
              </Button>
            </center>
          </div>
          </center>
          </div>
          </CSSTransitionGroup>);
    }
    else if ((this.state.participant_info.block_number===1) && (this.state.newblock_frame) && (this.state.block_info.block_feedback==="2")) 
    { 
      text = <div className='textbox'> 
                <p>Did you notice that the most rewarding colored shape was not the same throughout the session?</p>
                <p>At the beginning it was <span class="bold red"> the red circle </span> but in the middle of the session it changed,</p> 
                <p>and <span class="bold blue">the blue star </span> became more rewarding?!</p>
                <p> It is important that you track these changes !</p>
                <p> It is also important to track outcomes <span className='bold italic'>in time</span> and avoid switching too much</p>
                <p> because even a good shape can occasionally give few points !</p>
                <p>Let's do another training session with <span class="bold">complete feedback</span> now: you will see <span class="bold">both</span> the feedback of the <span class="bold">chosen</span> and <span class="bold">unchosen</span> slot machines.</p> 
                <div className="translate"/>
                <img className="introsymbol"  src={require('../../images/symbol_shape_1_grate_None_color_2.png')} alt='introsymbol'/> 
                <img className="introsymbol"  src={require('../../images/symbol_shape_3_grate_None_color_1.png')} alt='introsymbol'/> 
                </div>
        
        return (
          <CSSTransitionGroup
      className="container"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}>
        <div>
        <center> 
        <div className="instructionsButtonContainer">
          <div>
            {text}           
          </div> 
            <center>
            <Button className="buttonInstructions" onClick={()=>this.redirectToTarget()}>
            &#8594;
            </Button>
            </center>
          </div>
          </center>
          </div>
           </CSSTransitionGroup>);
      }
    else if ((this.state.participant_info.block_number===1) && (this.state.newblock_frame===false))
    {
      text = <div className='textbox'><p> You finished the training!</p>
                  <p></p>
                  <p> Let's start the task now! </p>
                  <p> At the beginning of each block you will see if you are playing <span class = "bold">partial</span> or <span class = "bold">complete</span> feedback block! </p>
                  <p> Finding the most rewarding slot machine will be harder than during the training, so pay attention! </p></div>
      return (
        <CSSTransitionGroup
      className="container"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}>
        <div>
        <center> 
        <div>
          <div className="restarttraining">
            {text}  <div className="translate"/>
          </div>
          <center>
            <Button className="buttonInstructions" onClick={()=>this.redirectToTarget()}>
            &#8594;
            </Button>
          </center>
        </div>
        </center>
        </div>
        </CSSTransitionGroup>);
    }
    else if ((this.state.participant_info.block_number===this.state.participant_info.TotalBlock+1) && (this.state.load_bonus===true))
    {
      return(

          <div>{this.redirectToScore()}</div>       
        )
    }

    else
    {
      const feedback_type_text = (this.state.block_info.block_feedback==="1") ? 'PARTIAL' : 'COMPLETE';
      const end_of_block_text  = (this.state.block_info.block_type==="training") ? 'End of training block': 'End of block ' + (this.state.participant_info.block_number-1)
      
      if (this.state.newblock_frame) 
        {
          text = <div><p>The next block is <span class ="bold">{feedback_type_text}</span> feedback block!</p></div>
        }
      else
        { 
          text = <div><p>{end_of_block_text}</p></div> //'End of block ' + (this.state.participant_info.block_number+1)
        }
        return (
          <CSSTransitionGroup
      className="container"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={800}
      transitionAppear
      transitionAppearTimeout={800}>

      <div>
      <center>
      <div className="restarttraining">
        {text}           
      </div>
        <center>
        <Button className="buttonInstructionStart" onClick={()=>this.redirectToTarget()}>
          &#8594;
        </Button>
        </center>
    </center>
    </div>
    </CSSTransitionGroup>);
    }    
  }

}

export default withRouter(Block);