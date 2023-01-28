import { Component } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import constant from "../utils/GlobalValues";
import AdminMiddleWare from "../utils/AdminMiddleware";
import { SystemLoadingPage } from "./SystemLoading/SystemLoadingPage";


class Profile extends Component {

    constructor(props){
        super(props);
        this.state = {
            username : "",
            firstname : "",
            passwordCurrent : "",
            passwordNew : "",
            passwordNewAgain : "",
            warning : "",
            success : "",

            isLaunched : false,
            isError: false,
            isLoading : false,
            isFetching : false
        }
        this.launch = this.launch.bind(this);
        this.clearWarning = this.clearWarning.bind(this);
        this.profileFormChangeListener = this.profileFormChangeListener.bind(this);
        this.save = this.save.bind(this);
    }
    componentDidMount(){
        this.launch();
    }

    launch(){
        ...
    }

    profileFormChangeListener(event){
        this.clearWarning();
        switch(event.target.name){
            case "username":
                this.setState({
                    username : event.target.value
                });
                break;
            case "firstname":
                this.setState({
                    firstname : event.target.value
                });
                break;
            case "passwordCurrent":
                this.setState({
                    passwordCurrent : event.target.value
                });
                break;
            case "passwordNew":
                this.setState({
                    passwordNew : event.target.value
                });
                break;
            case "passwordNewAgain":
                this.setState({
                    passwordNewAgain : event.target.value
                });
                break;
            default:
                break;
        }
    }


    clearWarning(){
        this.setState({
            warning : "",
            success : ""
        });
    }

    save(){
        ...
    }

    render(){
        if(!this.state.isLoading){
            return (
                <SystemLoadingPage />
            )
        }

        return(
            <div className="row page profile">
                <div className="col-12">
                    <Form>
                        <Form.Group controlId="formProfileUsername">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control type="email" name="username" placeholder="Логин" maxLength="216" defaultValue={this.state.username} 
                            onChange={this.profileFormChangeListener}
                            />
                            <Form.Text className="text-muted">
                                
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formProfilePosition">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control type="text" name="firstname" placeholder="Имя" maxLength="216" defaultValue={this.state.firstname}
                            onChange={this.profileFormChangeListener}
                            />
                        </Form.Group>

                        <hr />

                        <Form.Group controlId="formNewPassword">
                            <Form.Label>Новый пароль</Form.Label>
                            <Form.Control type="password" name="passwordNew" placeholder="Новый пароль" onChange={this.profileFormChangeListener} />
                        </Form.Group>

                        <Form.Group controlId="formPasswordNewAgain">
                            <Form.Label>Новый пароль еще раз</Form.Label>
                            <Form.Control type="password" name="passwordNewAgain" placeholder="Новый пароль еще раз" onChange={this.profileFormChangeListener} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Текущий пароль</Form.Label>
                            <Form.Control type="password" name="passwordCurrent" placeholder="Текущий пароль" onChange={this.profileFormChangeListener} />
                        </Form.Group>

                        <Button variant="success" type="button" onClick={this.save} disabled={this.state.isFetching}>
                            Сохранить
                        </Button>

                        <p className="warning">{this.state.warning}</p>
                        <p className="success">{this.state.success}</p>
                        
                    </Form>
                </div>
            </div>
        )
    }

}


export default function ProfilePage(props){
    const navigate = useNavigate();
    return(<Profile navigate={navigate}></Profile>)
}