import { SystemErrorPage } from "../../pages/SystemError/SystemErrorPage";
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage";
import UserAbonementsActiveSubview from "../User/UserAbonementsActiveSubview";
import UserAbonementsForBuyingSubview from "../User/UserAbonementsForBuyingSubview";
import UserVisitsSubview from "../User/UserVisitsSubview";


export default function VisitNewModalBody(props) {

    /*
    constructor(props){
        super(props);
        this.state = {

        }
    }
    */
    if(props.isLoading)return <SystemLoadingPage />
    if(props.isError)return <SystemErrorPage tryAgain={props.tryAgainCallback} />

    return (
        <>
            <h5>Оплата</h5>
            <UserAbonementsForBuyingSubview
            user_id={props.user_id}
            date_of_action={props.date_of_action}
            dance_group_id={props.dance_group_id}
            abonementLiteViewModels={props.abonementLiteViewModels}
            purchaseAbonementNewPrepareCallback={props.purchaseAbonementNewPrepareCallback}
            />

            <hr />
            <h5>Оформление визита</h5>

            <UserAbonementsActiveSubview
            user_id={props.user_id}
            dance_group_id={props.dance_group_id}
            date_of_action={props.date_of_action}
            isAsButton={true}
            purchaseAbonementLiteViewModels={props.purchaseAbonementLiteViewModels}
            purchaseAbonementDeletePrepareCallback={props.purchaseAbonementDeletePrepareCallback}

            visitNewCallback={props.visitNewCallback}
            />

            <hr />
            <h5>Визиты на занятие</h5>

            <UserVisitsSubview
            visitLiteViewModels={props.visitLiteViewModels}
            visitDeletePrepareCallback={props.visitDeletePrepareCallback}
            />
        </>
    )
}