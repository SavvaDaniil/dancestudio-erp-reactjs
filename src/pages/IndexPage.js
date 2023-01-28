import { Component } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../store/UserContext";
//import ActivityTab from "./ActivityTab.js";

//import constant from "../../utils/GlobalValues";

class IndexPageClass extends Component {

    static contextType = UserContext;


    constructor(props){
        super(props);
        this.state = {
            activeTabPanel : 0
        }
        /*
        //var isAuth = useContext(AuthStatusContext);
        this.btnMenuListener = this.btnMenuListener.bind(this);

        this.profileTabRef = createRef();
        this.docsTabsRef = createRef();
        this.coursesTabsRef = createRef();
        this.testResultsTabRef = createRef();
        this.messagesTabRef = createRef();
        */
    }

    /*
    btnMenuListener(index){
        switch(index){
            case 0:
                this.profileTabRef.current.profileGet();
                break;
            case 1:
                this.docsTabsRef.current.userDocsListAll();
                break;
            case 2:
                this.coursesTabsRef.current.listCoursePreviewsForUser();
                break;
            case 4:
                this.messagesTabRef.current.listAllParentPreviews();
                break;
            case 7:
                this.testResultsTabRef.current.listAllCourseResultLites();
                break;
            default:
                break;
        }
        this.setState({activeTabPanel : index});
    }

    componentDidMount(){
        document.title = "Личный кабинет";
        //const { user, setUser } = this.context
        //console.log("ProfilePage user.isAuthed: " + user.isAuthed);
    }

    profileTabUpdate(){
        this.profileTabRef.profileGet();
    }
    */

    render(){


        return(
            <div>
                IndexPage
            </div>
        )
    }
}


export default function IndexPage(props){
    const navigate = useNavigate();
    return(<IndexPageClass navigate={navigate}></IndexPageClass>)
}
