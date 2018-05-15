import Layout from '../components/Layout.js';
import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch';
import Link from 'next/link';
import Auth from '../components/Auth.js';
import Login from '../components/Login.js';
import PageWrapper from '../components/PageWrapper.js';
import Menu from '../components/Menu.js';
import { Config } from '../config.js';
import sanitizeHtml from 'sanitize-html';

class Assessment extends Component {
  constructor() {
    super();
    this.filterAssessmentList = this.filterAssessmentList.bind(this);
    this.assessmentRedirect = this.assessmentRedirect.bind(this);
    this.submitSolution = this.submitSolution.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      assessmentSolutionList: {},
      assessmentsList: [],
      subcourseId: '',
      assessmentSubmitSuccess: false,
      userAssessments: {},
      inputValuesArray: []
    };
  }

  componentDidMount() {
    this.filterAssessmentList();
  }

  assessmentRedirect = event => {
    event.preventDefault();
    sessionStorage.removeItem('subcourseId');
    window.location.href = './';
  };

  filterAssessmentList = async () => {
    const filterParam = sessionStorage.getItem('subcourseId');
    this.setState({ subcourseId: filterParam });
    this.state.assessmentsList = this.props.assessmentsList
      .filter(assessment => {
        return (
          assessment.subcourses[0] ===
          Number(sessionStorage.getItem('subcourseId'))
        );
      })
      .reverse();
    let user_id = sessionStorage.getItem('id');
    let solutionList = await fetch(
      `${Config.apiUrl}/wp-json/wp/v2/users/${user_id}`
    );
    solutionList = await solutionList.json();
    const assessmentSolutionList =
      solutionList.acf && JSON.parse(solutionList.acf.assessment)[filterParam]
        ? JSON.parse(solutionList.acf.assessment)[filterParam]
        : {};
    console.log(assessmentSolutionList);
    this.setState({ userAssessments: assessmentSolutionList });
  };

  submitSolution = async event => {
    event.preventDefault();
    let input = event.target.previousSibling;
    let value = input.value;
    let id = input.dataset.id;
    let sid = input.dataset.sid;
    let user_id = sessionStorage.getItem('id');
    let solutionList = await fetch(
      `${Config.apiUrl}/wp-json/wp/v2/users/${user_id}`
    );
    solutionList = await solutionList.json();
    let assessment = solutionList.acf.assessment
      ? JSON.parse(solutionList.acf.assessment)
      : {};
    assessment[id] = assessment[id] || {};
    assessment[id][sid] = {
      id: sid,
      url: value
    };
    let form = new FormData();
    form.append('fields[assessment]', JSON.stringify(assessment));

    return fetch(`${Config.apiUrl}/wp-json/acf/v3/users/${user_id}`, {
      method: 'POST',
      body: form
    }).then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return this.setState({ assessmentSubmitSuccess: true });
    });
  };

  handleChange = event => {
    console.log(event.target.getAttribute('data-sid'));
    const userAssessments = this.state.userAssessments;
    userAssessments[event.target.getAttribute('data-sid')] = {
      id: event.target.getAttribute('data-sid'),
      url: event.target.value
    };
    this.setState({ userAssessments: userAssessments });
  };

  render() {
    const submitClass = this.state.assessmentSubmitSuccess
      ? 'success-message'
      : 'hidden';
    console.log(this.state.assessmentsList.length);
    if (this.state.assessmentsList.length) {
      return (
        <div
          ref={elem => (this.elem = elem)}
          className="col-md-offset-1 col-md-9"
        >
          <div className={submitClass}>
            Assessment has been submitted successfully!
          </div>
          {this.state.assessmentsList.map((assessment, index) => {
            return (
              <div key={index} data-subcourseid={this.state.subcourseId}>
                <h2>{assessment.title.rendered}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(assessment.content.rendered, {
                      allowedTags: ['p', 'i', 'em', 'strong']
                    })
                  }}
                />
                <div className="solution-group">
                  <label htmlFor="">Please enter the Github URL: </label>
                  <input
                    type="text"
                    id={this.state.subcourseId + '_' + index}
                    data-id={this.state.subcourseId}
                    data-sid={index + 1}
                    onChange={this.handleChange}
                    value={
                      Object.keys(this.state.userAssessments).length > index
                        ? this.state.userAssessments[index + 1].url
                        : ''
                    }
                  />
                  <button
                    className="btn btn-default"
                    onClick={this.submitSolution}
                  >
                    {(Object.keys(this.state.userAssessments).length > index
                    ? this.state.userAssessments[index + 1].url
                    : '')
                      ? 'Edit'
                      : 'Submit'}
                  </button>
                </div>
              </div>
            );
          })}
          <a
            href="#"
            className="redirectCourses"
            onClick={this.assessmentRedirect}
          >
            Go back to courses
          </a>
        </div>
      );
    } else {
      return (
        <div className="col-md-offset-1 col-md-9">
          <h2>
            No assessments available right now for this course. Check back
            later!
          </h2>
          <a
            href="#"
            className="redirectCourses"
            onClick={this.assessmentRedirect}
          >
            Go back to courses
          </a>
        </div>
      );
    }
  }
}

export default Assessment;
