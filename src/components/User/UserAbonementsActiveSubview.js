import { Button } from "react-bootstrap";
import DateConverter from "../../utils/DateConverter";

export default function UserAbonementsActiveSubview(props){

    const dateConverter = new DateConverter();

    if(typeof(props.purchaseAbonementLiteViewModels) === "undefined" || props.purchaseAbonementLiteViewModels === null)return <></>;

    const isAsButton = (typeof(props.isAsButton) === "undefined" || props.isAsButton === null ? false : props.isAsButton);

    //console.log("function UserAbonementsActiveSubview");
    let purchaseAbonementLites = "";
    if(props.purchaseAbonementLiteViewModels.length === 0){
        purchaseAbonementLites = <center><i>- автивных абонементов не найдено -</i></center>
    } else {
        purchaseAbonementLites = props.purchaseAbonementLiteViewModels.map((purchaseAbonementLiteViewModel) => {
            const dateOfBuy = new Date(purchaseAbonementLiteViewModel.date_of_buy);

            let labelPurchaseAbonementInfo = "";
            let purshaseBtnDeletePrepare = ""
            if(purchaseAbonementLiteViewModel.date_of_activation === null){
                const abonementLiteViewModel = (purchaseAbonementLiteViewModel.abonementLiteViewModel !== null ? purchaseAbonementLiteViewModel.abonementLiteViewModel : null);

                labelPurchaseAbonementInfo = "осталось " + purchaseAbonementLiteViewModel.visits_left + " занятий (куплен " + dateConverter.toDateLikedmY(dateOfBuy) + ", не акт) ";

                purshaseBtnDeletePrepare = <Button variant="danger" size="sm"
                onClick={() => props.purchaseAbonementDeletePrepareCallback(purchaseAbonementLiteViewModel.id, (abonementLiteViewModel != null ? abonementLiteViewModel.name : "<наименование утеряно>"))}
                >Возврат</Button>
            } else {

                const dateOfActivation = typeof(purchaseAbonementLiteViewModel.date_of_activation) !== "undefined" && purchaseAbonementLiteViewModel.date_of_activation !== null ? new Date( purchaseAbonementLiteViewModel.date_of_activation) : null;
                const dateOfActivationStr = dateOfActivation !== null ? dateConverter.toDateLikedmY(dateOfActivation) : "<ошибка даты>";

                const dateOfMustBeUsedTo = typeof(purchaseAbonementLiteViewModel.date_of_must_be_used_to) !== "undefined" && purchaseAbonementLiteViewModel.date_of_must_be_used_to !== null ? new Date( purchaseAbonementLiteViewModel.date_of_must_be_used_to) : null;
                const dateOfMustBeUsedToStr = dateOfMustBeUsedTo !== null ? dateConverter.toDateLikedmY(dateOfMustBeUsedTo) : "<ошибка даты>";

                labelPurchaseAbonementInfo = "осталось " + purchaseAbonementLiteViewModel.visits_left + " занятий из "+ purchaseAbonementLiteViewModel.visits_start +" (куплен " + dateConverter.toDateLikedmY(dateOfBuy) + ", акт. " 
                + dateOfActivationStr + ", действителен до " + dateOfMustBeUsedToStr;
            }

            const purchaseAbnementNameContent = (!isAsButton ? <span>- {purchaseAbonementLiteViewModel.abonementLiteViewModel !== null ? purchaseAbonementLiteViewModel.abonementLiteViewModel.name : "<название утеряно>"} {purchaseAbonementLiteViewModel.price}</span> : <Button variant="secondary"
            onClick={() => props.visitNewCallback(
                props.user_id, 
                props.dance_group_id, 
                purchaseAbonementLiteViewModel.id, 
                props.date_of_action)}
            >{purchaseAbonementLiteViewModel.abonementLiteViewModel !== null ? purchaseAbonementLiteViewModel.abonementLiteViewModel.name : "<название утеряно>"}</Button>);

            return <div className="purchase-abonement" key={purchaseAbonementLiteViewModel.id}>
                {purchaseAbnementNameContent} - {labelPurchaseAbonementInfo} {purshaseBtnDeletePrepare}
            </div>
        });
    }

    return (
        <>
            {purchaseAbonementLites}
        </>
    )
    
}