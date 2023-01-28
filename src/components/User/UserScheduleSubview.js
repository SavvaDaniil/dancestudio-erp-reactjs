import React, { Component } from "react";
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage";
import { SystemErrorPage } from "../../pages/SystemError/SystemErrorPage";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import DanceGroupService from "../../service/DanceGroupService";
import VisitNewModal from "../Visit/VisitNewModal";
import VisitDeleteModal from "../Visit/VisitDeleteModal";
import DateConverter from "../../utils/DateConverter";


export default class UserScheduleSubview extends Component {

    constructor(props){
        super(props);
        this.state = {
            danceGroupService: new DanceGroupService(),
            dateConverter : new DateConverter(),

            isLoading: false,
            isError : false,

            user_id : 0,
            date_of_action : null,

            scheduleDayOfWeekName : "",
            danceGroupLessonViewModels : [],

            visit_id : 0,
            purchase_abonement_id : 0,
            purchase_abonement_name : "",
        }
        this.getScheduleByDate = this.getScheduleByDate.bind(this);
        this.refVisitNewModal = React.createRef();
        this.refVisitDeleteModal = React.createRef();
        this.visitDeletePrepare = this.visitDeletePrepare.bind(this);
        //this.visitDeleteSuccess = this.visitDeleteSuccess.bind(this);
    }


    async getScheduleByDate(user_id){
        const dateNow = new Date();
        this.setState({
            isLoading : true,
            isError : false,
            user_id : user_id,
            scheduleDayOfWeekName : this.getDayOfWeekNameByIndex(dateNow.getDay()),
            date_of_action : dateNow
        });
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.danceGroupService.getScheduleByDate(
            jwt, 
            this.state.dateConverter.toStringLikeYmd(dateNow)
        );
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.danceGroupLessonViewModels !== null){
            this.setState({
                danceGroupLessonViewModels : jsonAnswerStatus.danceGroupLessonViewModels
            });
            //console.log("jsonAnswerStatus.danceGroupLessonViewModels length: " + jsonAnswerStatus.danceGroupLessonViewModels.length);
        } else {
            this.setState({
                isError : true
            });
        }
    }
    
    getDayOfWeekNameByIndex(index){
        switch(index){
            case 0:
                return "Воскресенье";
            case 1:
                return "Понедельник";
            case 2:
                return "Вторник";
            case 3:
                return "Среда";
            case 4:
                return "Четверг";
            case 5:
                return "Пятница";
            case 6:
                return "Суббота";
            default:
                return "";
        }
    }

    visitDeletePrepare(visit_id, purchase_abonement_id, purchase_abonement_name){
        this.refVisitDeleteModal.current.prepare(
            this.state.user_id,
            visit_id,
            purchase_abonement_id,
            purchase_abonement_name
        );
    }

    /*
    async visitDeleteSuccess(){
        await this.getScheduleByDate(this.state.user_id);
    }
    */

    render(){

        if(this.state.isLoading)return <SystemLoadingPage />
        if(this.state.isError)return <SystemErrorPage tryAgain={this.getScheduleByDate} />

        let danceGroupLessons = "";
        //console.log(this.state.danceGroupLessonViewModels);
        if(this.state.danceGroupLessonViewModels.length > 0){
            const danceGroupLessonViewModels = this.state.danceGroupLessonViewModels.sort((a, b) => {
                return a.time_from.localeCompare(b.time_from);
            });

            danceGroupLessons = danceGroupLessonViewModels.map((danceGroupLessonViewModel) => {
                return <button key={danceGroupLessonViewModel.id} className="btn btn-secondary" type="button"
                    onClick={() => this.refVisitNewModal.current.getVisitPrepare(
                        this.state.user_id, 
                        danceGroupLessonViewModel.id, 
                        this.state.date_of_action
                    )}
                >
                    {danceGroupLessonViewModel.time_from}-{danceGroupLessonViewModel.time_to} {danceGroupLessonViewModel.name}
                </button>
            });
        }
        //console.log("render jsonAnswerStatus.danceGroupLessonViewModels length: " + this.state.danceGroupLessonViewModels.length);

        return (
            <div className="schedule">
                <div className="text-center">
                    <p>Расписание на сегодня ({this.state.scheduleDayOfWeekName}):<br />
                        <span>Чтобы отметить человека на занятие, щелкните пожалуйста по соответствующей кнопке</span>
                    </p>
                </div>

                {danceGroupLessons}

                <VisitNewModal
                ref={this.refVisitNewModal}
                visitNewSuccessCallback={this.props.visitNewSuccessCallback}
                visitDeletePrepareCallback={this.visitDeletePrepare}
                purchaseAbonementNewPrepareCallback={this.props.purchaseAbonementNewPrepareCallback}
                purchaseAbonementDeletePrepareCallback={this.props.purchaseAbonementDeletePrepareCallback}
                />

                <VisitDeleteModal
                ref={this.refVisitDeleteModal}
                visitDeleteSuccessCallback={this.props.visitDeleteSuccessCallback}
                />
            </div>
        )
    }
}