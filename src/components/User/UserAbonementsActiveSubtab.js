import React, { Component } from "react"
import PurchaseAbonementService from "../../service/PurchaseAbonementService";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage";
import { SystemErrorPage } from "../../pages/SystemError/SystemErrorPage";
import UserAbonementsActiveSubview from "./UserAbonementsActiveSubview";
import PurchaseAbonementDeleteModal from "../PurchaseAbonement/PurchaseAbonementDeleteModal";
import DateConverter from "../../utils/DateConverter";


export default class UserAbonementsActiveSubtab extends Component{

    constructor(props){
        super(props);
        this.state = {
            purchaseAbonementServce : new PurchaseAbonementService(),
            dateConverter : new DateConverter(),
            isLoading : false,
            isError : false,

            user_id : 0,
            date_of_buy : new Date(),
            purchaseAbonementLiteViewModels : [],
        }
        this.listAllLiteActiveForUserByDate = this.listAllLiteActiveForUserByDate.bind(this);
        this.purchaseAbonementDeletePrepare = this.purchaseAbonementDeletePrepare.bind(this);
        this.refPurchaseAbonementDeleteModal = React.createRef();
        this.modalPurchaseAbonementDeleteSuccess = this.modalPurchaseAbonementDeleteSuccess.bind(this);
    }

    async listAllLiteActiveForUserByDate(user_id){
        
        this.setState({isLoading : true, isError : false, user_id : user_id});

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.purchaseAbonementServce.listAllLiteActiveForUserByDate(
            jwt, 
            user_id, 
            this.state.dateConverter.toStringLikeYmd(this.state.date_of_buy)
        );
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.purchaseAbonementLiteViewModels !== null){
            this.setState({
                purchaseAbonementLiteViewModels : jsonAnswerStatus.purchaseAbonementLiteViewModels
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }

    purchaseAbonementDeletePrepare(purchaseAbonementId, purchaseAbonementName){
        this.refPurchaseAbonementDeleteModal.current.prepare(purchaseAbonementId, purchaseAbonementName);
    }

    async modalPurchaseAbonementDeleteSuccess(){
        await this.listAllLiteActiveForUserByDate(this.state.user_id);
    }

    render(){

        if(this.state.isLoading)return <SystemLoadingPage />
        if(this.state.isError)return <SystemErrorPage tryAgain={() => this.listAllLiteActiveForUserByDate(this.state.user_id)} />

        return (
            <div className="subview purchase-abonements">

                <UserAbonementsActiveSubview
                user_id={this.state.user_id}
                purchaseAbonementLiteViewModels={this.state.purchaseAbonementLiteViewModels}
                purchaseAbonementDeletePrepareCallback={this.purchaseAbonementDeletePrepare}
                />

                <PurchaseAbonementDeleteModal
                ref={this.refPurchaseAbonementDeleteModal}
                modalPurchaseAbonementDeleteSuccessCallback={this.modalPurchaseAbonementDeleteSuccess}
                />

            </div>
        )
    }
}