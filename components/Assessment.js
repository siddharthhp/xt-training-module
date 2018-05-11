import Layout from "../components/Layout.js";
import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import Auth from "../components/Auth.js";
import Login from "../components/Login.js";
import PageWrapper from "../components/PageWrapper.js";
import Menu from "../components/Menu.js";
import { Config } from "../config.js";
import sanitizeHtml from 'sanitize-html';

class Assessment extends Component {
    constructor() {
        super();
        this.filterAssessmentList = this.filterAssessmentList.bind(this);
        this.assessmentRedirect = this.assessmentRedirect.bind(this);
        this.submitSolution = this.submitSolution.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = { assessmentSolutionList: {}, assessmentsList: [], subcourseId: '', userAssessments: {} };
    }

    componentWillMount() {
        this.filterAssessmentList();
    }

    assessmentRedirect = (event) => {
        event.preventDefault();
        sessionStorage.removeItem('subcourseId');
        window.location.href = "./";
    }

    filterAssessmentList = async () => {
        const filterParam = sessionStorage.getItem('subcourseId');
        this.setState({subcourseId: filterParam});
        this.state.assessmentsList = this.props.assessmentsList.filter(assessment => {return assessment.subcourses[0] === Number(sessionStorage.getItem('subcourseId'))}).reverse();
        let user_id = sessionStorage.getItem('id');
        let solutionList = await fetch(`${Config.apiUrl}/wp-json/wp/v2/users/${user_id}`);
        solutionList = await solutionList.json();
        const assessmentSolutionList = solutionList.acf ? JSON.parse(solutionList.acf.assessment) : '';
        this.setState({userAssessments: assessmentSolutionList});
        console.log(this.state.assessmentSolutionList[filterParam]);
    }

    submitSolution = async (event) => {
        event.preventDefault();
        let input = event.target.previousSibling;
        let value = input.value;
        let id = input.dataset.id;
        let sid = input.dataset.sid;
        let user_id = sessionStorage.getItem('id');

        let assessment = this.state.userAssessments;
        assessment[id] = assessment[id] || {};
        assessment[id][sid] = {
            'id': sid,
            'url': value
        }
        this.setState({userAssessments: assessment});
        let form = new FormData();
        form.append('fields[assessment]', JSON.stringify(this.state.userAssessments));

        return fetch(`${Config.apiUrl}/wp-json/acf/v3/users/${user_id}`, {
            method: 'POST',
            body: form
        }).then(res => {
            if (!res.ok) {
                throw Error(res.statusText);
                console.log(res);
            }

            return res.json();
        });
    }

    handleChange = (event) => {}

  render() {
    return(
      <div ref = {elem => this.elem = elem}  className ="col-md-offset-1 col-md-9">
        {
            this.state.assessmentsList.map((assessment,index) => {
                return(
                    <div key={index} data-subcourseid = {this.state.subcourseId}>
                        <h2>{assessment.title.rendered}</h2>
                        <div dangerouslySetInnerHTML={{__html: sanitizeHtml(assessment.content.rendered, {
                        allowedTags: ['p', 'i', 'em', 'strong']
                        }
                      )
                  }} />
                <div className="solution-group">
                    <label htmlFor="">Please enter the Github URL: </label>
                    <input type="text" id={this.state.subcourseId + '_' + index} data-id={this.state.subcourseId} data-sid={index+1} onChange={this.handleChange} />
                    <button className="btn btn-default" onClick={this.submitSolution}>Submit</button>
                </div>
                    </div>
                )
          })
        }
        <a href="#" className="redirectCourses" onClick={this.assessmentRedirect}>Go back to courses</a>
      </div>
    );
  }
}

export default Assessment;
