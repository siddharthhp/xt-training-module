import React, { Component } from 'react';
import Link from 'next/link';
import { Config } from '../config.js';
import sanitizeHtml from 'sanitize-html';

class Menu extends Component {
  constructor() {
    super();
    this.handleAssessment = this.handleAssessment.bind(this);
  }

  handleAssessment = event => {
    event.preventDefault();
    const subcourseId = event.target.getAttribute('data-subcourse');
    sessionStorage.setItem('subcourseId', subcourseId);
    window.location.href = '/assessment';
  };
  render() {
    const subcourse = this.props.subCourseList[0]
      ? this.props.subCourseList[0].subcourses[0]
      : '';
    const isLoggedIn = this.props.isLoggedIn;
    const liClass = isLoggedIn ? 'assessment' : 'hidden';
    return (
      <div ref={elem => (this.elem = elem)} className="col-md-3">
        <div
          className="bs-sidebar hidden-print affix well"
          role="complementary"
        >
          <ul className="nav bs-sidenav">
            <li className={liClass}>
              <a
                href="#"
                data-subcourse={subcourse}
                onClick={this.handleAssessment}
              >
                Submit Assessments
              </a>
            </li>
            {this.props.subCourseList.map((subcourse, index) => {
              return (
                <li key={index} className={index == 0 ? 'main active' : ''}>
                  <a
                    href={`#${subcourse.acf.contentid}`}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(subcourse.title.rendered, {
                        allowedTags: ['b', 'i', 'em', 'strong'],
                        allowedAttributes: {
                          a: ['href', 'target']
                        }
                      })
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Menu;
