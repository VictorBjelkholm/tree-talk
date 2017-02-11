import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import Tags from './tags.js'
import _ from 'lodash'

export default class IndexView extends Component {
  goToThread (thread) {
    return () => {
      hashHistory.push('/threads/' + thread)
    }
  }
  render () {
    const posts = _.groupBy(this.props.posts, 'threadID')
    console.log('posts', posts)
    let threads = this.props.threads.map((thread) => {
      const thisThreadsPosts = posts[thread.hash]
      console.log('thisThreadsPosts', thisThreadsPosts)
      let postLen = 0
      if (thisThreadsPosts) {
        postLen = thisThreadsPosts.length
      }
      return <div className='column is-12' key={thread.hash}>
        <div className='notification thread is-info' onClick={this.goToThread(thread.hash)}>
          {thread.subject} (Replies: {postLen}) <Tags tags={thread.tags} onClick={() => {}} />
        </div>
      </div>
    })
    if (threads.length === 0) {
      threads = <div className='column'>Have yet to find any existing threads...</div>
    }
    return <div>
      <div className='container is-fluid'>
        <div className='columns'>
          <div className='column'>
            <div className='block'>
              <div className='control is-grouped'>
                <p className='control'>
                  <Link to='/new-thread' className='button is-success'>Create a new thread</Link>
                </p>
                <p className='control'>
                  <input className='input' style={{width: 150}} defaultValue={this.props.username} type='text' placeholder='Nickname' onChange={this.props.onUsernameChange} />
                </p>
                <p className='control'>
                  <Link to='/settings' className='button'>Settings</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='columns is-multiline'>
          {threads}
        </div>
      </div>
    </div>
  }
}