import Helmet from "react-helmet";
import Header from "./Header";
import Menu from "./Menu";

const Layout = props => (
    <div className = "container">
    	<Helmet>
	        <link rel="stylesheet" href="/static/styles/style.css" />
	    </Helmet>
	    <Header isLoggedIn={props.isLoggedIn} courseList={props.courseList} fetchSubCourseList={props.fetchSubCourseList}/>
        <Menu isLoggedIn={props.isLoggedIn} subCourseList={props.subCourseList} />
        {props.children}
    </div>
);

export default Layout;
