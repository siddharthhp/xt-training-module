import React, { Component } from "react";
import Link from "next/link";
import Head from "next/head";
import Menu from "./Menu.js";
import { Config } from "../config.js";
import { Modal, Button } from 'react-bootstrap';
import sanitizeHtml from 'sanitize-html';

class Header extends Component {
    constructor() {
        super();
        this.courseItemClickHandler = this.courseItemClickHandler.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
        this.logout = this.logout.bind(this);
        this.userSectionClick = this.userSectionClick.bind(this);

        this.state = {
            showSearchPopup: false,
            searchResult : [],
            userName: ''
        };
    }
    componentDidMount() {
        this.props.fetchSubCourseList(this.elem.querySelectorAll('li.active')[0].getAttribute('data-courseid'));        
        const userDetail = sessionStorage.getItem('Name');
        if(userDetail) {
            this.setState({userName: userDetail});
        }
    }
    closePopup = () => {
        this.setState({ showSearchPopup: false });
    }

    showPopup = () => {        
        this.setState({ showSearchPopup: true,searchResult: [] });
    }
    triggerSearch = async (event) => {
        console.log("trigger search" + event.currentTarget.value)
        const searchResult = await fetch(
            `${Config.apiUrl}/wp-json/wp/v2/courses?search=${event.currentTarget.value}&filter[orderby]=menu_order`
        );
        this.setState({searchResult : await searchResult.json()});
        console.log(this.state.searchResult)
    }
    courseItemClickHandler = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        var currElement = event.currentTarget;
        var activeElement = currElement.closest('.navbar-nav').querySelectorAll('li.active')[0];
        if (activeElement) {
            activeElement.classList.remove('open','active');
        }
        currElement.classList.add('active');
        if (currElement.classList.contains('dropdown')) {
            currElement.classList.add('open');
        } else {
            this.props.fetchSubCourseList(currElement.getAttribute('data-courseid'));
        }
        console.log(this.elem.querySelectorAll('#assessment')[0]);
    }
    subCourseItemClickHandler = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        var currElement = event.currentTarget;
        currElement.parentElement.closest('li').classList.remove('open','active');
        this.props.fetchSubCourseList(currElement.getAttribute('data-courseid'));
        console.log(this.elem.querySelectorAll('#assessment')[0]);
    }
    nextClickHandler = async (event) => {
        var courses = this.elem.querySelectorAll('.course-list li:not(.dropdown)');
        this.selectCourse(event,"next");
        if (courses[0].classList.contains('active')) {
            event.currentTarget.parentElement.previousElementSibling.classList.add('disabled');
        } else if (courses[courses.length - 1].classList.contains('active')) {
            event.currentTarget.parentElement.classList.add('disabled');
        } else {
            event.currentTarget.parentElement.classList.remove('disabled');
            event.currentTarget.parentElement.previousElementSibling.classList.remove('disabled');
        }
    }
    previousClickHandler = async (event) => {
        var courses = this.elem.querySelectorAll('.course-list li:not(.dropdown)');
        this.selectCourse(event,"prev");
        if (courses[0].classList.contains('active')) {
            event.currentTarget.parentElement.classList.add('disabled');
        } else if (courses[courses.length - 1].classList.contains('active')) {
            event.currentTarget.parentElement.nextElementSibling.classList.add('disabled');
        } else {
            event.currentTarget.parentElement.classList.remove('disabled');
            event.currentTarget.parentElement.nextElementSibling.classList.remove('disabled');
        }
    }
    selectCourse = (event,position) => {
        event.preventDefault();
        event.stopPropagation();
        var courses = this.elem.querySelectorAll('.course-list li:not(.dropdown)');
        var activeElement = this.elem.querySelectorAll('.course-list li.active:not(.dropdown)')[0];
        var currElement = courses[Array.prototype.indexOf.call(courses,activeElement)];
        var selectedElem = position == "next" ? courses[Array.prototype.indexOf.call(courses,activeElement) + 1] 
                            : courses[Array.prototype.indexOf.call(courses,activeElement) - 1];
        if (currElement) {
            currElement.classList.remove('open','active');
        }
        if (selectedElem.parentElement.closest('li') && selectedElem.parentElement.closest('li').classList.contains('dropdown')) {
            selectedElem.parentElement.closest('li').classList.add('active');
        } else if (this.elem.querySelectorAll('.course-list li.active.dropdown')[0]){
            this.elem.querySelectorAll('.course-list li.active.dropdown')[0].classList.remove('active');
        }
        selectedElem.classList.add('active');
        this.props.fetchSubCourseList(selectedElem.getAttribute('data-courseid'));
    }
    searchItemClickHandler = (event) => {
        event.preventDefault();
        var courses = this.elem.querySelectorAll('.course-list li:not(.dropdown)');
        var contentId = event.currentTarget.getAttribute('data-contentid');
        this.closePopup();
        console.log("searchItemClickHandler",event.currentTarget.getAttribute('data-courseid'))
        for(var i=0;i<courses.length;i++) {
            if (courses[i].getAttribute('data-courseid') == event.currentTarget.getAttribute('data-courseid')) {
                courses[i].click();
                setTimeout (() => {
                    document.getElementById(contentId).scrollIntoView();
                },500)
                return false;
            }
        }
    }

    logout = async (event) => {
        event.preventDefault();
        sessionStorage.clear();
        window.location.href = "./";
    }

    userSectionClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        var currElement = event.currentTarget;
        if (currElement.classList.length) {
            currElement.classList.remove('dropdown','open','active');
        } else {
            currElement.classList.add('active', 'dropdown', 'open');
        }
    }

    render() {
        const userSection = this.props.isLoggedIn;
        this.props.courseList.filter((course) => {
            course.subcourseList = [];
            return course.parent != 0;
        }).map((subcourse) => {
            this.props.courseList.map((course,index) => {
                if (subcourse.parent == course.id){
                    course.subcourseList.push({description:subcourse.description,id:subcourse.id});
                }
            })
        })
        return (
            <div className="navbar navbar-default navbar-fixed-top" role="navigation" ref = {elem => this.elem = elem}>
                <div className ="container">
                    <div className ="navbar-header">
                        <button type="button" className ="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                            <span className ="sr-only">Toggle navigation</span>
                            <span className ="icon-bar"></span>
                            <span className ="icon-bar"></span>
                            <span className ="icon-bar"></span>
                        </button>
                        <a className ="navbar-brand" href="#">XT-Trainings Documentation</a>
                    </div>
                    <div className ="navbar-collapse collapse">
                        <ul className ="nav navbar-nav course-list">
                        {   
                            this.props.courseList.map((course,index) => {
                                if (course.parent == 0) {
                                    return (<li key={index} data-courseid={course.id} className ={index == 0 ? "active" : course.subcourseList.length ? "dropdown" : ""} onClick={this.courseItemClickHandler}>
                                        <a href="." className = {course.subcourseList.length ? "dropdown-toggle" : ""}>{course.description}<b className="caret"></b></a>
                                        <ul className ="dropdown-menu">   
                                         {course.subcourseList.map((subcourse,index) => {
                                                return (                         
                                                    <li key={index} data-courseid={subcourse.id} onClick={this.subCourseItemClickHandler}>
                                                        <a href="#">{subcourse.description}</a>
                                                    </li>
                                                    
                                                )
                                            }
                                        )} 
                                        </ul>
                                    </li>)
                                }
                                
                            })
                        }
                        </ul>

                        <ul className ="nav navbar-nav navbar-right">
                            <li>
                                <a href="#" data-toggle="modal" data-target="#mkdocs_search_modal" onClick={this.showPopup}>
                                    <i className ="fa fa-search"></i> Search
                                </a>
                            </li>
                            <li className ="disabled">
                                <a rel="next" onClick={this.previousClickHandler}>
                                    <i className ="fa fa-arrow-left"></i> Previous
                                </a>
                            </li>
                            <li>
                                <a rel="prev"  onClick={this.nextClickHandler}>
                                    Next <i className ="fa fa-arrow-right"></i>
                                </a>
                            </li>
                            {userSection ? (<li onClick={this.userSectionClick}><span className="dropdown-toggle">Hello {this.state.userName}<b className="caret"></b></span><ul className="dropdown-menu"><li><a href="#" onClick={this.logout}>Logout</a></li></ul></li>) : (<li><Link href="/login">Login</Link></li>)}
                        </ul>
                    </div>
                </div>
                <Modal show={this.state.showSearchPopup} onHide={this.closePopup}>
                    <Modal.Header closeButton>
                        <Modal.Title>Search</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>From here you can search these documents. Enter your search terms below.</p>
                        <input type="text" className="form-control" placeholder="Search..." onChange={this.triggerSearch} />
                    </Modal.Body>
                    <Modal.Footer>
                        <ul className ="nav navbar-nav">
                        {   
                            this.state.searchResult.map((course,index) => {
                                return (<li className='col-xs-12 text-left' key={index} data-courseid={course.subcourses[0]} data-contentid={course.acf.contentid} onClick={this.searchItemClickHandler}>
                                    <a href="." dangerouslySetInnerHTML={{__html: sanitizeHtml(course.title.rendered, {
                                            allowedTags: ['b', 'i', 'em', 'strong'],
                                            allowedAttributes: {
                                            a: ['href', 'target']
                                            }
                                        })
                                    }}/>
                                    
                                </li>)
                                
                            })
                        }
                        </ul>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default Header;
