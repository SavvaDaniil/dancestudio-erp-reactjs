import { Component } from "react";
import UserService from "../../service/UserService";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import { Form, Button, Modal } from "react-bootstrap";


export default class UserAddModal extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            userService : new UserService(),
            isLoading : false,
            modalAddUserIsShowing : false,
            newUserSecondname : "",
            newUserFirstname : "",
            newUserTelephone : "",
            newUserComment : "",
        }

        this.modalAddNewUserOpen = this.modalAddNewUserOpen.bind(this);
        this.modalAddNewUserClose = this.modalAddNewUserClose.bind(this);
        this.newUserFormListener = this.newUserFormListener.bind(this);
        this.addUser = this.addUser.bind(this);
    }

    modalAddNewUserOpen(){
        this.setState({
            modalAddUserIsShowing : true
        });
    }

    modalAddNewUserClose(){
        this.setState({
            modalAddUserIsShowing : false
        });
    }
    async addUser(){
        if(this.state.newUserSecondname === "" || this.state.newUserFirstname === ""){
            alert("Поля 'фамилия' и 'имя' обязательны для заполнения");
            return;
        }
        this.setState({isLoading : true});
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.userService.add(
            jwt, 
            this.state.newUserSecondname,
            this.state.newUserFirstname,
            this.state.newUserTelephone,
            this.state.newUserComment
        );
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success"){
            //this.props.addUserCallback();
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }

    newUserFormListener(e){
        switch(e.target.name){
            case "secondname":
                this.setState({newUserSecondname : e.target.value});
                break;
            case "firstname":
                this.setState({newUserFirstname : e.target.value});
                break;
            case "telephone":
                this.setState({newUserTelephone : e.target.value});
                break;
            case "comment":
                this.setState({newUserComment : e.target.value});
                break;
            default:
                break;
        }
    }



    render(){
        return(
            <>
                <Button type="button" variant="success" 
                onClick={this.modalAddNewUserOpen} 
                disabled={this.state.isLoading}
                >
                    <i className="fa fa-plus"></i> Добавить
                </Button>
                
                <Modal
                    show={this.state.modalAddUserIsShowing}
                    onHide={this.modalAddNewUserClose}
                    animation={false}
                    size="lg"
                    >
                    <Modal.Header closeButton>
                        <Modal.Title>Новый клиент</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Фамилия</Form.Label>
                                <Form.Control name="secondname" type="text" placeholder="Фамилия" maxLength="216" 
                                onChange={this.newUserFormListener} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Имя</Form.Label>
                                <Form.Control name="firstname" type="text" placeholder="Имя" maxLength="216" 
                                onChange={this.newUserFormListener} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Телефон</Form.Label>
                                <Form.Control name="telephone" type="text" placeholder="Телефон" maxLength="216" 
                                onChange={this.newUserFormListener} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Комментарий</Form.Label>
                                <Form.Control name="comment" as="textarea" rows={5} maxLength="50000" 
                                onChange={this.newUserFormListener} />
                            </Form.Group>
                        </Form>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.addUser}>
                            Добавить
                        </Button>
                        <Button variant="secondary" onClick={this.modalAddNewUserClose}>
                            Закрыть окно
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

}