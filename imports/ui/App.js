import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js'

//App component represents the whole app
class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      hideCompleted: false,
    }
  }

  handleSubmit(event){
    event.preventDefault();

    //find the text field via React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('tasks.insert', text)

    Tasks.insert({
      text,
      createdAt: new Date(), //current time
      owner: Meteor.userId(), // _id of logged user
      username: Meteor.user().username, // username of logged in user
    });

    //Then we clear the form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
//We can update this.state from an event handler by calling this.setState,
//which will update the state property asynchronously and then cause
//the component to re-render:
  toggleHideCompleted(){
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });

  }

  renderTasks(){
    //Now, we need to update our renderTasks function to filter out completed
    // tasks when this.state.hideCompleted is true:

    let filteredTasks = this.props.tasks;
    console.log(filteredTasks);
    if(this.state.hideCompleted){
      filteredTasks = filteredTasks.filter(task => !task.cheked );
      console.log(this.state.hideCompleted);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task key= {task._id}
        task ={task}
        showPrivateButton={showPrivateButton} />
      );

    });

  }

  render(){
    return (
      <div className="container">
      <header>
      <h1>Todo List ({this.props.incompleteCount})</h1>

      <label className="hide-completed">
      <input
        type = "checkbox"
        readOnly
        checked= {this.state.hideCompleted}
        onClick= {this.toggleHideCompleted.bind(this)}
        />
        Hide completed Tasks
        </label>

        <AccountsUIWrapper />
        { this.props.currentUser ?
      <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
      <input type="text" ref="textInput" placeholder="Type to add new tasks" />
      </form> : ''
    }
      </header>

      <ul>
      {this.renderTasks()}
      </ul>
      </div>
    );
  }
}
export default withTracker(() =>{
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, {sort: { createdAt: -1 }}).fetch(),
    incompleteCount: Tasks.find({ checked: {$ne: true } }).count(),
    currentUser: Meteor.user(),
  };
})(App);
