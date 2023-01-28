
import React, {Component} from "react";
import {Button, Form, Modal, Table} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import AdminMiddleWare from "../utils/AdminMiddleware";
import TeacherService from "../service/TeacherService";
import TeacherLiteRow from "../components/Teacher/TeacherLiteRow";
import { SystemLoadingPage } from "./SystemLoading/SystemLoadingPage";
import TeacherEdit from "../components/Teacher/TeacherEdit";
//import TeacherCard from "./Teacher/TeacherCard";
//import TeacherTableTr from "./Teacher/TeacherTableTr";


class Teachers extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLaunch : false,
            isLoading : false,
            isError : false,
            teacherService : new TeacherService(),

            teacherLiteViewModels : [],
            teacher_id : 0,
            teacher_name : "",
            new_teacher_name : "",

            modalDeleteTeacherIsShowing : false,

            teacherInfoViewModel : null,

            modalNewTeacherIsShowing : false,
            modalTeacherIsShowing : false,
            newTeacherFIO : "",
            contentArray : [],
            id_of_teacher_modal : "",

            modalTeacherId : "",
            getTeacher : "",
            teacherPhotoSrc : "",
            teacherRateList : null
        }

        this.listAllLites = this.listAllLites.bind(this);

        this.inputNewTeacherNameListener = this.inputNewTeacherNameListener.bind(this);

        this.deletePrepare = this.deletePrepare.bind(this);


        this.modalDeleteTeacherOpen = this.modalDeleteTeacherOpen.bind(this);
        this.modalDeleteTeacherClose = this.modalDeleteTeacherClose.bind(this);
        this.deleteTeacher = this.deleteTeacher.bind(this);

        this.modalNewTeacherOpen = this.modalNewTeacherOpen.bind(this);
        this.modalNewTeacherClose = this.modalNewTeacherClose.bind(this);

        this.modalEditTeacherOpen = this.modalEditTeacherOpen.bind(this);
        this.modalEditTeacherClose = this.modalEditTeacherClose.bind(this);

        this.addNewTeacher = this.addNewTeacher.bind(this);
        this.getTeacher = this.getTeacher.bind(this);
        this.refreshTeacher = this.refreshTeacher.bind(this);
    }

    async componentDidMount(){
        await this.listAllLites();
    }

    async listAllLites(){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        this.setState({
            isLoading: true,
            isError: false
        });
        const jsonAnswerStatus = await this.state.teacherService.listAllLites(jwt);
        
        this.setState({
            isLoading: false
        });
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.teacherLiteViewModels !== null){
            this.setState({
                teacherLiteViewModels : jsonAnswerStatus.teacherLiteViewModels
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }

    async addNewTeacher(){
        if(this.state.new_teacher_name === ""){
            alert("Поля 'имя' обязательно для заполнения");
            return;
        }

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.teacherService.add(jwt, this.state.new_teacher_name);
        
        if(jsonAnswerStatus.status === "success"){
            this.modalNewTeacherClose();
            this.listAllLites();
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }

    inputNewTeacherNameListener(e){
        this.setState({
            new_teacher_name : e.target.value
        });
    }

    async deleteTeacher(){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.teacherService.delete(jwt, this.state.teacher_id);

        if(jsonAnswerStatus.status === "success"){
            this.modalDeleteTeacherClose();
            this.listAllLites();
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }

    async getTeacher(teacher_id){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.teacherService.get(jwt, teacher_id);

        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.teacherInfoViewModel !== null){
            this.setState({
                teacherInfoViewModel : jsonAnswerStatus.teacherInfoViewModel
            });
            this.modalEditTeacherOpen();
        } else {
            alert("Неизвестная ошибка на сервере");
        }

    }
    
    modalDeleteTeacherOpen(){
        this.setState({
            modalDeleteTeacherIsShowing : true
        });
    }
    modalDeleteTeacherClose(){
        this.setState({
            modalDeleteTeacherIsShowing : false
        });
    }
    deletePrepare(teacher_id, teacher_name){
        this.setState({
            teacher_id : teacher_id,
            teacher_name : teacher_name
        });
        this.modalDeleteTeacherOpen();
    }


    modalNewTeacherOpen(){
        this.setState({
            modalNewTeacherIsShowing : true
        });
    }
    modalNewTeacherClose(){
        this.setState({
            modalNewTeacherIsShowing : false
        });
    }
    modalEditTeacherOpen(){
        this.setState({
            modalTeacherIsShowing : true
        });
    }
    modalEditTeacherClose(){
        this.setState({
            modalTeacherIsShowing : false
        });
    }

    refreshTeacher(id_of_teacher){
        this.modalTeacherClose();
        this.getTeacher(id_of_teacher);
    }


    render(){
        let teacherLitesTable = <center><i>Преподавателей не найдено</i></center>;
        let teacherLiteRows = [];
        if(this.state.isLoading){
            teacherLitesTable = <SystemLoadingPage />
        } else {
            teacherLiteRows = this.state.teacherLiteViewModels.map((content, index) => {
                return <TeacherLiteRow
                key={index}
                id={content.id}
                name={content.name}
    
                deletePrepare={this.deletePrepare}
                getTeacher={this.getTeacher}
                //openModalPreDeleteTeacher={this.openModalPreDeleteTeacher}
                />
            })

            teacherLitesTable = <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ФИО</th>
                        <th>Имеет ли группы в расписании</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {teacherLiteRows}
                </tbody>
            </Table>
        }

        const teacherInfoContent = this.state.teacherInfoViewModel === null ? "" : <TeacherEdit
            id={this.state.teacherInfoViewModel.id}
            name={this.state.teacherInfoViewModel.name}
            poster_src={this.state.teacherInfoViewModel.poster_src}
            stavka={this.state.teacherInfoViewModel.stavka}
            min_students={this.state.teacherInfoViewModel.min_students}
            raz={this.state.teacherInfoViewModel.raz}
            usual={this.state.teacherInfoViewModel.usual}
            unlim={this.state.teacherInfoViewModel.unlim}
            stavka_plus={this.state.teacherInfoViewModel.stavka_plus}
            plus_after_students={this.state.teacherInfoViewModel.plus_after_students}
            plus_after_summa={this.state.teacherInfoViewModel.plus_after_summa}
            procent={this.state.teacherInfoViewModel.procent}

            teacherRateLiteViewModels={this.state.teacherInfoViewModel.teacherRateLiteViewModels}

            refresh={this.getTeacher}
        />

        return(
            <div className="row page teachers">

                <div className="col-12">
                    <Button variant="secondary" type="button" onClick={this.modalNewTeacherOpen}>
                        Добавить
                    </Button>
                </div>

                <div className="col-12">
                    {teacherLitesTable}
                </div>


                <Modal
                show={this.state.modalNewTeacherIsShowing}
                onHide={this.modalNewTeacherClose}
                animation={false}
                size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Новый преподаватель</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>

                            <Form.Group controlId="formNewTeacherFIO">
                                <Form.Label>ФИО (обязательно)</Form.Label>
                                <Form.Control type="text" placeholder="ФИО" maxLength="216" onChange={this.inputNewTeacherNameListener} />
                            </Form.Group>

                        </Form>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.addNewTeacher}>
                            Добавить
                        </Button>
                        <Button variant="secondary" onClick={this.modalNewTeacherClose}>
                            Закрыть окно
                        </Button>
                    </Modal.Footer>
                </Modal>

                


                <Modal
                show={this.state.modalTeacherIsShowing}
                onHide={this.modalEditTeacherClose}
                animation={false}
                size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Карточка преподавателя</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        {teacherInfoContent}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.modalEditTeacherClose}>
                            Закрыть окно
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal
                show={this.state.modalDeleteTeacherIsShowing}
                onHide={this.modalDeleteTeacherClose}
                animation={false}
                size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Удалить преподавателя</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Вы уверены, что хотите удалить преподавателя "{this.state.teacher_name}"?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.deleteTeacher}>
                            Да
                        </Button>
                        <Button variant="secondary" onClick={this.modalDeleteTeacherClose}>
                            Закрыть окно
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

}


export default function TeachersPage(props){
    const navigate = useNavigate();
    return(<Teachers navigate={navigate}></Teachers>)
}