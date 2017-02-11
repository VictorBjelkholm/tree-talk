import React, { Component } from 'react'
import { IndexLink, hashHistory } from 'react-router'

import { bindValueToState, getIDFromNode } from './utils.js'

export default class NewThreadView extends Component {
  constructor (props) {
    super(props)
    this.bindValueToState = bindValueToState.bind(this)
    this.state = {
      currentSubject: '',
      currentBody: '',
      currentTags: '',
      creating: false
    }
  }
  createThread () {
    this.setState({creating: true})
    const msg = {
      from: {
        id: getIDFromNode(this.props.node),
        username: this.props.username
      },
      subject: this.state.currentSubject,
      body: this.state.currentBody,
      tags: this.state.currentTags.split(','),
      created_at: new Date()
    }
    const msgToSend = new Buffer(JSON.stringify(msg))
    this.props.node.files.add(msgToSend, (err, res) => {
      if (err) throw err
      this.props.node.pubsub.publish('tree-talk', new Buffer(res[0].hash), () => {
        this.setState({currentSubject: '', currentBody: '', creating: false, currentTags: ''})
        hashHistory.push('/threads/' + res[0].hash)
      })
    })
  }
  render () {
    const buttonClassNames = this.state.creating ? 'button is-success is-loading' : 'button is-success'
    return <div className='columns'>
      <div className='column is-half'>
        <label className='label' htmlFor='subject'>Title</label>
        <p className='control'>
          <input type='text' className='input' placeholder='Thread Subject' onChange={this.bindValueToState('currentSubject')} />
        </p>
        <label className='label' htmlFor='body'>Body</label>
        <p className='control'>
          <textarea className='textarea' placeholder='Body' onChange={this.bindValueToState('currentBody')} />
        </p>
        <label className='label' htmlFor='subject'>Tags</label>
        <p className='control'>
          <input type='text' className='input' placeholder='Tags separated by comma' onChange={this.bindValueToState('currentTags')} />
        </p>
        <div className='block'>
          <button className={buttonClassNames} onClick={this.createThread.bind(this)}>Create Thread</button>
          &nbsp;
          <IndexLink to='/' className='button is-danger is-outlined'>Cancel</IndexLink>
        </div>
      </div>
    </div>
  }
}