import React, { Component } from "react"
import { useNavigate } from "react-router-dom";

import imgLogo from "../assets/images/logo.png"
import AdminMiddleWare from "../utils/AdminMiddleware";
import UserContext from "../store/UserContext";
import constant from "../utils/GlobalValues";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class LoginPage extends Component {

    static contextType = UserContext;

    constructor(props){
        super(props);
        this.state = {
            warning : "",
            username : "",
            password : "",
            isLoading : false
        }

        this.formLoginListener = this.formLoginListener.bind(this);
        this.loginRequest = this.loginRequest.bind(this);
        this.clearWarning = this.clearWarning.bind(this);
    }

    componentDidMount(){
        const {user} = this.context;
        console.log("context.isAuthed: " + user.isAuthed);
    }

    formLoginListener(e){
        this.clearWarning();
        switch(e.target.name){
            case "username":
                this.setState({username : e.target.value.trim()});
                break;
            case "password":
                this.setState({password : e.target.value.trim()});
                break;
            default:
                break;
        }
    }
    
    loginRequest(){
        this.clearWarning();
        if(this.state.username === "" || this.state.password === ""){
            this.setState({warning : "Все поля обязательны для заполнения"});
            return;
        }
        
        const data = {
            username: this.state.username,
            password : this.state.password
        }
        fetch(constant.baseDomain + "/api/admin/login", 
            {
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        )
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            if(result.status === "success" && result.access_token != null){
                const adminMiddleWare = new AdminMiddleWare();
                adminMiddleWare.setJWTToCookie(result.access_token);
                const { login } = this.context;
                login();
                this.props.navigate("/");
            } else if(result.status === "error" && result.errors === "wrong"){
                this.setState({warning : "Неверный логин или пароль"});
            } else if(result.status === "error" && result.errors === "accessDenied"){
                this.setState({warning : "Извините, запрещен доступ в систему"});
            } else {
                this.setState({warning : "Неизвестная ошибка на сервере"});
            }
            },
            (error) => {
                this.setState({warning : "Ошибка на стороне сервера"});
            }
        )
    }

    clearWarning(){
        this.setState({warning : ""});
    }


    render(){
        return (
            <div className="container">
                <div className="row">
                    <div className="col-4 d-none d-md-block"></div>
                    <div className="col-12 col-lg-4 col-md-4 col-sm-12">
                        <div className="page login">
                            <center>
                                <img src={imgLogo} alt="logo" />
                            </center>
                            <Form>
                                <Form.Group className="mb-3" controlId="formLoginUsername">
                                    <Form.Label>Логин</Form.Label>
                                    <Form.Control type="email" placeholder="Логин" name="username" onChange={this.formLoginListener} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control type="password" placeholder="Пароль" name="password" onChange={this.formLoginListener} />
                                </Form.Group>
                                <div className="text-center">
                                    <Button variant="success" type="button" onClick={this.loginRequest}>
                                        Войти
                                    </Button>
                                </div>
                                <p className="warning">{this.state.warning}</p>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export function LoginPageWithRouter(props){
    const navigate = useNavigate();
    return(<LoginPage navigate={navigate}></LoginPage>)
}

export default LoginPage;