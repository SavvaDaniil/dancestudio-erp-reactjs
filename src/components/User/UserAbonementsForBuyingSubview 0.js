import React, { Component } from "react";
import AbonementService from "../../service/AbonementService";
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage";
import { SystemErrorPage } from "../../pages/SystemError/SystemErrorPage";
import AdminMiddleWare from "../../utils/AdminMiddleware";


export default class UserAbonementsForBuyingSubview extends Component {

    constructor(props){
        super(props);
        this.state = {
            abonementService: new AbonementService(),

            isLoading : false,
            isError : false,
            abonementLiteViewModels : [],
            user_id : 0,
            dance_group_id : 0,
            abonement_id : 0,
            date_of_action : new Date(),
            
            modalPurchaseAbonementNewIsShowing : false,
        }
        this.setStateDataThroughProps = this.setStateDataThroughProps.bind(this);
    }

    setStateDataThroughProps(user_id, date_of_action, abonementLiteViewModels){
        this.setState({
            user_id : user_id,
            date_of_action : date_of_action,
            abonementLiteViewModels : abonementLiteViewModels,
        });
    }

    async listAllLiteActiveAbonements(user_id){
        this.setState({isLoading : true, isError : false, user_id : user_id});

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

    render(){

        if(this.state.isLoading)return <SystemLoadingPage />
        if(this.state.isError)return <SystemErrorPage tryAgain={this.listAllLiteActiveAbonements} />

        let razLites = "";
        //let date_of_buy_str = this.state.date_of_buy.getFullYear() + "-" + parseInt(this.state.date_of_buy.getMonth() + 1, 10) + "-" + this.state.date_of_buy.getDate();
        const userId = this.state.user_id;

        if(this.state.abonementLiteViewModels.length > 0){
            const razViewModels = this.state.abonementLiteViewModels.filter((abonementLiteViewModel) => abonementLiteViewModel.special_status === "raz").sort((a, b) => a.name.localeCompare(b.name));
            razLites = razViewModels.map((abonementLiteViewModel) => {
                return <div key={abonementLiteViewModel.id} className="abonement-for-buying">
                    <button type="button" className="btn btn-secondary"
                    onClick={() => this.props.purchaseAbonementNewPrepareCallback(userId, abonementLiteViewModel.id, 0, this.state.date_of_action)}
                    >Оформить покупку</button> - {abonementLiteViewModel.name} {abonementLiteViewModel.price} руб.
                </div>
            });
        }

        let usualLites = "";
        if(this.state.abonementLiteViewModels.length > 0){
            const usualViewModels = this.state.abonementLiteViewModels.filter((abonementLiteViewModel) => abonementLiteViewModel.special_status === "usual").sort((a, b) => a.name.localeCompare(b.name));
            usualLites = usualViewModels.map((abonementLiteViewModel) => {
                return <div key={abonementLiteViewModel.id} className="abonement-for-buying">
                    <button type="button" className="btn btn-secondary"
                    onClick={() => this.props.purchaseAbonementNewPrepareCallback(userId, abonementLiteViewModel.id, 0, this.state.date_of_action)}
                    >Оформить покупку</button> - {abonementLiteViewModel.name} {abonementLiteViewModel.price} руб.
                </div>
            });
        }

        let otherLites = "";
        if(this.state.abonementLiteViewModels.length > 0){
            const otherViewModels = this.state.abonementLiteViewModels.filter((abonementLiteViewModel) => abonementLiteViewModel.special_status !== "usual" && abonementLiteViewModel.special_status !== "raz").sort((a, b) => a.name.localeCompare(b.name));
            otherLites = otherViewModels.map((abonementLiteViewModel) => {
                return <div key={abonementLiteViewModel.id} className="abonement-for-buying"
                onClick={() => this.props.purchaseAbonementNewPrepareCallback(userId, abonementLiteViewModel.id, 0, this.state.date_of_action)}
                >
                    <button type="button" className="btn btn-secondary">Оформить покупку</button> - {abonementLiteViewModel.name} {abonementLiteViewModel.price} руб.
                </div>
            });
        }

        return (
            <div className="subview abonements-for-buying">
                <h5>Разовое</h5>
                {razLites}
                <h5>Абонемент</h5>
                {usualLites}
                <h5>Прочее</h5>
                {otherLites}

            </div>
        )
    }
}