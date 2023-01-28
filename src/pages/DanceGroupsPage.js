import React, {Component} from "react";
import {Button, Table, Modal, Form} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import DanceGroupService from "../service/DanceGroupService";
import { SystemLoadingPage } from "./SystemLoading/SystemLoadingPage";
import DanceGroupEditPreviewRow from "../components/DanceGroup/DanceGroupEditPreviewRow";
import AdminMiddleWare from "../utils/AdminMiddleware";
import DanceGroupEditForm from "../components/DanceGroup/DanceGroupEditForm";
import DanceGroupDayOfWeekService from "../service/DanceGroupDayOfWeekService";
import ConnectionAbonementToDanceGroupService from "../service/ConnectionAbonementToDanceGroupService";

//import DanceGroup from "./DanceGroup/DanceGroup";
//import DanceGroupAbonement from "./DanceGroup/DanceGroupAbonement";
//import DanceGroupEvents from "./DanceGroup/DanceGroupEvents";



class DanceGroups extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading : false,
            isError : false,
            danceGroupService : new DanceGroupService(),
            danceGroupDayOfWeekService : new DanceGroupDayOfWeekService(),
            connectionAbonementToDanceGroupService : new ConnectionAbonementToDanceGroupService(),

            danceGroupEditPreviewViewModels : [],
            newDanceGroupName : "",
            dance_group_id : 0,
            dance_group_name : "",

            danceGroupEditModel : null,
            teacher_id : 0,
            teacherMicroModels : [],
            //teacherMicroModel : null,
            branch_id : 0,
            branchMicroModels : [],
            //branchMicroModel : null,
            danceGroupDayOfWeekLiteViewModels :[],
            connectionAbonementToDanceGroupLiteViewModels : [],
            abonementLiteViewModels : [],


            isLaunch : false,
            contentArray : [],
            modalDanceGroupModel : {},
            modalAddNewDanceGroupIsShowing : false,
            modalDeleteDanceGroupIsShowing : false,
            modalEditDanceGroupIsShowing : false,
            modalDanceGroupDynamicDateIsShowing : false,
            id_of_DanceGroup : "",
            listDanceGroupDynamicDate : [],
            searchDanceGroupDynamicDateOfDanceGroupIsLaunch : false,
            teachers : [],
            branches : [],
            abonementsConnected : [],
            dayOfWeek : ["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВСК"]
            
        }
        this.search = this.search.bind(this);
        this.addDanceGroup = this.addDanceGroup.bind(this);
        this.newDanceGroupFormListener = this.newDanceGroupFormListener.bind(this);


        this.getDanceGroupEdit = this.getDanceGroupEdit.bind(this);
        this.saveDanceGroup = this.saveDanceGroup.bind(this);

        this.deletePrepareDanceGroup = this.deletePrepareDanceGroup.bind(this);
        this.modalDeleteDanceGroupOpen = this.modalDeleteDanceGroupOpen.bind(this);
        this.modalDeleteDanceGroupClose = this.modalDeleteDanceGroupClose.bind(this);
        this.deleteDanceGroup = this.deleteDanceGroup.bind(this);

        this.modalAddNewDanceGroupOpen = this.modalAddNewDanceGroupOpen.bind(this);
        this.modalAddNewDanceGroupClose = this.modalAddNewDanceGroupClose.bind(this);

        this.modalEditDanceGroupOpen = this.modalEditDanceGroupOpen.bind(this);
        this.modalEditDanceGroupClose = this.modalEditDanceGroupClose.bind(this);
        this.editDanceGroupFormListener = this.editDanceGroupFormListener.bind(this);
        this.addDanceGroupDayOfWeek = this.addDanceGroupDayOfWeek.bind(this);
        this.deleteDanceGroupDayOfWeek = this.deleteDanceGroupDayOfWeek.bind(this);
        this.saveDanceGroupDayOfWeek = this.saveDanceGroupDayOfWeek.bind(this);

        ////

        //this.modalDanceGroupModelHandle = this.modalDanceGroupModelHandle.bind(this);
        //this.dayOfWeekHandleDanceGroupModelHandle = this.dayOfWeekHandleDanceGroupModelHandle.bind(this);

    }

    async componentDidMount(){
        this.search();
    }

    async search(){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        this.setState({
            isLoading: true,
            isError: false
        });
        const jsonAnswerStatus = await this.state.danceGroupService.listAllEditPreviews(jwt);
        
        this.setState({
            isLoading: false
        });
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.danceGroupEditPreviewViewModels !== null){
            this.setState({
                danceGroupEditPreviewViewModels : jsonAnswerStatus.danceGroupEditPreviewViewModels
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }

    newDanceGroupFormListener(e){
        switch(e.target.name){
            case "name":
                this.setState({newDanceGroupName : e.target.value});
                break;
            default:
                break;
        }
    }

    async addDanceGroup(){
        if(this.state.newDanceGroupName === ""){
            alert("Добавьте пожалуйста наименование группы");
            return;
        }

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.danceGroupService.add(jwt, this.state.newDanceGroupName);
        
        if(jsonAnswerStatus.status === "success"){
            this.modalAddNewDanceGroupClose();
            this.search();
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }



    
    modalEditDanceGroupOpen(){
        this.setState({
            modalEditDanceGroupIsShowing : true
        });
    }
    modalEditDanceGroupClose(){
        this.setState({
            modalEditDanceGroupIsShowing : false
        });
    }

    editDanceGroupFormListener(e){
        let danceGroupEditModel = this.state.danceGroupEditModel;
        switch(e.target.name){
            case "name":
                danceGroupEditModel.name = e.target.value;
                break;
            case "description":
                danceGroupEditModel.description = e.target.value;
                break;
            case "teacher_id":
                danceGroupEditModel.teacher_id = parseInt(e.target.value, 10);
                break;
            case "status":
                danceGroupEditModel.status = parseInt(e.target.value, 10);
                break;
            case "status_for_app":
                danceGroupEditModel.status_for_app = parseInt(e.target.value, 10);
                break;
            case "status_of_creative":
                danceGroupEditModel.status_of_creative = parseInt(e.target.value, 10);
                break;
            case "branch_id":
                danceGroupEditModel.branch_id = parseInt(e.target.value, 10);
                break;
            case "is_active_reservation":
                danceGroupEditModel.is_active_reservation = parseInt(e.target.value, 10);
                break;
            case "is_event":
                danceGroupEditModel.is_event = parseInt(e.target.value, 10);
                break;
            case "is_abonements_allow_all":
                danceGroupEditModel.is_abonements_allow_all = parseInt(e.target.value, 10);
                break;
            default:
                break;
        }
        this.setState({danceGroupEditModel : danceGroupEditModel});
    }

    async getDanceGroupEdit(dance_group_id){
        this.setState({isLoading : true, dance_group_id : dance_group_id});
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.danceGroupService.getEdit(jwt, dance_group_id);

        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.danceGroupEditViewModel !== null){

            this.setState({
                danceGroupEditModel : jsonAnswerStatus.danceGroupEditViewModel,
                teacher_id : jsonAnswerStatus.danceGroupEditViewModel.teacher_id,
                teacherMicroModels : jsonAnswerStatus.danceGroupEditViewModel.teacherMicroViewModels,
                //teacherMicroModel : jsonAnswerStatus.danceGroupEditViewModel.teacherMicroViewModel,

                branch_id : jsonAnswerStatus.danceGroupEditViewModel.branch_id,
                branchMicroModels : jsonAnswerStatus.danceGroupEditViewModel.branchMicroViewModels,
                //branchMicroModel : jsonAnswerStatus.danceGroupEditViewModel.branchMicroViewModel

                danceGroupDayOfWeekLiteViewModels : jsonAnswerStatus.danceGroupEditViewModel.danceGroupDayOfWeekLiteViewModels,
                connectionAbonementToDanceGroupLiteViewModels : jsonAnswerStatus.danceGroupEditViewModel.connectionAbonementToDanceGroupLiteViewModels,
                abonementLiteViewModels : jsonAnswerStatus.danceGroupEditViewModel.abonementLiteViewModels
            });

            this.modalEditDanceGroupOpen();
        } else {
            alert("Неизвестная ошибка на сервере");
        }

    }

    async saveDanceGroup(){
        this.setState({isLoading : true});
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.danceGroupService.update(
            jwt,
            this.state.dance_group_id,
            this.state.danceGroupEditModel.name,
            this.state.danceGroupEditModel.teacher_id,
            this.state.danceGroupEditModel.description,
            this.state.danceGroupEditModel.status,
            this.state.danceGroupEditModel.status_for_app,
            this.state.danceGroupEditModel.status_of_creative,
            this.state.danceGroupEditModel.branch_id,
            this.state.danceGroupEditModel.is_active_reservation,
            this.state.danceGroupEditModel.is_event,
            this.state.danceGroupEditModel.is_abonements_allow_all
        );

        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success"){
            this.setState({
                danceGroupEditModel : null,
                teacher_id : 0,
                teacherMicroModels : [],
                branch_id : 0,
                branchMicroModels : [],
                danceGroupDayOfWeekLiteViewModels : [],
                connectionAbonementToDanceGroupLiteViewModels : [],
                abonementLiteViewModels : []
            });
            this.getDanceGroupEdit(this.state.dance_group_id);
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }


    modalAddNewDanceGroupOpen(){
        this.setState({
            modalAddNewDanceGroupIsShowing : true
        });
    }
    modalAddNewDanceGroupClose(){
        this.setState({
            modalAddNewDanceGroupIsShowing : false
        });
    }


    deletePrepareDanceGroup(dance_group_id, dance_group_name){
        this.setState({
            dance_group_id : dance_group_id,
            dance_group_name : dance_group_name
        });
        this.modalDeleteDanceGroupOpen();
    }
    modalDeleteDanceGroupOpen(id_of_DanceGroup){
        this.setState({
            modalDeleteDanceGroupIsShowing : true,
            id_of_DanceGroup : id_of_DanceGroup
        });
    }
    modalDeleteDanceGroupClose(){
        this.setState({
            modalDeleteDanceGroupIsShowing : false
        });
    }
    async deleteDanceGroup(){
        this.setState({isLoading : true});
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.danceGroupService.delete(jwt, this.state.dance_group_id);

        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success"){
            this.modalDeleteDanceGroupClose();
            this.search();
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }


    async addDanceGroupDayOfWeek(dance_group_id, is_event){
        this.setState({isLoading : true});
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.danceGroupDayOfWeekService.add(jwt, dance_group_id, is_event);
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success"){
            this.getDanceGroupEdit(dance_group_id);
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }

    async deleteDanceGroupDayOfWeek(dance_group_day_of_week_id){
        this.setState({isLoading : true});
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.danceGroupDayOfWeekService.delete(jwt, dance_group_day_of_week_id);
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success"){
            this.getDanceGroupEdit(this.state.dance_group_id);
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }

    saveDanceGroupDayOfWeek(e, dance_group_day_of_week_id){
        clearTimeout(this.timeoutSaveDanceGroupDayOfWeek);

        this.timeoutSaveDanceGroupDayOfWeek = setTimeout(async() => {
            //this.setState({ isLoading : true });
            const adminMiddleWare = new AdminMiddleWare();
            const jwt = adminMiddleWare.getJWTFromCookie();
    
            const jsonAnswerStatus = await this.state.danceGroupDayOfWeekService.update(jwt, dance_group_day_of_week_id, e.target.name, e.target.value);
            console.log("jsonAnswerStatus.status: " + jsonAnswerStatus.status);
            if(jsonAnswerStatus.status === "success"){
                //this.setState({danceGroupDayOfWeekLiteViewModels : []});
                //this.getDanceGroupEdit(this.state.dance_group_id);
            } else {
                alert("Неизвестная ошибка на сервере");
            }
            //this.setState({ isLoading : false });
        }, 1500);
    }


    async updateConnectionAbonementToDanceGroup(e, abonement_id){
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.connectionAbonementToDanceGroupService.update(
            jwt, 
            this.state.dance_group_id,
            abonement_id,
            e.target.value
        );
        if(jsonAnswerStatus.status === "success"){
            
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }


    render(){

        const teacherMicroOptions = this.state.teacherMicroModels.map((content, index) => {
            return <option value={content.id}
            key={index}
            >
                {content.name} (id{content.id})
            </option>
        });
        const brancheMicroOptions = this.state.branchMicroModels.map((content, index) => {
            return <option value={content.id}
            key={index}
            >
                {content.name} (id{content.id})
            </option>
        });


        var danceGroupEditPreviewsTable;
        if(this.state.isLoading){
            danceGroupEditPreviewsTable = <SystemLoadingPage />
        } else if(this.state.danceGroupEditPreviewViewModels.length > 0){

            const danceGroupEditPreviews = this.state.danceGroupEditPreviewViewModels.map((content, index) => {
                return <DanceGroupEditPreviewRow
                key = {index}
                id = {content.id}
                name={content.name}
                teacherMicroViewModel={content.teacherMicroViewModel}
                status={content.status}
                status_for_app={content.status_for_app}

                deletePrepareDanceGroup = {this.deletePrepareDanceGroup}
                getDanceGroupEdit = {this.getDanceGroupEdit}
                />
            });

            danceGroupEditPreviewsTable = <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            ID
                        </th>
                        <th>
                            Наименование
                        </th>
                        <th>
                            Прикреплённый преподаватель
                        </th>
                        <th>
                            Статус видимости администраторам
                        </th>
                        <th>
                            Статус видимости в приложении
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {danceGroupEditPreviews}
                </tbody>
            </Table>
        } else {
            danceGroupEditPreviewsTable = <center><i>Групп не найдено</i></center>;
        }
        
        
        //const tableOfDaysOfWeekNewDanceGroup = this.buildTableOfDaysOfWeek(true);
        //const tableOfDaysOfWeekEditDanceGroup = this.buildTableOfDaysOfWeek();

        //abonementLiteViewModels
        let abonementsTable = <></>;
        if(this.state.abonementLiteViewModels.length === 0){
            abonementsTable = <center><i>Абонементов не найдено</i></center>;
        } else {
            const abonementLiteViewModels = (this.state.abonementLiteViewModels).sort((a, b) => a.name > b.name);
            const abonementsTr = abonementLiteViewModels.map((content, index) => {

                let isConnected = 0;
                if(this.state.connectionAbonementToDanceGroupLiteViewModels.find((connectionAbonementToDanceGroupLiteViewModel) => {
                    return connectionAbonementToDanceGroupLiteViewModel.abonement_id === content.id
                })){
                    isConnected = 1;
                }

                return <tr key={index}>
                    <td>
                        {content.id}
                    </td>
                    <td>
                        {content.name}
                    </td>
                    <td>
                        <Form.Control as="select" 
                        onChange={(e) => this.updateConnectionAbonementToDanceGroup(e, content.id)}
                        defaultValue={isConnected}
                        >
                            <option value="0">Нет</option>
                            <option value="1">Да</option>
                        </Form.Control>
                    </td>
                </tr>
                
            });
            abonementsTable = <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            ID
                        </th>
                        <th>
                            Наименование абонемента
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {abonementsTr}
                </tbody>
            </Table>
        }
        


        return(
            <div className="row page dancegroups">
                
                <div className="col-12">
                    <Button variant="secondary" type="button" onClick={this.modalAddNewDanceGroupOpen}>Добавить </Button>
                </div>

                {danceGroupEditPreviewsTable}

                <Modal
                show={this.state.modalAddNewDanceGroupIsShowing}
                onHide={this.modalAddNewDanceGroupClose}
                animation={false}
                size="lg"
                className="modalAddNewDanceGroup"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Новая группа</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Наименование</Form.Label>
                                <Form.Control name="name" type="text" placeholder="Наименование" maxLength="216" onChange={this.newDanceGroupFormListener} />
                            </Form.Group>

                            <hr />
                            <p>Больший функционал станет доступно только после добавления группы в расписание в модально окне "редактирование"</p>

                        </Form>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.addDanceGroup} disabled={this.state.isLoading}>
                            Добавить
                        </Button>
                        <Button variant="secondary" onClick={this.modalAddNewDanceGroupClose}>
                            Закрыть окно
                        </Button>
                    </Modal.Footer>
                </Modal>

                
                <Modal
                show={this.state.modalEditDanceGroupIsShowing}
                onHide={this.modalEditDanceGroupClose}
                animation={false}
                size="lg"
                className="modalEditDanceGroup"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Редактирование группы</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    <DanceGroupEditForm
                        isLoading={this.state.isLoading}
                        //modalEditDanceGroupIsShowing={this.state.modalEditDanceGroupIsShowing}
                        //modalEditDanceGroupClose={this.modalEditDanceGroupClose}

                        editDanceGroupFormListener={this.editDanceGroupFormListener}
                        saveDanceGroup={this.saveDanceGroup}
                        danceGroupEditModel={this.state.danceGroupEditModel}
                        teacherMicroModel={this.state.teacherMicroModel}
                        teacherMicroOptions={teacherMicroOptions}

                        addDanceGroupDayOfWeek={this.addDanceGroupDayOfWeek}
                        //tableOfDaysOfWeekEditDanceGroup={tableOfDaysOfWeekEditDanceGroup}
                        danceGroupDayOfWeekLiteViewModels={this.state.danceGroupDayOfWeekLiteViewModels}
                        saveDanceGroupDayOfWeek={this.saveDanceGroupDayOfWeek}

                        brancheMicroOptions={brancheMicroOptions}
                        branchMicroModel={this.state.branchMicroModel}

                        abonementsTable={abonementsTable}
                    />
                    
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.saveDanceGroup} disabled={this.state.isLoading}>
                            Сохранить
                        </Button>
                        <Button variant="secondary" onClick={this.modalEditDanceGroupClose}>
                            Закрыть окно
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal
                show={this.state.modalDeleteDanceGroupIsShowing}
                onHide={this.modalDeleteDanceGroupClose}
                animation={false}
                size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Удалить группу</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Вы уверены, что хотите удалить группу "{this.state.dance_group_name}"?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="info" onClick={this.deleteDanceGroup} disabled={this.state.isLoading}>
                            Да
                        </Button>
                        <Button variant="secondary" onClick={this.modalDeleteDanceGroupClose}>
                            Закрыть окно
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}



export default function DanceGroupsPage(props){
    const navigate = useNavigate();
    return(<DanceGroups navigate={navigate}></DanceGroups>)
}