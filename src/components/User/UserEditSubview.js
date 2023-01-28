import React, { Component } from "react";
import UserService from "../../service/UserService";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage";
import { SystemErrorPage } from "../../pages/SystemError/SystemErrorPage";
import imgUserDefault from "../../assets/images/user.png";
import AbonementService from "../../service/AbonementService";
import DanceGroupService from "../../service/DanceGroupService";
import UserScheduleSubview from "./UserScheduleSubview";
//import UserAbonementsForBuyingSubview from "./UserAbonementsForBuyingSubview";
import UserProfileSubview from "./UserProfileSubview";
import PurchaseAbonementNewModal from "../PurchaseAbonement/PurchaseAbonementNewModal";
import UserAbonementsForBuyingTab from "./UserAbonementsForBuyingTab";
import UserAbonementsActiveSubtab from "./UserAbonementsActiveSubtab";
import UserVisitsSubtab from "./UserVisitsSubtab";
import PurchaseAbonementDeleteModal from "../PurchaseAbonement/PurchaseAbonementDeleteModal";
import UserPurchaseAbonementsHistorySubview from "./UserPurchaseAbonementsHistorySubview";

export default class UserEditSubview extends Component {

    constructor(props){
        super(props);
        this.state = {
            userService : new UserService(),
            abonementService : new AbonementService(),
            danceGroupService: new DanceGroupService(),
            user_id : 0,
            isLoading : false,
            isError : false,
            date_of_action : new Date(),

            userSearchPreviewSecondname : "",
            userSearchPreviewFirstname : "",
            userSearchPreviewDateOfAdd : "",
            userSearchPreviewTelephone : "",

            scheduleDayOfWeekName : "",
            danceGroupLessonViewModels : [],

            modalPurchaseAbonementNewIsShowing : false,

            abonementLiteViewModels : [],
        }
        this.getSearchPreview = this.getSearchPreview.bind(this);
        this.updateCheckVisitsTab = this.updateCheckVisitsTab.bind(this);

        this.refUserScheduleSubview = React.createRef();
        this.refUserAbonementsForBuyingTab = React.createRef();
        this.refUserProfileSubview = React.createRef();
        this.refUserAbonementsActiveSubtab = React.createRef();

        this.refPurchaseAbonementNewModal = React.createRef();
        this.purchaseAbonementNewPrepare = this.purchaseAbonementNewPrepare.bind(this);
        
        this.refPurchaseAbonementDeleteModal = React.createRef();
        this.purchaseAbonementDeletePrepare = this.purchaseAbonementDeletePrepare.bind(this);
        this.modalPurchaseAbonementDeleteSuccess = this.modalPurchaseAbonementDeleteSuccess.bind(this);

        this.refUserVisitsSubtab = React.createRef();
        this.visitNewSuccess = this.visitNewSuccess.bind(this);
        this.visitDeleteSuccess = this.visitDeleteSuccess.bind(this);
    }

    async componentDidUpdate(){
        console.log("UserEditSubview componentDidUpdate user_id: " + this.props.user_id);
        if(this.state.user_id !== this.props.user_id && this.props.user_id !== 0){
            await this.getSearchPreview();
        }
    }

    async getSearchPreview(){
        if(this.props.user_id === 0)return;
        this.setState({isLoading : true, user_id : this.props.user_id});
        console.log("getSearchPreview user_id : " + this.props.user_id);
        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();

        const jsonAnswerStatus = await this.state.userService.getSearchPreview(jwt, this.props.user_id);
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.userSearchPreviewViewModel !== null){
            this.setState({
                userSearchPreviewSecondname : jsonAnswerStatus.userSearchPreviewViewModel.secondname,
                userSearchPreviewFirstname : jsonAnswerStatus.userSearchPreviewViewModel.firstname,
                userSearchPreviewDateOfAdd : jsonAnswerStatus.userSearchPreviewViewModel.date_of_add,
                userSearchPreviewTelephone : jsonAnswerStatus.userSearchPreviewViewModel.telephone,
            }, function(){
                this.updateCheckVisitsTab();
            });
        } else {
            alert("Неизвестная ошибка на сервере");
        }
    }

    updateCheckVisitsTab(){
        this.refUserAbonementsActiveSubtab.current.listAllLiteActiveForUserByDate(this.props.user_id);
        this.refUserScheduleSubview.current.getScheduleByDate(this.props.user_id);
    }

    /*
    async listAllLiteActiveAbonementsForBuying(){
        this.setState({isLoading : true, isError : false});

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.abonementService.listAllLiteActive(jwt);
        
        this.setState({isLoading : false});
        if(jsonAnswerStatus.status === "success" && jsonAnswerStatus.abonementLiteViewModels !== null){
            this.setState({
                abonementLiteViewModels : jsonAnswerStatus.abonementLiteViewModels
            });
        } else {
            this.setState({
                isError : true
            });
        }
    }
    */

    purchaseAbonementNewPrepare(userId, abonementId, danceGroupId, date_of_buy){
        //console.log("UserEditSubview purchaseAbonementNewPrepare userId: " + userId);
        this.refPurchaseAbonementNewModal.current.getForBuy(userId, abonementId, danceGroupId, date_of_buy);
    }

    purchaseAbonementDeletePrepare(purchaseAbonementId, purchaseAbonementName){
        this.refPurchaseAbonementDeleteModal.current.prepare(purchaseAbonementId, purchaseAbonementName);
    }

    modalPurchaseAbonementDeleteSuccess(){
        this.refUserAbonementsActiveSubtab.current.listAllLiteActiveForUserByDate(this.props.user_id);
    }

    visitNewSuccess(){
        this.updateCheckVisitsTab();
    }
    visitDeleteSuccess(){
        this.updateCheckVisitsTab();
    }

    render(){
        if(this.props.user_id === 0)return <></>;
        if(this.state.isLoading)return <SystemLoadingPage />;
        if(this.state.isError)return <SystemErrorPage tryAgain={this.getSearchPreview} />;

        return (
            <div className="col-12 row page user">
                <div className="col-3 preview">
                    <div className="text-center">
                        <img src={imgUserDefault} className="img-fluid poster" alt="user_poster" />
                        <h4>{this.state.userSearchPreviewSecondname} {this.state.userSearchPreviewFirstname}</h4>
                    </div>
                    <p className="title">Даты</p>
                    <p>
                        Последняя активность:<br />
                        Дата регистрации: {this.state.userSearchPreviewDateOfAdd}
                    </p>
                    <p className="title">Контакты</p>
                    <p><i className="fa fa-phone"></i> {this.state.userSearchPreviewTelephone}</p>
                </div>
                <div className="col-9">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="check-visits-tab" data-bs-toggle="tab" data-bs-target="#check-visits" type="button" role="tab" aria-controls="home" aria-selected="true"
                            onClick={this.updateCheckVisitsTab}
                            >Отметить</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="buying-tab" data-bs-toggle="tab" data-bs-target="#buying" type="button" role="tab" aria-controls="buying" aria-selected="false"
                            onClick={() => this.refUserAbonementsForBuyingTab.current.listAllLiteActiveAbonements(this.state.user_id)}
                            //onClick={this.listAllLiteActiveAbonementsForBuying}
                            >Купить</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false"
                            onClick={() => this.refUserProfileSubview.current.getUserProfile(this.state.user_id)}
                            >Профиль</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="visits-tab" data-bs-toggle="tab" data-bs-target="#visits" type="button" role="tab" aria-controls="visits" aria-selected="false"
                            onClick={() => this.refUserVisitsSubtab.current.listAllLiteOfUserAnyDanceGroup(this.state.user_id)}
                            >Посещения</button>
                        </li>
                        <li className="nav-item hide" role="presentation">
                            <button className="nav-link" id="discounts-tab" data-bs-toggle="tab" data-bs-target="#discounts" type="button" role="tab" aria-controls="discounts" aria-selected="false">Скидки</button>
                        </li>
                        <li className="nav-item hide" role="presentation">
                            <button className="nav-link" id="for-user-admin-tab" data-bs-toggle="tab" data-bs-target="#for-user-admin" type="button" role="tab" aria-controls="for-user-admin" aria-selected="false">Администрирование</button>
                        </li>
                        <li className="nav-item hide" role="presentation">
                            <button className="nav-link" id="abonements-private-tab" data-bs-toggle="tab" data-bs-target="#abonements-private" type="button" role="tab" aria-controls="abonements-private" aria-selected="false">Приватные абонементы</button>
                        </li>

                        </ul>
                        <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active check-visits" id="check-visits" role="tabpanel" aria-labelledby="check-visits-tab">

                            <UserAbonementsActiveSubtab
                                ref={this.refUserAbonementsActiveSubtab}
                            />

                            <hr/>

                            <UserScheduleSubview
                                ref={this.refUserScheduleSubview}
                                visitNewSuccessCallback={this.visitNewSuccess}
                                visitDeleteSuccessCallback={this.visitDeleteSuccess}
                                purchaseAbonementNewPrepareCallback={this.purchaseAbonementNewPrepare}
                                purchaseAbonementDeletePrepareCallback={this.purchaseAbonementDeletePrepare}
                                />

                        </div>
                        <div className="tab-pane fade" id="buying" role="tabpanel" aria-labelledby="buying-tab">
                            <UserAbonementsForBuyingTab
                                ref={this.refUserAbonementsForBuyingTab}
                                purchaseAbonementNewPrepareCallback={this.purchaseAbonementNewPrepare}
                                //isLoading={this.state.isLoading}
                                //isError={this.state.isError}
                                //user_id={this.state.user_id}
                                //date_of_action={this.state.date_of_action}
                                //abonementLiteViewModel={this.state.abonementLiteViewModel}
                            />
                        </div>
                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <UserProfileSubview
                                ref={this.refUserProfileSubview}
                            />
                        </div>
                        <div className="tab-pane fade" id="visits" role="tabpanel" aria-labelledby="visits-tab">
                            <UserVisitsSubtab
                                ref={this.refUserVisitsSubtab}
                            />
                        </div>
                        <div className="tab-pane fade" id="discounts" role="tabpanel" aria-labelledby="discounts-tab">discounts</div>
                        <div className="tab-pane fade" id="for-user-admin" role="tabpanel" aria-labelledby="for-user-admin-tab">for-user-admin</div>
                        <div className="tab-pane fade" id="abonements-private" role="tabpanel" aria-labelledby="abonements-private-tab">abonements-private</div>
                    </div>
                </div>

                <PurchaseAbonementNewModal
                ref={this.refPurchaseAbonementNewModal}
                />

                <PurchaseAbonementDeleteModal
                ref={this.refPurchaseAbonementDeleteModal}
                modalPurchaseAbonementDeleteSuccessCallback={this.modalPurchaseAbonementDeleteSuccess}
                />

                <hr />

                <UserPurchaseAbonementsHistorySubview
                user_id={this.props.user_id}
                />

            </div>
        )
    }
}