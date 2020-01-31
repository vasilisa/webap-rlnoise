import React from 'react';
import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import { API_URL } from '../../config';
import { handleResponse } from '../helpers';
import './Block.css'


class Block extends React.Component {
  constructor(props){
    super(props);
    const participant_info = this.props.location.state.participant_info
    
    const block_info = {
      rewards_low : [],
      rewards_high : [],
      correct_side : [],
      left_symbol : [],
      right_symbol : [],      
      correct_dimension : '',
      trial_numb : 0,
      nb_trials_per_block : 0,
    }

    this.state = {
      participant_info : participant_info,
      block_info : block_info,
      newblock_frame : this.props.location.state.newblock_frame,
      pool_symbols : {},
      score : -1,
    }

    this.fetchBlock.bind(this);
    this.fetchSymbols.bind(this);
    this._handlePressKey.bind(this);
    this._isMounted = false;
    this._handleGoBack.bind(this);   
    this.fetchScore.bind(this);

  }

  _handlePressKey (event) {
          if((event.keyCode == 32) && (this.state.participant_info.block_number <= (this.state.participant_info.blocks_ids.length - 1)))
          { // space bar code          
          if (this.state.newblock_frame){
          this.setState({newblock_frame : false})
          this.props.history.push({
           pathname: `/Board`,
           state: {participant_info: this.state.participant_info,
                   block_info : this.state.block_info,
                   pool_symbols: this.state.pool_symbols,}
          })}
          else
          {
            if (this._isMounted)
            {
              const newblocknumber = this.state.participant_info.block_number + 1
              this.fetchBlock(this.state.participant_info.blocks_ids[newblocknumber])
              this.fetchSymbols(newblocknumber);
              this.setState({newblock_frame : true, participant_info : {...this.state.participant_info, block_number:newblocknumber},})
              // add here condition when last block
              if (newblocknumber === this.state.participant_info.blocks_ids.length){
                this.fetchScore()
              }              
            }
          }
        }
     }

  restartTraining () {
    this.setState({newblock_frame : true, participant_info : {...this.state.participant_info, block_number:0},})
    this.fetchBlock(this.state.participant_info.blocks_ids[0])
    this._isMounted && this.fetchSymbols(0);
  }

  componentDidMount() {  
  this._isMounted = true;
  document.body.style.background = "#F0F0F0";    
  this._isMounted && this.fetchBlock(this.state.participant_info.blocks_ids[this.state.participant_info.block_number]);
  this._isMounted && this.fetchSymbols(this.state.participant_info.block_number);
  this._isMounted && document.addEventListener("keydown", e => this._handlePressKey(e), false);
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
   this._isMounted && document.removeEventListener("keydown", e => this._handlePressKey(e), false);
   this._isMounted = false;
  }  

  fetchSymbols (block_number) {
   fetch(`${API_URL}/participants_symbols/get_symbols/` + this.state.participant_info.participant_id + '/' + (block_number + 1))
            .then(handleResponse)
            .then((data) => {

              const required_pool_of_symbols = Object.keys(data['pool_of_symbols']).map((key, index) => (require('../../' + data['pool_of_symbols'][key])))
              const results = {'pool': required_pool_of_symbols}
                this.setState({
                    pool_symbols : required_pool_of_symbols,
                });                })
            .catch((error) => {
                this.setState({ error : error.errorMessage, loading: false }); });
  }

  fetchScore () {
   fetch(`${API_URL}/participants/score/` + this.state.participant_info.participant_id)
            .then(handleResponse)
            .then((data) => {
                this.setState({
                    score : data['score'],
                });                })
            .catch((error) => {
                this.setState({ error : error.errorMessage, loading: false }); });
  }


  async fetchBlock (block_id_) {
   const fetchResult = fetch(`${API_URL}/block/` + block_id_)
            .then(handleResponse)
            .then((data) => {              
              const block_info = {
              rewards_high   : Object.keys(data['rewards_high']).map((key, index) => (data['rewards_high'][key])),
              rewards_low   : Object.keys(data['rewards_low']).map((key, index) => (data['rewards_low'][key])),
              correct_side     : Object.keys(data['correct_side']).map((key, index) => (data['correct_side'][key])),
              left_symbol   : Object.keys(data['left_symbol']).map((key, index) => (data['left_symbol'][key])),
              right_symbol  : Object.keys(data['right_symbol']).map((key, index) => (data['right_symbol'][key])),              
              correct_dimension      : data['correct_dimension'],
              trial_numb             : 0,
              nb_trials_per_block : Object.keys(data['rewards_high']).length,
            }
                this.setState({
                    block_info  : block_info,
                });                })
            .catch((error) => {
                this.setState({ error : error.errorMessage, loading: false }); });
    const response = await fetchResult;
    return response
  }

  render()
  {
    let text
    if ((this.state.participant_info.block_number === 0) && this.state.newblock_frame)
    {
      text = 'Press spacebar to start first training block'
        return (
      <div className="block">
        {text}           
      </div>     );
    } 
    else if ((this.state.participant_info.block_number === 1) && this.state.newblock_frame)
    {
      text = <div><p> Identify the relevant dimension to maximize your rewards </p> 
                  <p> Press spacebar to start second training block </p> </div>
        return (
      <div className="block">
        {text}           
      </div>     );
    }     
    else if ((this.state.participant_info.block_number === 0) && (this.state.newblock_frame===false))
    {
      text = <div><p> Did you identify the relevant dimension? It was the {this.state.block_info.correct_dimension}! </p>
                    <div className="translatetext"/>
                 <p> Press spacebar to continue</p></div>
      return (
        <div className="restarttraining">
         {text}  <div className="translate"/>
      </div>);                 
/*      return (
        <div className="restarttraining">
         {text}  <div className="translate"/>
        <div> <Button variant="secondary" color="danger" size="sm" className="button" type="submit" onClick={()=> this.restartTraining()}> Restart training </Button></div>
      </div>);*/
    }
    else if ((this.state.participant_info.block_number === 1) && (this.state.newblock_frame===false))
    {
      text = <div><p> Did you identify the relevant dimension? It was the {this.state.block_info.correct_dimension}! </p>
                    <p> Let's start the task now </p>
                    <p> Identifying the relevant dimension will be harder than during the training blocks, so pay attention! </p>
                    <p> Furthermore, to verify that you are paying attention, the relevant dimension will be indicated at the beginning of some blocks </p>
                    <div className="translatetext"/>
                 <p> Press spacebar to start task</p></div>
      return (
        <div className="restarttraining">
         {text}  <div className="translate"/>
      </div>);
    }
    else if (this.state.participant_info.block_number === this.state.participant_info.blocks_ids.length)
    {
      text = 'Your performance was of ' + this.state.score + '%. Impressive! Thank you for your participation'
        return (
      <div className="block">
        {text}           
      </div>);      
    }
    else
    {
      let text_unidimensional
      if (this.state.newblock_frame) 
        {
          if (parseInt(this.state.participant_info.unidimensional_blocks[this.state.participant_info.block_number]) == 1)
          {
            text_unidimensional = 'During this next block, the relevant dimension is the ' + (this.state.block_info.correct_dimension) +'!'
          }
          else
          {
            text_unidimensional = 'Identify the relevant dimension to maximize your rewards'
          }

          text = <div><p>{text_unidimensional}</p> 
                <p> Press spacebar to start block {this.state.participant_info.block_number - 1} </p> </div>
        }
        else
          {text = 'End of block '  + (this.state.participant_info.block_number - 1)}
        return (
      <div className="block">
        {text}           
      </div>);
    }    
}

}

export default withRouter(Block);