import React, { Component } from "react"
import TeacherSalaryService from "../../service/TeacherSalaryService";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import { Button, Modal } from "react-bootstrap";
import TeacherSalaryInfoModalBody from "./TeacherSalaryInfoModalBody";


export default class TeacherSalaryInfoModal extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading : false,
            isError: false,
            warning : "",
            success : "",

            teacherSalaryService : new TeacherSalaryService(),
            teacher_salary_id : 0,
            visitLiteViewModels : [],

            modalTeacherSalaryInfoIsShowing : false,

            danceGroupId : 0,
            danceGroupName : "",
            teacherName : "",

            teacherSalaryPriceAuto : 0,
            teacherSalaryisChangedByAdmin : false,
            teacherSalaryPriceFact : 0,
            
            dateOfAction : new Date(),
        }
        this.modalTeacherSalaryInfoOpen = this.modalTeacherSalaryInfoOpen.bind(this);
        this.modalTeacherSalaryInfoClose = this.modalTeacherSalaryInfoClose.bind(this);
        this.getMoreInfo = this.getMoreInfo.bind(this);
        this.teacherSalaryFormListener = this.teacherSalaryFormListener.bind(this);
        this.clearWarning = this.clearWarning.bind(this);
        this.update = this.update.bind(this);
    }

    modalTeacherSalaryInfoOpen(){
        this.setState({
            modalTeacherSalaryInfoIsShowing : true
        });
    }

    modalTeacherSalaryInfoClose(){
        this.setState({
            modalTeacherSalaryInfoIsShowing : false
        });
    }

    teacherSalaryFormListener(e){
        this.clearWarning();
        switch(e.target.name){
            case "price_fact":
                this.setState({teacherSalaryPriceFact : e.target.value});
                break;
            default:
                break;
        }
    }

    clearWarning(){
        this.setState({
            warnning : "",
            success : ""
        });
    }

    async update(name, value){
        if(name !== "price_fact" && name !== "is_changed_by_admin")return;
        if(name === "price_fact"){
            value = this.state.teacherSalaryPriceFact
        }

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        this.setState({
            isLoading: true,
            isError: false
        });
        const jsonAnswerStatus = await this.state.teacherSalaryService.update(
            jwt,
            this.state.teacher_salary_id,
            name,
            value
        );
        //console.log(jsonAnswerStatus);

        this.setState({
            isLoading : false,
            isError : false
        });
        if(jsonAnswerStatus.status === "success"){
            this.getMoreInfo(this.state.teacher_salary_id);
        } else {
            alert("Ошибка на сервере");
        }
    }

    async getMoreInfo(teacher_salary_id){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        this.setState({
            teacher_salary_id : teacher_salary_id,
            isLoading: true,
            isError: false
        }, function(){
            this.modalTeacherSalaryInfoOpen();
        });
        const jsonAnswerStatus = await this.state.teacherSalaryService.getMoreInfo(
            jwt,
            teacher_salary_id
        );
        //console.log(jsonAnswerStatus);

        this.setState({
            isLoading : false,
            isError : false
        });
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.teacherSalaryMoreInfoViewModel !== null){

            //const dateConverter = new DateConverter();
            const dateOfAction = new Date(jsonAnswerStatus.teacherSalaryMoreInfoViewModel.teacherSalaryInfoViewModel.date_of_action);
            const danceGroupName = jsonAnswerStatus.teacherSalaryMoreInfoViewModel.teacherSalaryInfoViewModel.danceGroupMicroViewModel !== null ? jsonAnswerStatus.teacherSalaryMoreInfoViewModel.teacherSalaryInfoViewModel.danceGroupMicroViewModel.name : "<группа не найден>";
            const teacherName = jsonAnswerStatus.teacherSalaryMoreInfoViewModel.teacherSalaryInfoViewModel.teacherMicroViewModel !== null ? jsonAnswerStatus.teacherSalaryMoreInfoViewModel.teacherSalaryInfoViewModel.teacherMicroViewModel.name : "<преподватель не найден>";

            this.setState({
                visitLiteViewModels : jsonAnswerStatus.teacherSalaryMoreInfoViewModel.visitLiteViewModels,
                dateOfAction : dateOfAction,
                danceGroupName : danceGroupName,
                teacherName : teacherName,

                teacherSalaryPriceAuto : (jsonAnswerStatus.teacherSalaryMoreInfoViewModel.teacherSalaryInfoViewModel !== null ? jsonAnswerStatus.teacherSalaryMoreInfoViewModel.teacherSalaryInfoViewModel.price_auto : 0),
                teacherSalaryisChangedByAdmin : (jsonAnswerStatus.teacherSalaryMoreInfoViewModel.teacherSalaryInfoViewModel.is_changed_by_admin === 1),
                teacherSalaryPriceFact : (jsonAnswerStatus.teacherSalaryMoreInfoViewModel.teacherSalaryInfoViewModel !== null ? jsonAnswerStatus.teacherSalaryMoreInfoViewModel.teacherSalaryInfoViewModel.price_fact : 0),

            });
        } else {
            alert("Ошибка на сервере");
        }
    }

    render(){

        return (
            <Modal
                show={this.state.modalTeacherSalaryInfoIsShowing}
                onHide={this.modalTeacherSalaryInfoClose}
                animation={false}
                size="lg"
                className="modal-teacher-salary-info"
                >
                <Modal.Header closeButton>
                    <Modal.Title className={this.state.isLoading ? "hide" : ""}>
                    Список учеников на занятии "{this.state.danceGroupName}" - {this.state.teacherName} на дату {this.state.dateOfAction.getDate() + "." + parseInt(this.state.dateOfAction.getMonth() + 1, 10) + "." + this.state.dateOfAction.getFullYear()}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <TeacherSalaryInfoModalBody
                    //ref={this.refTeacherSalaryInfoModalBody}
                    isLoading={this.state.isLoading}
                    isError={this.state.isError}
                    
                    visitLiteViewModels={this.state.visitLiteViewModels}
                    tryAgainCallback={() => this.getMoreInfo(this.state.teacher_salary_id)}
                    teacherSalaryPriceAuto={this.state.teacherSalaryPriceAuto}
                    teacherSalaryisChangedByAdmin={this.state.teacherSalaryisChangedByAdmin}
                    teacherSalaryPriceFact={this.state.teacherSalaryPriceFact}
                    
                    teacherSalaryFormListenerCallback={this.teacherSalaryFormListener}
                    updateCallback={this.update}
                    //purchaseAbonementDeletePrepareCallback={this.purchaseAbonementDeletePrepare}
                    //teacherSalaryInfoCallback={this.TeacherSalaryInfo}
                    />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.modalTeacherSalaryInfoClose}>
                        Закрыть окно
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}