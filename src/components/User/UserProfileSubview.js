import { Component } from "react";
import UserService from "../../service/UserService";
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage";
import { SystemErrorPage } from "../../pages/SystemError/SystemErrorPage";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import { Form, Button } from "react-bootstrap";


export default class UserProfileSubview extends Component {

    constructor(props){
        super(props);
        this.state = {
            userService : new UserService(),

            isLoading: false,
            isSaving: false,
            isError : false,

            user_id : 0,
            username: "",
            password: "",
            secondname: "",
            firstname: "",
            patronymic: "",
            telephone: "",
            gender: 0,
            birthday: "",
            parent_fio: "",
            parent_phone: "",
            comment: "",
        }
        this.profileFormChangeListener = this.profileFormChangeListener.bind(this);
        this.getUserProfile = this.getUserProfile.bind(this);
        this.userProfileUpdate = this.userProfileUpdate.bind(this);
    }

    profileFormChangeListener(e){
        this.clearWarning();
        switch(e.target.name){
            case "username":
                this.setState({username : e.target.value});
                break;
            case "password":
                this.setState({password : e.target.value});
                break;
            case "secondname":
                this.setState({secondname : e.target.value});
                break;
            case "firstname":
                this.setState({firstname : e.target.value});
                break;
            case "patronymic":
                this.setState({patronymic : e.target.value});
                break;
            case "telephone":
                this.setState({telephone : e.target.value});
                break;
            case "gender":
                this.setState({gender : e.target.value});
                break;
            case "birthday":
                this.setState({birthday : e.target.value});
                break;
            case "parent_fio":
                this.setState({parent_fio : e.target.value});
                break;
            case "parent_phone":
                this.setState({parent_phone : e.target.value});
                break;
            case "comment":
                this.setState({comment : e.target.value});
                break;
            default:
                break;
        }
    }

    async getUserProfile(user_id){
        this.setState({isLoading : true, isError : false, user_id : user_id});

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.userService.getProfile(jwt, user_id);
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.userProfileViewModel !== null){
            this.setState({
                username: jsonAnswerStatus.userProfileViewModel.username,
                secondname: jsonAnswerStatus.userProfileViewModel.secondname,
                firstname: jsonAnswerStatus.userProfileViewModel.firstname,
                patronymic: jsonAnswerStatus.userProfileViewModel.patronymic,
                telephone: jsonAnswerStatus.userProfileViewModel.telephone,
                gender: jsonAnswerStatus.userProfileViewModel.gender,
                birthday: jsonAnswerStatus.userProfileViewModel.birthday,
                parent_fio: jsonAnswerStatus.userProfileViewModel.parent_fio,
                parent_phone: jsonAnswerStatus.userProfileViewModel.parent_phone,
                comment: jsonAnswerStatus.userProfileViewModel.comment,
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }

    async userProfileUpdate(){
        this.setState({isSaving : true, isError : false});

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.userService.update(
            jwt,
            this.state.user_id,
            this.state.username,
            this.state.password,
            this.state.secondname,
            this.state.firstname,
            this.state.patronymic,
            this.state.telephone,
            this.state.gender,
            this.state.birthday,
            this.state.parent_fio,
            this.state.parent_phone,
            this.state.comment
        );
        
        this.setState({isSaving : false});
        if(jsonAnswerStatus.status === "success"){
            this.setState({
                success : "Успешно сохранено"
            });
        } else {
            this.setState({
                warning : "Неизвестная ошибка на сервере"
            });
        }
    }

    clearWarning(){
        this.setState({
            warnning : "",
            success : ""
        });
    }

    render(){

        if(this.state.isLoading)return <SystemLoadingPage />
        if(this.state.isError)return <SystemErrorPage tryAgain={async() => await this.getUserProfile(this.state.user_id)} />
        
        return (
            <div className="subview user-profile">
                <Form>

                    <Form.Group controlId="formProfileSecondname">
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control type="text" name="secondname" placeholder="Фамилия" maxLength="216" defaultValue={this.state.secondname}
                        onChange={this.profileFormChangeListener}
                        />
                    </Form.Group>

                    <Form.Group controlId="formProfileFirstname">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control type="text" name="firstname" placeholder="Имя" maxLength="216" defaultValue={this.state.firstname}
                        onChange={this.profileFormChangeListener}
                        />
                    </Form.Group>

                    <Form.Group controlId="formProfilePatronymic">
                        <Form.Label>Отчество</Form.Label>
                        <Form.Control type="text" name="patronymic" placeholder="Отчество" maxLength="216" defaultValue={this.state.patronymic}
                        onChange={this.profileFormChangeListener}
                        />
                    </Form.Group>

                    <Form.Group controlId="formProfileTelephone">
                        <Form.Label>Телефон</Form.Label>
                        <Form.Control type="text" name="telephone" placeholder="Телефон" maxLength="216" defaultValue={this.state.telephone}
                        onChange={this.profileFormChangeListener}
                        />
                    </Form.Group>

                    <Form.Group controlId="formProfileGender">
                        <Form.Label>Пол</Form.Label>
                        <Form.Control as="select" name="gender" defaultValue={this.state.gender}
                        onChange={this.profileFormChangeListener}
                        >
                            <option value="0">- не выбрано</option>
                            <option value="1">Женский</option>
                            <option value="2">Мужской</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formProfileBirthday">
                        <Form.Label>Дата рождения</Form.Label>
                        <Form.Control type="date" name="birthday" placeholder="Дата рождения" defaultValue={this.state.birthday}
                        onChange={this.profileFormChangeListener}
                        />
                    </Form.Group>

                    <Form.Group controlId="formProfileParentFIO">
                        <Form.Label>ФИО родителя</Form.Label>
                        <Form.Control type="text" name="parent_fio" placeholder="ФИО родителя" maxLength="216" defaultValue={this.state.parent_fio}
                        onChange={this.profileFormChangeListener}
                        />
                    </Form.Group>

                    <Form.Group controlId="formProfileParentTelephone">
                        <Form.Label>Телефон родителя</Form.Label>
                        <Form.Control type="text" name="parent_phone" placeholder="Телефон родителя" maxLength="216" defaultValue={this.state.parent_phone}
                        onChange={this.profileFormChangeListener}
                        />
                    </Form.Group>

                    <Form.Group controlId="formProfileComment">
                        <Form.Label>Комментарий</Form.Label>
                        <Form.Control as="textarea" rows={5} name="comment" placeholder="Комментарий" defaultValue={this.state.comment}
                        onChange={this.profileFormChangeListener}
                        />
                    </Form.Group>

                    <hr />

                    <Form.Group controlId="formProfileUsername">
                        <Form.Label>Логин в приложении</Form.Label>
                        <Form.Control type="email" name="username" placeholder="Логин в приложении" maxLength="216" defaultValue={this.state.username} 
                        onChange={this.profileFormChangeListener}
                        />
                        <Form.Text className="text-muted">
                            
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formNewPassword">
                        <Form.Label>Новый пароль в приложении</Form.Label>
                        <Form.Control type="password" name="passwordNew" placeholder="Новый пароль" onChange={this.profileFormChangeListener} />
                    </Form.Group>

                    <Button variant="success" type="button" onClick={this.userProfileUpdate} disabled={this.state.isSaving}>
                        Сохранить
                    </Button>

                    <p className="warning">{this.state.warning}</p>
                    <p className="success">{this.state.success}</p>
                    
                </Form>
            </div>
        )
    }
}