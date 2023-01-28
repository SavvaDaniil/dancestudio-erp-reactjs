import { Component } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import UserContext from "../../store/UserContext";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import { Button } from "react-bootstrap";

class MainLayoutClass extends Component {

    static contextType = UserContext;

    constructor(props){
        super(props);
        this.actionLogout = this.actionLogout.bind(this);
    }

    actionLogout(){
        const adminMiddleWare = new AdminMiddleWare();
        adminMiddleWare.clearJWTCookie();
        const { logout } = this.context;
        logout();
        this.props.navigate("/login");
    }


    render(){

        let title = "Профиль";
        if((window.location.pathname).indexOf("/users") + 1){title = "База клиентов";}
        if((window.location.pathname).indexOf("/teacher_salaries") + 1){title = "Зарплаты";}
        if((window.location.pathname).indexOf("/abonements") + 1){title = "Абонементы";}
        if((window.location.pathname).indexOf("/teachers") + 1){title = "Преподаватели";}
        if((window.location.pathname).indexOf("/branches") + 1){title = "Филиалы";}
        if((window.location.pathname).indexOf("/dance_groups") + 1){title = "Общее расписание";}

        return (
            <>
                <div className="header">
                    <div className="left-panel">
                        <div className="short-info">
                            <p className="firstname">{localStorage.getItem("firstname")}</p>
                            <p className="position">Должность</p>
                        </div>
                    </div>
                    <div className="header-data">
                        <div className="row">
                            <div className="col-8">
                                <h3>{title}</h3>
                            </div>
                            <div className="col-4">
                                <div className="logout">
                                    <Button variant="danger" className="btn btn-sm" onClick={this.actionLogout}>Выйти</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="menu">
                    <div className="title">
                        <p>Навигация</p>
                    </div>
                    <ul>
                        <li><NavLink exact="true" activeclassname="active" to="/"><i className="fa fa-user"></i> Профиль</NavLink></li>
                        <li><NavLink exact="true" activeclassname="active" to="/visits"><i className="fa fa-list"></i> Занятия</NavLink></li>
                        <li><NavLink exact="true" activeclassname="active" to="/users"><i className="fa fa-users"></i> База клиентов</NavLink></li>
                        <li><NavLink exact="true" activeclassname="active" to="/teacher_salaries"><i className="fa fa-ruble"></i> Зарплаты</NavLink></li>
                        <li><NavLink exact="true" activeclassname="active" to="/abonements"><i className="fa fa-shopping-cart"></i> Абонементы</NavLink></li>
                        <li><NavLink exact="true" activeclassname="active" to="/teachers"><i className="fa fa-users"></i> Преподаватели</NavLink></li>
                        <li><NavLink exact="true" activeclassname="active" to="/dance_groups"><i className="fa fa-calendar"></i> Общее расписание</NavLink></li>
                        <li><NavLink exact="true" activeclassname="active" to="/branches"><i className="fa fa-home"></i> Филиалы</NavLink></li>
                    </ul>
                </div>

                <div className="main">
                    <Outlet changeTitle={this.changeTitle} />
                </div>

            </>
        )
    }
}

export default function MainLayout(props){
    const navigate = useNavigate();
    return(<MainLayoutClass {...props} navigate={navigate} params={useParams()}></MainLayoutClass>)
};