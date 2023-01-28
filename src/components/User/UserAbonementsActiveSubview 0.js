import { Component } from "react"
import PurchaseAbonementService from "../../service/PurchaseAbonementService";
import AdminMiddleWare from "../../utils/AdminMiddleware";
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage";
import { SystemErrorPage } from "../../pages/SystemError/SystemErrorPage";


export default class UserAbonementsActiveSubview0 extends Component{

    constructor(props){
        super(props);
        this.state = {
            purchaseAbonementServce : new PurchaseAbonementService(),
            isLoading : false,
            isError : false,

            user_id : 0,
            date_of_buy : new Date(),
            purchaseAbonementLiteViewModels : [],
        }
        this.listAllLiteActiveForUserByDate = this.listAllLiteActiveForUserByDate.bind(this);
    }

    async listAllLiteActiveForUserByDate(user_id){
        this.setState({isLoading : true, isError : false, user_id : user_id});

        const adminMiddleWare = new AdminMiddleWare();
        const jwt = adminMiddleWare.getJWTFromCookie();
        
        const jsonAnswerStatus = await this.state.purchaseAbonementServce.listAllLiteActiveForUserByDate(jwt, user_id, this.state.date_of_buy);
        
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

    render(){

        if(this.state.isLoading)return <SystemLoadingPage />
        if(this.state.isError)return <SystemErrorPage tryAgain={() => this.listAllActiveByUserAndDate(this.state.user_id)} />

        let purchaseAbonementLites = "";
        if(this.state.purchaseAbonementLiteViewModels.length === 0){
            purchaseAbonementLites = <center><i>- автивных абонементов не найдено -</i></center>
        } else {
            purchaseAbonementLites = this.state.purchaseAbonementLiteViewModels.map((purchaseAbonementLiteViewModel) => {
                const dateOfBuy = new Date(purchaseAbonementLiteViewModel.date_of_buy);

                let labelPurchaseAbonementLast = "";
                if(purchaseAbonementLiteViewModel.date_of_activation === null){
                    labelPurchaseAbonementLast = "не акт";
                    labelPurchaseAbonementLast += <font>Возврат</font>
                } else {
                    
                }

                return <p className="purchase-abonement" key={purchaseAbonementLiteViewModel.id}>
                    <span>- {purchaseAbonementLiteViewModel.abonementLiteViewModel !== null ? purchaseAbonementLiteViewModel.abonementLiteViewModel.name : "<название утеряно>"} {purchaseAbonementLiteViewModel.price}</span> - осталось {purchaseAbonementLiteViewModel.visits_left} занятий 
                    (куплен {dateOfBuy.getDate() + "." + parseInt(("0" + (dateOfBuy.getMonth() + 1)).slice(-2), 10) + "." + dateOfBuy.getFullYear()}, {labelPurchaseAbonementLast}
                    )
                </p>
            });
        }

        return (
            <div className="subview purchase-abonements">
                {purchaseAbonementLites}
            </div>
        )
    }
}