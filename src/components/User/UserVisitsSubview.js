import { Button } from "react-bootstrap";
import DateConverter from "../../utils/DateConverter";


export default function UserVisitsSubview(props){
    
    if(typeof(props.visitLiteViewModels) === "undefined" || props.visitLiteViewModels === null)return <></>;

    const dateConverter = new DateConverter();

    let visits = "";
    if(props.visitLiteViewModels.length > 0){
        visits = props.visitLiteViewModels.map((visitLiteViewModel) => {
            const dateOfAction = new Date(visitLiteViewModel.date_of_action);

            const abonementLiteViewModel = (visitLiteViewModel.purchaseAbonementLiteViewModel !== null ? visitLiteViewModel.purchaseAbonementLiteViewModel.abonementLiteViewModel !== null ? visitLiteViewModel.purchaseAbonementLiteViewModel.abonementLiteViewModel : null : null);

            return <div key={visitLiteViewModel.id} className="visit-lite">
                <Button variant="danger" size="sm"><i className="fa fa-close"
                onClick={() => props.visitDeletePrepareCallback(
                    visitLiteViewModel.id,
                    (visitLiteViewModel.purchaseAbonementLiteViewModel !== null ? visitLiteViewModel.purchaseAbonementLiteViewModel.id : 0),
                    (abonementLiteViewModel !== null ? abonementLiteViewModel.name : "<покупка утеряна>")
                    )}
                ></i></Button> {dateConverter.toDateLikedmY(dateOfAction)} - {visitLiteViewModel.danceGroupPreviewViewModel !== null ? visitLiteViewModel.danceGroupPreviewViewModel.name : "<группа удалена>"} ({visitLiteViewModel.purchaseAbonementLiteViewModel !== null ? visitLiteViewModel.purchaseAbonementLiteViewModel.abonementLiteViewModel !== null ? visitLiteViewModel.purchaseAbonementLiteViewModel.abonementLiteViewModel.name : "<абонемент удален>" : "<покупка не найдена>"})
            </div>
        });
    } else {
        visits = <center><i>- визитов не найдено -</i></center>
    }

    return visits;
}