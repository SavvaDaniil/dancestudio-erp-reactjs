import { Form } from "react-bootstrap";
import { SystemLoadingPage } from "../../pages/SystemLoading/SystemLoadingPage";
import { SystemErrorPage } from "../../pages/SystemError/SystemErrorPage";
import DateConverter from "../../utils/DateConverter";


export default function PurchaseAbonementEditModalBody(props){

    if(props.isLoading)return <SystemLoadingPage />
    if(props.isError)return <SystemErrorPage tryAgain={props.tryAgain} />

    let specialStatusToPrint = "";

    let abonementLiteViewModel = props.abonementLiteViewModel !== null ? props.abonementLiteViewModel : null;

    switch(props.special_status){
        case "raz":
            specialStatusToPrint = "Разовое";
            break;
        case "usual":
            specialStatusToPrint = "Абонемент";
            break;
        case "unlim":
            specialStatusToPrint = "Безлимитное";
            break;
        default:
            specialStatusToPrint = "<ошибка>";
            break;
    }

    let dateConverter = new DateConverter();
    let dateOfBuyStr = (props.date_of_buy !== null ? dateConverter.toStringLikeYmd(props.date_of_buy) : "");
    let dateOfActivationStr = (props.date_of_activation !== null ? dateConverter.toStringLikeYmd(props.date_of_activation) : "");
    let dateOfMustBeUsedToStr = (props.date_of_must_be_used_to !== null ? dateConverter.toStringLikeYmd(props.date_of_must_be_used_to) : "");

    return (
        <Form>
            <Form.Group>
                <Form.Label>ID</Form.Label>
                <Form.Control type="number" placeholder="ID" disabled={true}
                    defaultValue={props.id}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Дата покупки</Form.Label>
                <Form.Control name="date_of_buy" type="date" placeholder="Дата покупки"  
                    defaultValue={dateOfBuyStr}
                    onChange={props.formEditPurchaseAbonementListener}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Вид абонемента</Form.Label>
                <Form.Control type="text" placeholder="Вид абонемента" disabled={true}
                    defaultValue={specialStatusToPrint}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Наименование абонемента</Form.Label>
                <Form.Control type="text" placeholder="Наименование абонемента" disabled={true}
                    defaultValue={abonementLiteViewModel !== null ? abonementLiteViewModel.name : "<абонемент не найден>"}
                />
            </Form.Group>


            <Form.Group>
                <Form.Label>Количество дней (значение "0" недопустимо)</Form.Label>
                <Form.Control name="days" type="number" placeholder="Количество дней"  
                    defaultValue={props.days}
                    onChange={props.formEditPurchaseAbonementListener}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Дата активации</Form.Label>
                <Form.Control name="date_of_activation" type="date" placeholder="Дата активации"  
                    defaultValue={dateOfActivationStr}
                    onChange={props.formEditPurchaseAbonementListener}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Дата окончания действия</Form.Label>
                <Form.Control name="date_of_must_be_used_to" type="date" placeholder="Дата окончания действия"  
                    defaultValue={dateOfMustBeUsedToStr}
                    onChange={props.formEditPurchaseAbonementListener}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Изначально занятий</Form.Label>
                <Form.Control name="visits_start" type="number" placeholder="Изначально занятий"  
                    defaultValue={props.visits_start}
                    onChange={props.formEditPurchaseAbonementListener}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Осталось занятий</Form.Label>
                <Form.Control name="visits_left" type="number" placeholder="Осталось занятий"  
                    defaultValue={props.visits_left}
                    onChange={props.formEditPurchaseAbonementListener}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Посещений в базе</Form.Label>
                <Form.Control name="visits" type="number" placeholder="Посещений в базе" disabled={true} 
                    defaultValue={props.visits}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Наличными</Form.Label>
                <Form.Control name="price" type="number" placeholder="Наличными"  
                    defaultValue={props.price}
                    onChange={props.formEditPurchaseAbonementListener}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Безналичные</Form.Label>
                <Form.Control name="cashless" type="number" placeholder="Безналичные"  
                    defaultValue={props.cashless}
                    onChange={props.formEditPurchaseAbonementListener}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Комментарий:</Form.Label>
                <Form.Control name="comment" as="textarea" rows={5} placeholder="Комментарий"  
                    defaultValue={props.comment}
                    onChange={props.formEditPurchaseAbonementListener}
                />
            </Form.Group>

        </Form>
    )
}