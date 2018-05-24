import Helmet from 'react-helmet';
import Header from './Header';
import Menu from './Menu';
import Head from 'next/head';

const Layout = props => (
  <div className="container">
    <Head>
      <title>XT Trainings - Internal</title>
      <link rel="stylesheet" href="/static/styles/style.css" />
      <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.0.13/css/all.css"
        integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp"
        crossorigin="anonymous"
      />
    </Head>
    <Header
      isLoggedIn={props.isLoggedIn}
      courseList={props.courseList}
      fetchSubCourseList={props.fetchSubCourseList}
    />
    <Menu isLoggedIn={props.isLoggedIn} subCourseList={props.subCourseList} showCourseMenu={props.showCourseMenu}/>
    {props.children}
  </div>
);

export default Layout;
