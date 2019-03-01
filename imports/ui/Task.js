import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import classnames from 'classnames';


//Task component represents a single todo items
export default class Task extends Component {
  toggleChecked(){
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    //set the checked property to the opposite of its current value
    Tasks.update(this.props.task._id,{
      //update function on a collection takes two arguments. the first is the selector
      //that ientify a subset of the collection, the second is an update parameter
      //that specifies what should be done the the matched objects
      //in this case the selector is just he _id of the relevant task.
      //the updated parameter uses $set to toggle the checked field, wich will represent whether the task has been completed.
      $set: { checked: !this.props.task.checked },
    });
  }

  deleteThisTask(){
    //The remove function takes one argument, a selector that determines wich items to remove from the collection
    Meteor.call('tasks.remove', this.props.task._id);
  }

  togglePrivate(){
    Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private)
  }

  render(){


    //give tasks a different className when they are checked off
    // we can style them in css
    const taskClassName = classnames({
      checked: this.props.task.checked,
      private: this.props.task.private
    })


    return (
      <li className={taskClassName}>
      <button className = "delete" onClick={this.deleteThisTask.bind(this)} >
      &times;
      </button>

      <input
        type="checkbox"
        readOnly
        checked={!!this.props.task.checked}
        onClick={this.toggleChecked.bind(this)}
        />

        {this.props.showPrivateButton ?(
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
          {this.props.task.private ? 'Private' : 'Public'}
          </button>
        ) : ''}

        <span className="text"><strong>{ this.props.task.username}</strong> :{this.props.task.text}</span>
        </li>
    );
  }
}
