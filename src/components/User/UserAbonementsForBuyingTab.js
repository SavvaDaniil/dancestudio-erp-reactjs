import { Component } from "react";
import AbonementService from "../../service/AbonementService";
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage";
import { SystemErrorPage } from "../../pages/SystemError/SystemErrorPage";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import UserAbonementsForBuyingSubview from "./UserAbonementsForBuyingSubview";


export default class UserAbonementsForBuyingTab extends Component {
    
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
        this.listAllLiteActiveAbonements = this.listAllLiteActiveAbonements.bind(this);
    }

    async listAllLiteActiveAbonements(user_id){
        this.setState({isLoading : true, isError : false, user_id : user_id});
        console.log("UserAbonementsForBuyingTab listAllLiteActiveAbonements user_id: " + user_id);

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

        return (
            <UserAbonementsForBuyingSubview
            user_id={this.state.user_id}
            date_of_action={this.state.date_of_action}
            abonementLiteViewModels={this.state.abonementLiteViewModels}
            purchaseAbonementNewPrepareCallback={this.props.purchaseAbonementNewPrepareCallback}
            />
        )
    }


}