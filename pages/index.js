import Layout from "../components/Layout.js";
import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import Auth from "../components/Auth.js";
import Login from "../components/Login.js";
import PageWrapper from "../components/PageWrapper.js";
import Menu from "../components/Menu.js";
import { Config } from "../config.js";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state={subCourseList : [], loggedIn: false};
    }
    static async getInitialProps(context) {
        const courses = await fetch(
            `${Config.apiUrl}/wp-json/wp/v2/subcourses`
        );
        const courseList = await courses.json();
        return { courseList };
    }

    authValidation = async (event) => {
        const key = sessionStorage.getItem('AuthToken');
        if (key) {
            this.setState({loggedIn: true});
        }
    }

    componentWillMount() {
        this.authValidation();
    }

    fetchSubCourseList = async (subcourseId) => {
        const subCourseList = await fetch(
            `${Config.apiUrl}/wp-json/wp/v2/courses?subcourses=${subcourseId}&filter[orderby]=menu_order`
        );
        this.setState({subCourseList : await subCourseList.json()});
    }
    render() {
        const isLoggedIn = this.state.loggedIn;
        return (
            <Layout isLoggedIn={isLoggedIn} courseList={this.props.courseList} fetchSubCourseList={this.fetchSubCourseList} subCourseList={this.state.subCourseList}>
                 <div className='col-md-9'>
                {
                    this.state.subCourseList.map((subcourse,index) => {
                        if(index == 0){
                            return (<h4 id={subcourse.acf.contentid} key={index} dangerouslySetInnerHTML={{__html: subcourse.title.rendered }}></h4>)
                        }else{
                            return (<div key={index} >
                                <h2 id={subcourse.acf.contentid} dangerouslySetInnerHTML={{__html: subcourse.title.rendered }}></h2> <div dangerouslySetInnerHTML={{__html: subcourse.content.rendered }} /></div>)
                        }
                    })
                }
                </div>
            </Layout>
        );
    }
}

export default PageWrapper(Index);
