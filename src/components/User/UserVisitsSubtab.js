import React, { Component } from "react";
import VisitService from "../../service/VisitService";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import UserVisitsSubview from "./UserVisitsSubview";
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage";
import { SystemErrorPage } from "../../pages/SystemError/SystemErrorPage";
import VisitDeleteModal from "../Visit/VisitDeleteModal";


export default class UserVisitsSubtab extends Component {
    constructor(props){
        super(props);
        this.state = {
            visitService : new VisitService(),
            isLoading : false,
            isError : false,
            user_id : 0,
            visitLiteViewModels : [],
        }
        this.refVisitDeleteModal = React.createRef();
        this.visitDeletePrepare = this.visitDeletePrepare.bind(this);
        this.visitDeleteSuccess = this.visitDeleteSuccess.bind(this);
    }

    async listAllLiteOfUserAnyDanceGroup(user_id){
        this.setState({
            isLoading : true, 
            isError : false,
            user_id : user_id,
        });

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.visitService.listAllLiteOfUser(
            jwt, 
            user_id, 
            0
        );
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.visitLiteViewModels !== null){
            this.setState({
                visitLiteViewModels : jsonAnswerStatus.visitLiteViewModels
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }

    visitDeletePrepare(visit_id, purchase_abonement_id, purchase_abonement_name){
        //console.log("visitDeletePrepare purchase_abonement_name: " + purchase_abonement_name);
        this.refVisitDeleteModal.current.prepare(
            this.state.user_id,
            visit_id,
            purchase_abonement_id,
            purchase_abonement_name
        );
    }

    async visitDeleteSuccess(){
        await this.listAllLiteOfUserAnyDanceGroup(this.state.user_id);
    }

    render(){

        if(this.state.isLoading)return <SystemLoadingPage />;
        if(this.state.isError)return <SystemErrorPage tryAgain={() => this.listAllLiteOfUserAnyDanceGroup(this.state.user_id)} />;

        return (
            <>
                <UserVisitsSubview
                visitLiteViewModels={this.state.visitLiteViewModels}
                visitDeletePrepareCallback={this.visitDeletePrepare}
                />

                <VisitDeleteModal
                ref={this.refVisitDeleteModal}
                visitDeleteSuccessCallback={this.visitDeleteSuccess}
                />
            </>
        )
    }
}