import { Alert, Button, Form, Table } from "react-bootstrap";
import { SystemErrorPage } from "../../pages/SystemError/SystemErrorPage"
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage"
import DateConverter from "../../utils/DateConverter";


export default function TeacherSalaryInfoModalBody(props){

    if(props.isLoading)return <SystemLoadingPage />
    if(props.isError)return <SystemErrorPage tryAgain={props.tryAgainCallback} />

    
    let visitLiteViewModelsTable = "";
    if(props.visitLiteViewModels === null){
        visitLiteViewModelsTable = <center><i>- Ошибка на сервере -</i></center>
    } else if(props.visitLiteViewModels.length === 0) {
        visitLiteViewModelsTable = <center><i>- Визитов не найдено -</i></center>
    } else {

        let dateConverter = new DateConverter();

        let numberOfVisit = 0;
        const visitLiteRows = props.visitLiteViewModels.map((visitLiteViewModel) => {
            
            let labelPurchaseAbonementInfo = "";
            let purchaseAbnementNameContent = "";
            if(visitLiteViewModel.purchaseAbonementLiteViewModel !== null){

                const purchaseAbonementLiteViewModel = visitLiteViewModel.purchaseAbonementLiteViewModel;
                const dateOfBuy = new Date(purchaseAbonementLiteViewModel.date_of_buy);

                if(purchaseAbonementLiteViewModel.date_of_activation === null){

                    labelPurchaseAbonementInfo = "осталось " + purchaseAbonementLiteViewModel.visits_left + " занятий (куплен " + dateConverter.toDateLikedmY(dateOfBuy) + ", не акт) ";
                } else {
    
                    const dateOfActivation = typeof(purchaseAbonementLiteViewModel.date_of_activation) !== "undefined" && purchaseAbonementLiteViewModel.date_of_activation !== null ? new Date( purchaseAbonementLiteViewModel.date_of_activation) : null;
                    const dateOfActivationStr = dateOfActivation !== null ? dateConverter.toDateLikedmY(dateOfActivation) : "<ошибка даты>";
    
                    const dateOfMustBeUsedTo = typeof(purchaseAbonementLiteViewModel.date_of_must_be_used_to) !== "undefined" && purchaseAbonementLiteViewModel.date_of_must_be_used_to !== null ? new Date( purchaseAbonementLiteViewModel.date_of_must_be_used_to) : null;
                    const dateOfMustBeUsedToStr = dateOfMustBeUsedTo !== null ? dateConverter.toDateLikedmY(dateOfMustBeUsedTo) : "<ошибка даты>";
    
                    labelPurchaseAbonementInfo = "осталось на момент покупки " + visitLiteViewModel.visits_left + " занятий из "+ purchaseAbonementLiteViewModel.visits_start +" (куплен " + dateConverter.toDateLikedmY(dateOfBuy) + ", акт. " 
                    + dateOfActivationStr + ", действителен до " + dateOfMustBeUsedToStr;
                }
    
                purchaseAbnementNameContent = purchaseAbonementLiteViewModel.abonementLiteViewModel !== null ? purchaseAbonementLiteViewModel.abonementLiteViewModel.name : "<название утеряно>";
            } else {
                purchaseAbnementNameContent = "<абонемент утерян>";
            }

            numberOfVisit++;
            return <tr key={visitLiteViewModel.id}>
                <td>
                    { numberOfVisit}
                </td>
                <td>
                    {visitLiteViewModel.id}
                </td>
                <td>
                    {visitLiteViewModel.userMicroViewModel !== null ? visitLiteViewModel.userMicroViewModel.secondname + " " +  visitLiteViewModel.userMicroViewModel.firstname : "<пользователь не найден>"}
                </td>
                <td>
                    {purchaseAbnementNameContent + " - " + labelPurchaseAbonementInfo}
                </td>
            </tr>
        });

        visitLiteViewModelsTable = <Table striped bordered hover>
        <thead>
            <tr>
                <th>№</th>
                <th>ID</th>
                <th>ФИО</th>
                <th>Оплачено</th>
            </tr>
        </thead>
        <tbody>
            {visitLiteRows}
        </tbody>
        </Table>;
    }

    let alertIsChangedByAdmin = "";
    if(props.teacherSalaryisChangedByAdmin){
        alertIsChangedByAdmin = <Alert variant="info">Ручной ввод</Alert>
    } else {
        alertIsChangedByAdmin = <Alert variant="success">Автоучёт</Alert>
    }


    return (
        <div>
            {visitLiteViewModelsTable}
            <p>Вычисленная автоматически зарплата: {props.teacherSalaryPriceAuto}</p>
            <hr />
            <Form>
                <Form.Group>
                    <Form.Label>Текущий режим</Form.Label>
                    {alertIsChangedByAdmin}
                </Form.Group>

                <Form.Group>
                    <Form.Label>Вычисленная автоматически зарплата</Form.Label>
                    <Form.Control type="number" name="price_fact" defaultValue={props.teacherSalaryPriceAuto} disabled={true} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Вручную введённая зарплата (фактическая)</Form.Label>
                    <Form.Control type="number" name="price_fact" defaultValue={props.teacherSalaryPriceFact}
                    onChange={props.teacherSalaryFormListenerCallback}
                    />
                    <Form.Text className="text-muted">
                        <i>ВНИМАНИЕ: при изменении значения фактической зарплаты, система перестанет её корректировать. Чтобы система снова начала корректировать автоматичсеки фактическую зарплату, нажмите пожалуйста "Восстановить автоучет"</i>
                    </Form.Text>
                </Form.Group>

                <Button variant="success" type="button" size="sm"
                onClick={() => props.updateCallback('price_fact', null)}
                >Сохранить вручную значение</Button><br />
                <Button variant="info" type="button" size="sm"
                onClick={() => props.updateCallback('is_changed_by_admin', 0)}
                >Восстановить автоучет</Button>
            </Form>
        </div>
    );

}