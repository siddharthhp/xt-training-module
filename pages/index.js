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

class Index extends Component {
  constructor(props) {
    super(props);
    this.authValidation = this.authValidation.bind(this);
    this.state = { subCourseList: [], loggedIn: false };
  }
  static async getInitialProps(context) {
    const courses = await fetch(`${Config.apiUrl}/wp-json/wp/v2/subcourses`);
    const courseList = await courses.json();
    return { courseList };
  }

  authValidation = async event => {
    const key = sessionStorage.getItem('AuthToken');
    if (key) {
      this.setState({ loggedIn: true });
    }
  };

  componentDidMount() {
    this.authValidation();
    const isSubcourseSelected = sessionStorage.getItem('subcourseId');
    if (isSubcourseSelected) {
      sessionStorage.removeItem('subcourseId');
    }
  }

  fetchSubCourseList = async subcourseId => {
    const subCourseList = await fetch(
      `${
        Config.apiUrl
      }/wp-json/wp/v2/courses?subcourses=${subcourseId}&filter[orderby]=menu_order`
    );
    this.setState({ subCourseList: await subCourseList.json() });
  };
  render() {
    const isLoggedIn = this.state.loggedIn;
    return (
      <Layout
        isLoggedIn={this.state.loggedIn}
        courseList={this.props.courseList}
        fetchSubCourseList={this.fetchSubCourseList}
        subCourseList={this.state.subCourseList}
      >
        <div className="col-md-9">
          {this.state.subCourseList.map((subcourse, index) => {
            if (index == 0) {
              return (
                <h1
                  id={subcourse.acf.contentid}
                  key={index}
                  dangerouslySetInnerHTML={{ __html: subcourse.title.rendered }}
                />
              );
            } else {
              return (
                <div key={index}>
                  <h2 id={subcourse.acf.contentid}>
                    {subcourse.acf.hreflink ? (
                      <a
                        href={subcourse.acf.hreflink}
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(subcourse.title.rendered, {
                            allowedTags: ['b', 'i', 'em', 'strong'],
                            allowedAttributes: {
                              a: ['href', 'target']
                            }
                          })
                        }}
                      />
                    ) : (
                      `${subcourse.title.rendered}`
                    )}
                  </h2>{' '}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: subcourse.content.rendered
                    }}
                  />
                </div>
              );
            }
          })}
        </div>
      </Layout>
    );
  }
}

export default PageWrapper(Index);
