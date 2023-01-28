import React, { Component } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DateConverter from "../utils/DateConverter";
import AdminMiddleWare from "../utils/AdminMiddleware";
import TeacherSalaryService from "../service/TeacherSalaryService";
import { SystemLoadingPage } from "./SystemLoading/SystemLoadingPage";
import TeacherSalaryLiteRow from "../components/TeacherSalary/TeacherSalaryLiteRow";
import { SystemErrorPage } from "./SystemError/SystemErrorPage";
import TeacherSalaryInfoModal from "../components/TeacherSalary/TeacherSalaryInfoModal";



class TeacherSalaries extends Component {

    constructor(props){
        super(props);
        const dateConverter = new DateConverter();
        this.state = {
            isLaunched : false,
            isLoading : false,
            isError: false,
            isSearching : false,

            teacherSalaryService : new TeacherSalaryService(),
            danceGroupMicroViewModels : [],
            teacherMicroViewModels : [],
            teacher_salary_id : 0,

            date_from : dateConverter.toStringLikeYmd(new Date()),
            date_to :  dateConverter.toStringLikeYmd(new Date()),
            dance_group_id : 0,
            teacher_id : 0,
            teacherSalaryLiteViewModels : [],
            modalDeleteTeacherSalaryIsShowing : false,
        }
        this.filterListener = this.filterListener.bind(this);
        this.getSearchPrepare = this.getSearchPrepare.bind(this);
        this.search = this.search.bind(this);
        this.refTeacherSalaryInfoModalBody = React.createRef();
        this.getMoreInfo = this.getMoreInfo.bind(this);
        this.modalTeacherSalaryDeleteOpen = this.modalTeacherSalaryDeleteOpen.bind(this);
        this.modalTeacherSalaryDeleteClose = this.modalTeacherSalaryDeleteClose.bind(this);
        this.deletePrepare = this.deletePrepare.bind(this);
        this.delete = this.delete.bind(this);
    }

    async componentDidMount(){
        await this.getSearchPrepare();
    }

    modalTeacherSalaryDeleteOpen(){
        this.setState({
            modalDeleteTeacherSalaryIsShowing : true
        });
    }

    modalTeacherSalaryDeleteClose(){
        this.setState({
            modalDeleteTeacherSalaryIsShowing : false
        });
    }

    filterListener(e){
        switch(e.target.name){
            case "date_from":
                this.setState({date_from : e.target.value});
                break;
            case "date_to":
                this.setState({date_to : e.target.value});
                break;
            case "dance_group_id":
                this.setState({dance_group_id : parseInt(e.target.value, 10)});
                break;
            case "teacher_id":
                this.setState({teacher_id :  parseInt(e.target.value, 10)});
                break;
            default:
                break;
        }
    }

    async getSearchPrepare(){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.teacherSalaryService.getSearchPrepare(jwt );

        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.teacherSalarySearchPrepareViewModel !== null){

            const danceGroupMicroViewModels = jsonAnswerStatus.teacherSalarySearchPrepareViewModel.danceGroupMicroViewModel.sort((a,b) => {
                return (a.name).localeCompare(b.name);
            });
            const teacherMicroViewModels = jsonAnswerStatus.teacherSalarySearchPrepareViewModel.teacherMicroViewModel.sort((a,b) => {
                return (a.name).localeCompare(b.name);
            });

            this.setState({
                danceGroupMicroViewModels : danceGroupMicroViewModels,
                teacherMicroViewModels : teacherMicroViewModels
            });
        } else {
            alert("Ошибка связи с сервером");
        }
    }

    async search(){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        this.setState({
            isLaunched : true,
            isLoading: true,
            isError: false
        });
        const jsonAnswerStatus = await this.state.teacherSalaryService.search(
            jwt,
            this.state.date_from,
            this.state.date_to,
            this.state.dance_group_id,
            this.state.teacher_id
        );
        //console.log(jsonAnswerStatus);

        this.setState({
            isLoading : false,
            isError : false
        });
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.teacherSalaryLiteViewModels !== null){
            this.setState({
                teacherSalaryLiteViewModels : jsonAnswerStatus.teacherSalaryLiteViewModels
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }

    getMoreInfo(teacher_salary_id){
        this.refTeacherSalaryInfoModalBody.current.getMoreInfo(teacher_salary_id)
    }

    deletePrepare(teacher_salary_id){
        this.setState({
            teacher_salary_id : teacher_salary_id
        }, function(){
            this.modalTeacherSalaryDeleteOpen();
        });
    }

    async delete(){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        this.setState({
            isLoading: true,
            isError: false
        });
        const jsonAnswerStatus = await this.state.teacherSalaryService.delete(
            jwt,
            this.state.teacher_salary_id
        );
        //console.log(jsonAnswerStatus);

        this.setState({
            isLoading : false,
            isError : false
        });
        if(jsonAnswerStatus.status === "success"){
            this.modalTeacherSalaryDeleteClose();
            this.search();
        } else {
            this.setState({
                isError : true
            });
        }
    }

    render(){

        let danceGroupMicroOptions = "";
        if(this.state.danceGroupMicroViewModels.length > 0){
            danceGroupMicroOptions = this.state.danceGroupMicroViewModels.map((danceGroupMicroViewModel) => {
                return <option key={danceGroupMicroViewModel.id} value={danceGroupMicroViewModel.id}>{danceGroupMicroViewModel.id} - {danceGroupMicroViewModel.name}</option>
            });
        }
        let teacherMicroOptions = "";
        if(this.state.teacherMicroViewModels.length > 0){
            teacherMicroOptions = this.state.teacherMicroViewModels.map((teacherMicroViewModel) => {
                return <option key={teacherMicroViewModel.id} value={teacherMicroViewModel.id}>{teacherMicroViewModel.id} - {teacherMicroViewModel.name}</option>
            })
        }

        let teacherSalariesTable = "";
        if(!this.state.isLaunched) {
            teacherSalariesTable = "";
        } else if(this.state.isLoading){
            teacherSalariesTable = <SystemLoadingPage />
        } else if(this.state.isError){
            teacherSalariesTable = <SystemErrorPage tryAgain={this.search} />
        } else if(this.state.teacherSalaryLiteViewModels.length === 0){
            teacherSalariesTable = <center><i>- записей не найдено -</i></center>
        } else {

            const teacherSalaryLiteRows = this.state.teacherSalaryLiteViewModels.map((teacherSalaryLiteViewModel) => {
                return <TeacherSalaryLiteRow
                    key={teacherSalaryLiteViewModel.id}
                    id={teacherSalaryLiteViewModel.id}
                    date_of_action={teacherSalaryLiteViewModel.date_of_action}
                    danceGroupMicroViewModel={teacherSalaryLiteViewModel.danceGroupMicroViewModel}
                    teacherMicroViewModel={teacherSalaryLiteViewModel.teacherMicroViewModel}
                    visits_count={teacherSalaryLiteViewModel.visits_count}
                    price={teacherSalaryLiteViewModel.price}
                    status={teacherSalaryLiteViewModel.status}

                    getMoreInfoCallback={this.getMoreInfo}
                    deletePrepareCallback={this.deletePrepare}
                />
            });

            teacherSalariesTable = <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Дата занятия</th>
                    <th>Группа</th>
                    <th>Преподаватель</th>
                    <th>Учеников</th>
                    <th>К оплате</th>
                    <th>Статус</th>
                    <th>
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {teacherSalaryLiteRows}
            </tbody>
        </Table>
        }

        return(
            <div className="row page teacher-salaries">
                <div className="col-12 row filter-block">
                    <div className="col-12">
                        <h5>Для получения списка зарплат выберите пожалуйста даты</h5>
                    </div>
                    <div className="col-12 col-lg-8 col-md-12 col-sm-12 div-form row">
                        <div className="col-12 col-lg-6 col-md-6 col-sm-12">
                            <Form>
                                <Form.Group controlId="formFilterDateFrom">
                                    <Form.Label>С даты:</Form.Label>
                                    <Form.Control type="date" name="date_from" defaultValue={this.state.date_from} 
                                    onChange={this.filterListener}
                                    />
                                </Form.Group>
                            </Form>
                        </div>
                        <div className="col-12 col-lg-6 col-md-6 col-sm-12">
                            <Form>
                                <Form.Group controlId="formFilterDateTo">
                                    <Form.Label>По дату:</Form.Label>
                                    <Form.Control type="date" name="date_to" defaultValue={this.state.date_to} 
                                    onChange={this.filterListener}
                                    />
                                </Form.Group>
                            </Form>
                        </div>

                        <div className="col-12 col-lg-6 col-md-6 col-sm-12">
                            <Form>
                                <Form.Group controlId="formFilteDanceGroup">
                                    <Form.Label>Фильтр по группе:</Form.Label>
                                    <Form.Control as="select" name="dance_group_id" defaultValue={this.state.dance_group_id} 
                                    onChange={this.filterListener}
                                    >
                                        <option value={0}>- любая</option>
                                        {danceGroupMicroOptions}
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </div>

                        <div className="col-12 col-lg-6 col-md-6 col-sm-12">
                            <Form>
                                <Form.Group controlId="formFilteTeacher">
                                    <Form.Label>Фильтр по преподавателю:</Form.Label>
                                    <Form.Control as="select" name="teacher_id" defaultValue={this.state.teacher_id} 
                                    onChange={this.filterListener}
                                    >
                                        <option value={0}>- любой</option>
                                        {teacherMicroOptions}
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </div>

                        <div className="col-12 text-right">
                            <Button variant="success" type="button" 
                            onClick={this.search} disabled={this.state.isLoading}
                            >
                                Поиск
                            </Button>
                        </div>

                    </div>
                    
                </div>

                <div className="col-12">
                    {teacherSalariesTable}
                </div>

                <TeacherSalaryInfoModal
                ref={this.refTeacherSalaryInfoModalBody}
                />

                
                <Modal
                show={this.state.modalDeleteTeacherSalaryIsShowing}
                onHide={this.modalDeleteTeacherSalaryClose}
                animation={false}
                size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Удалить зарплату</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Вы уверены, что хотите удалить зарплату ID {this.state.teacher_salary_id}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.delete} disabled={this.state.isLoading}>
                            Да
                        </Button>
                        <Button variant="secondary" onClick={this.modalTeacherSalaryDeleteClose}>
                            Закрыть окно
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }

}


export default function TeacherSalariesPage(props){
    const navigate = useNavigate();
    return(<TeacherSalaries navigate={navigate}></TeacherSalaries>)
}